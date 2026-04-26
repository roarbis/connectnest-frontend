ARG BUILD_FROM
FROM ${BUILD_FROM}

# ── System packages ───────────────────────────────────────────
# nginx     : reverse proxy + sub_filter branding overlay
#             (sub_filter is built into the Alpine nginx package — no extra module needed)
# jq        : parse /data/options.json in run.sh
# curl      : Supervisor/HA API calls in run.sh + healthcheck
# ca-certificates, tzdata : TLS + correct timezone in logs
RUN echo "==> [CN] Installing system packages..." \
 && apk add --no-cache \
        nginx \
        curl \
        jq \
        ca-certificates \
        tzdata \
 && echo "==> [CN] Packages installed OK"

# ── Branding assets ───────────────────────────────────────────
# Copies themes, icons, manifests, panel JS, error page into the image
COPY rootfs/ /
# whats-new.json lives at the add-on root (not inside rootfs/) so it needs
# its own COPY to reach the OVERRIDE_DIR that run.sh expects
COPY whats-new.json /usr/share/nginx/cn-override/whats-new.json
RUN echo "==> [CN] rootfs assets copied OK"

# ── Startup script ────────────────────────────────────────────
COPY run.sh /run.sh
RUN chmod a+x /run.sh \
 && echo "==> [CN] run.sh installed OK"

# ── nginx runtime dirs ────────────────────────────────────────
RUN mkdir -p /run/nginx /var/log/nginx \
 && echo "==> [CN] nginx dirs created OK"

# ── card-mod (sidebar header override) ───────────────────────
# Pinned to a known-good release. Bump the version here when upgrading.
# Falls back gracefully if GitHub is unreachable at build time.
ARG CARD_MOD_VERSION=3.4.4
RUN echo "==> [CN] Downloading card-mod v${CARD_MOD_VERSION}..." \
 && mkdir -p /usr/share/nginx/cn-override \
 && ( curl -fsSL -o /usr/share/nginx/cn-override/card-mod.js \
          "https://github.com/thomasloven/lovelace-card-mod/releases/download/${CARD_MOD_VERSION}/card-mod.js" \
      || curl -fsSL -o /usr/share/nginx/cn-override/card-mod.js \
          "https://github.com/thomasloven/lovelace-card-mod/releases/download/v${CARD_MOD_VERSION}/card-mod.js" \
      || { echo "==> [CN] WARN: card-mod download failed — sidebar title override will not work"; \
           echo "// card-mod unavailable at build time" > /usr/share/nginx/cn-override/card-mod.js; } \
    ) \
 && echo "==> [CN] card-mod step done"

# cn-bg.png is bundled in rootfs/ and copied by the COPY rootfs/ step above.
RUN echo "==> [CN] Background image bundled in rootfs OK"

# ── Healthcheck ───────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8099/ > /dev/null || exit 1

CMD ["/run.sh"]
