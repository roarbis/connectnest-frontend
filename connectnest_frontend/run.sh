#!/usr/bin/env bash
# ============================================================
#  Connect Nest Frontend — Startup Script
#
#  Reads HA Supervisor add-on options, generates the nginx
#  config, installs themes + custom panel + branding JS into
#  HA's /config directory, then runs nginx in the foreground.
#
#  Wizard logic is INTENTIONALLY not in this script — that
#  lives in the connectnest-wizard add-on (separate repo).
# ============================================================

set -euo pipefail

# ─── Logging helpers ────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${CYAN}[Connect Nest]${NC} $*"; }
success() { echo -e "${GREEN}[Connect Nest] ✓${NC} $*"; }
warn()    { echo -e "${YELLOW}[Connect Nest] ⚠${NC} $*"; }
error()   { echo -e "${RED}[Connect Nest] ✗${NC} $*"; exit 1; }

# ─── Read add-on options from Supervisor ────────────────────
OPTIONS_FILE=/data/options.json
HA_PORT=$(jq --raw-output '.ha_port // 8123' "$OPTIONS_FILE")
DEFAULT_THEME=$(jq --raw-output '.default_theme // "cn_dark"' "$OPTIONS_FILE")
SSL=$(jq --raw-output '.ssl // false' "$OPTIONS_FILE")
CERTFILE=$(jq --raw-output '.certfile // "fullchain.pem"' "$OPTIONS_FILE")
KEYFILE=$(jq --raw-output '.keyfile // "privkey.pem"' "$OPTIONS_FILE")

ADDON_VERSION="2025.4.11"
INGRESS_PORT=8919
DIRECT_PORT=7080
OVERRIDE_DIR=/usr/share/nginx/cn-override

info "============================================"
info "  Connect Nest Frontend ${ADDON_VERSION}"
info "  Turn On Smart Living"
info "============================================"

# ─── Ensure SUPERVISOR_TOKEN is available ───────────────────
if [[ -z "${SUPERVISOR_TOKEN:-}" ]]; then
    _TOKEN_FILE="/run/s6/container_environment/SUPERVISOR_TOKEN"
    if [[ -f "$_TOKEN_FILE" ]]; then
        SUPERVISOR_TOKEN=$(cat "$_TOKEN_FILE")
        export SUPERVISOR_TOKEN
        info "SUPERVISOR_TOKEN loaded from s6 env dir"
    else
        warn "SUPERVISOR_TOKEN not found — Supervisor API calls will be skipped"
    fi
fi
info "HA backend port:  ${HA_PORT}"
info "Default theme:    ${DEFAULT_THEME}"
info "SSL enabled:      ${SSL}"

# ─── Detect HA Core version (informational only) ────────────
HA_VERSION=$(curl -s \
    -H "Authorization: Bearer ${SUPERVISOR_TOKEN:-}" \
    http://supervisor/core/info 2>/dev/null \
    | jq -r '.data.version // "unknown"' 2>/dev/null) || HA_VERSION="unknown"
info "HA Core version detected: ${HA_VERSION}"

# ─── Generate nginx config ──────────────────────────────────
info "Generating nginx config..."

cat > /etc/nginx/nginx.conf << NGINX_EOF
worker_processes 1;
error_log /proc/1/fd/1 warn;
pid /run/nginx/nginx.pid;

events {
    worker_connections 512;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format main '\$remote_addr [\$time_local] "\$request" \$status \$body_bytes_sent';
    access_log /proc/1/fd/1 main;

    sendfile on;
    keepalive_timeout 65;

    gzip on;
    gzip_types text/plain text/css application/json
               application/javascript text/javascript;

    map \$http_upgrade \$connection_upgrade {
        default upgrade;
        ''      close;
    }

    upstream ha_backend {
        server 127.0.0.1:${HA_PORT};
        keepalive 16;
    }

    # ─── Common branding overlay (used by both servers) ────
    # We define the same routes twice (ingress + direct port)
    # because HA's ingress uses different headers. Keeping them
    # split is uglier but more reliable than DRYing it up with
    # nginx includes — ingress quirks are subtle.

    # ─── Server: HA ingress (sidebar panel) ───────────────
    server {
        listen ${INGRESS_PORT};
        server_name _;

        # CN-branded PWA manifest
        location = /manifest.json {
            alias ${OVERRIDE_DIR}/manifest.json;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Content-Type "application/manifest+json";
        }

        # CN icons (fall back to HA icons if a size isn't overridden)
        location /static/icons/ {
            root ${OVERRIDE_DIR};
            try_files \$uri @ha_backend;
            expires 30d;
        }

        # CN background image
        location = /cn-bg.webp {
            alias ${OVERRIDE_DIR}/static/cn-bg.webp;
            expires 1d;
            add_header Cache-Control "public, max-age=86400";
            add_header Content-Type "image/webp";
        }

        # WebSocket — required for real-time HA state updates
        location /api/websocket {
            proxy_pass http://ha_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_set_header X-Ingress-Path \$http_x_ingress_path;
            proxy_read_timeout 86400;
            proxy_send_timeout 86400;
        }

        location @ha_backend {
            proxy_pass http://ha_backend;
            proxy_http_version 1.1;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Ingress-Path \$http_x_ingress_path;
        }

        # Everything else → HA Core, with runtime branding sub_filter
        location / {
            proxy_pass http://ha_backend;
            proxy_http_version 1.1;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection \$connection_upgrade;
            proxy_set_header X-Ingress-Path \$http_x_ingress_path;
            # Disable upstream compression so sub_filter can rewrite content
            proxy_set_header Accept-Encoding "";

            sub_filter_once off;
            sub_filter 'Home Assistant' 'Connect Nest';
            sub_filter 'home-assistant' 'connect-nest';
            # Strip Apple Smart App Banner that pushes the HA Companion app
            sub_filter '<meta name="apple-itunes-app" content="app-id=1099568401">' '';
            # Replace HA's favicon and mask-icon with CN equivalents
            sub_filter '<link rel="icon" href="/static/icons/favicon.ico">' '<link rel="icon" type="image/png" sizes="128x128" href="/static/icons/cn-icon-128.png"><link rel="icon" type="image/png" sizes="48x48" href="/static/icons/cn-icon-48.png">';
            sub_filter '<link rel="mask-icon" href="/static/icons/mask-icon.svg" color="#18bcf2">' '<link rel="mask-icon" href="/static/icons/cn-icon-96.png" color="#15C7B4">';
            sub_filter '</head>' '<link rel="apple-touch-icon" sizes="180x180" href="/static/icons/cn-icon-180.png"><link rel="apple-touch-icon" sizes="152x152" href="/static/icons/cn-icon-152.png"><link rel="apple-touch-icon" sizes="120x120" href="/static/icons/cn-icon-120.png"><meta name="apple-mobile-web-app-title" content="Connect Nest"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&family=Baumans&display=swap"></head>';
            # text/html is sub_filter's default — listing it explicitly causes a warning
            sub_filter_types text/javascript application/javascript application/json;

            proxy_buffer_size 128k;
            proxy_buffers 8 128k;
        }

        error_page 502 503 504 /cn-error.html;
        location = /cn-error.html {
            root ${OVERRIDE_DIR};
            internal;
        }
    }

    # ─── Server: direct port ${DIRECT_PORT} (PWA install URL) ──
    server {
        listen ${DIRECT_PORT};
        server_name _;

        location = /manifest.json {
            alias ${OVERRIDE_DIR}/manifest.json;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Content-Type "application/manifest+json";
        }

        location /static/icons/ {
            root ${OVERRIDE_DIR};
            try_files \$uri @ha_direct;
            expires 30d;
        }

        location = /cn-bg.webp {
            alias ${OVERRIDE_DIR}/static/cn-bg.webp;
            expires 1d;
            add_header Cache-Control "public, max-age=86400";
            add_header Content-Type "image/webp";
        }

        location /api/websocket {
            proxy_pass http://ha_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_read_timeout 86400;
            proxy_send_timeout 86400;
        }

        location @ha_direct {
            proxy_pass http://ha_backend;
        }

        location / {
            proxy_pass http://ha_backend;
            proxy_http_version 1.1;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection \$connection_upgrade;
            proxy_set_header Accept-Encoding "";

            sub_filter_once off;
            sub_filter 'Home Assistant' 'Connect Nest';
            sub_filter 'home-assistant' 'connect-nest';
            # Strip Apple Smart App Banner that pushes the HA Companion app
            sub_filter '<meta name="apple-itunes-app" content="app-id=1099568401">' '';
            # Replace HA's favicon and mask-icon with CN equivalents
            sub_filter '<link rel="icon" href="/static/icons/favicon.ico">' '<link rel="icon" type="image/png" sizes="128x128" href="/static/icons/cn-icon-128.png"><link rel="icon" type="image/png" sizes="48x48" href="/static/icons/cn-icon-48.png">';
            sub_filter '<link rel="mask-icon" href="/static/icons/mask-icon.svg" color="#18bcf2">' '<link rel="mask-icon" href="/static/icons/cn-icon-96.png" color="#15C7B4">';
            sub_filter '</head>' '<link rel="apple-touch-icon" sizes="180x180" href="/static/icons/cn-icon-180.png"><link rel="apple-touch-icon" sizes="152x152" href="/static/icons/cn-icon-152.png"><link rel="apple-touch-icon" sizes="120x120" href="/static/icons/cn-icon-120.png"><meta name="apple-mobile-web-app-title" content="Connect Nest"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&family=Baumans&display=swap"></head>';
            sub_filter_types text/javascript application/javascript application/json;

            proxy_buffer_size 128k;
            proxy_buffers 8 128k;
        }

        error_page 502 503 504 /cn-error.html;
        location = /cn-error.html {
            root ${OVERRIDE_DIR};
            internal;
        }
    }
}
NGINX_EOF

success "nginx config generated"

info "Validating nginx configuration..."
nginx -t 2>&1 || error "nginx config validation failed"
success "nginx config valid"

# ─── First-run setup: themes + panel + JS into /config/ ─────
# Re-runs are idempotent. Use a marker file so we don't fight
# the customer if they edit configuration.yaml themselves.
MARKER=/config/.cn_frontend_setup_done

# Always copy theme files (refresh on every version bump so theme
# tweaks ship without forcing the customer to delete the marker)
mkdir -p /config/themes
cp ${OVERRIDE_DIR}/themes/cn_dark.yaml  /config/themes/cn_dark.yaml
cp ${OVERRIDE_DIR}/themes/cn_light.yaml /config/themes/cn_light.yaml
cp ${OVERRIDE_DIR}/themes/cn_glass.yaml /config/themes/cn_glass.yaml
success "Themes installed: cn_dark + cn_light + cn_glass"

# Always copy panel JS + branding JS to HA's /local/ folder
# (they're versioned by content, so refresh is cheap)
mkdir -p /config/www
cp ${OVERRIDE_DIR}/panels/cn-about-panel.js /config/www/cn-about-panel.js
cp ${OVERRIDE_DIR}/js/cn-init.js            /config/www/cn-init.js
cp ${OVERRIDE_DIR}/js/cn-scrubber.js        /config/www/cn-scrubber.js
cp ${OVERRIDE_DIR}/js/cn-hide-leaks.js      /config/www/cn-hide-leaks.js
cp ${OVERRIDE_DIR}/whats-new.json           /config/www/cn-whats-new.json
cp ${OVERRIDE_DIR}/card-mod.js              /config/www/card-mod.js
success "Panel + branding JS installed to /config/www/"

# ─── Bubble Card (bundled, namespaced under /cn-cards/) ─────
# Skip our copy if the customer already has Bubble Card installed via HACS.
# That avoids duplicate custom-element registration which would crash the
# dashboard. We never touch /config/www/community/ — that's HACS territory.
mkdir -p /config/www/cn-cards
HACS_BUBBLE=/config/www/community/Bubble-Card/bubble-card.js
HACS_BUBBLE_LC=/config/www/community/bubble-card/bubble-card.js
if [[ -f "$HACS_BUBBLE" ]] || [[ -f "$HACS_BUBBLE_LC" ]]; then
    info "HACS Bubble Card detected — skipping bundled copy to avoid conflict"
    CN_BUBBLE_VIA_HACS=true
else
    cp ${OVERRIDE_DIR}/cards/bubble-card.js        /config/www/cn-cards/bubble-card.js
    cp ${OVERRIDE_DIR}/cards/bubble-pop-up-fix.js  /config/www/cn-cards/bubble-pop-up-fix.js 2>/dev/null || true
    success "Bubble Card installed to /config/www/cn-cards/"
    CN_BUBBLE_VIA_HACS=false
fi

# Register card-mod via Lovelace API (no HA restart needed)
if [[ -n "${SUPERVISOR_TOKEN:-}" ]]; then
    LOVELACE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
        -H "Content-Type: application/json" \
        -d '{"url": "/local/card-mod.js", "res_type": "module"}' \
        "http://supervisor/core/api/lovelace/resources" 2>/dev/null) || true
    if [[ "$LOVELACE_STATUS" =~ ^2 ]]; then
        success "card-mod registered via Lovelace API"
    else
        info "card-mod already registered (Lovelace API returned ${LOVELACE_STATUS})"
    fi
fi

# Add frontend + panel_custom config blocks (first run only)
if [[ ! -f "$MARKER" ]]; then
    info "First run — patching configuration.yaml..."
    if ! grep -q "^frontend:" /config/configuration.yaml 2>/dev/null; then
        cat >> /config/configuration.yaml << 'YAML_EOF'

# ─── Connect Nest Frontend ─────────────────────────────────
# Auto-added by the Connect Nest Frontend add-on.
# Edit with care — incorrect changes will break the branded UI.
frontend:
  themes: !include_dir_merge_named themes
  extra_module_url:
    - /local/card-mod.js
    - /local/cn-init.js
    - /local/cn-cards/bubble-card.js

panel_custom:
  - name: cn-about
    sidebar_title: About Connect Nest
    sidebar_icon: mdi:information-outline
    url_path: cn-about
    module_url: /local/cn-about-panel.js
    embed_iframe: false
    require_admin: false
# ─── End Connect Nest Frontend ─────────────────────────────
YAML_EOF
        success "configuration.yaml patched (frontend + panel_custom)"
    else
        warn "configuration.yaml already has a frontend: block — skipping auto-patch"
        warn "Manual step needed — see /docs/INSTALL.md → 'Manual configuration.yaml edits'"
    fi
    touch "$MARKER"
fi

# ─── Existing-install reminder for new modules ──────────────
# We patch configuration.yaml only on first run (behind MARKER). For upgraders,
# we can't safely auto-edit their file — but we can detect missing entries and
# print a clear instruction so they know what to add.
if [[ -f "$MARKER" ]] && [[ "${CN_BUBBLE_VIA_HACS}" != "true" ]]; then
    if grep -q "extra_module_url" /config/configuration.yaml 2>/dev/null \
       && ! grep -q "cn-cards/bubble-card.js" /config/configuration.yaml 2>/dev/null; then
        warn "─────────────────────────────────────────────────────────"
        warn "Bubble Card is bundled but NOT yet in your extra_module_url."
        warn "To enable it, edit /config/configuration.yaml and add this"
        warn "line under your existing 'extra_module_url:' block:"
        warn "    - /local/cn-cards/bubble-card.js"
        warn "Then restart Home Assistant Core."
        warn "─────────────────────────────────────────────────────────"
    fi
fi

# Always reload themes (picks up new theme values on version upgrades)
if [[ -n "${SUPERVISOR_TOKEN:-}" ]]; then
    curl -s -X POST \
        -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
        "http://supervisor/core/api/services/frontend/reload_themes" > /dev/null 2>&1 || true

    # Apply the configured default theme via HA's frontend.set_theme service
    curl -s -X POST \
        -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"${DEFAULT_THEME}\"}" \
        "http://supervisor/core/api/services/frontend/set_theme" > /dev/null 2>&1 || true
    info "Default theme set to ${DEFAULT_THEME}"
fi

# ─── Ensure HA trusts nginx as a local proxy ────────────────
# HA 2024+ validates the Host header and returns 400 if requests arrive via
# an untrusted proxy. We need trusted_proxies: 127.0.0.1 in the http: block.
# This is a one-time patch; if an http: block already exists we warn the user.
CN_NEEDS_HA_RESTART=false
if ! grep -q "trusted_proxies" /config/configuration.yaml 2>/dev/null; then
    if ! grep -q "^http:" /config/configuration.yaml 2>/dev/null; then
        info "Adding http: trusted_proxies to configuration.yaml..."
        cat >> /config/configuration.yaml << 'YAML_EOF'

# ─── Connect Nest — reverse proxy trust ──────────────────────
# Allows nginx (127.0.0.1) to proxy requests to HA without triggering
# the host-header security check (HTTP 400 Bad Request).
# See: https://www.home-assistant.io/integrations/http/#reverse-proxies
http:
  use_x_forwarded_for: true
  trusted_proxies:
    - 127.0.0.1
    - ::1
# ─── End Connect Nest — reverse proxy trust ───────────────────
YAML_EOF
        success "trusted_proxies added — HA Core restart needed to apply"
        CN_NEEDS_HA_RESTART=true
    else
        warn "http: block already exists in configuration.yaml — cannot auto-add trusted_proxies"
        warn "If port 7080 returns 400, manually add to your http: block:"
        warn "  use_x_forwarded_for: true"
        warn "  trusted_proxies:"
        warn "    - 127.0.0.1"
        warn "    - ::1"
        warn "Then restart Home Assistant Core."
    fi
fi

# ─── Restart HA Core if proxy trust config was added ────────
if [[ "${CN_NEEDS_HA_RESTART}" == "true" ]] && [[ -n "${SUPERVISOR_TOKEN:-}" ]]; then
    info "Restarting HA Core to apply trusted_proxies (takes ~45s)..."
    curl -s -X POST \
        -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
        "http://supervisor/core/restart" > /dev/null 2>&1 || true
    # Give HA time to shut down before we start waiting for it
    sleep 15
fi

# ─── Wait for HA Core (best effort) ─────────────────────────
info "Waiting for HA Core on port ${HA_PORT}..."
MAX_WAIT=120
WAITED=0
until curl -s --max-time 3 "http://127.0.0.1:${HA_PORT}/" -o /dev/null 2>&1; do
    if [[ $WAITED -ge $MAX_WAIT ]]; then
        warn "HA Core not ready after ${MAX_WAIT}s — starting anyway"
        break
    fi
    sleep 2
    WAITED=$((WAITED + 2))
done
[[ $WAITED -lt $MAX_WAIT ]] && success "HA Core is ready"

# ─── Start nginx ────────────────────────────────────────────
info "Starting Connect Nest Frontend..."
success "Connect Nest is running!"
info "  Sidebar (HA ingress): http://[your-hub]:8123 → Connect Nest"
info "  Direct browser:       http://[your-hub]:${DIRECT_PORT}"
info "  iPhone PWA install:   http://[your-hub]:${DIRECT_PORT} in Safari → Add to Home Screen"
info ""

exec nginx -g "daemon off;"
