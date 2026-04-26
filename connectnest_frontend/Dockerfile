ARG BUILD_FROM
FROM ${BUILD_FROM}

# Alpine packages — kept minimal: nginx for the overlay, jq for parsing
# Supervisor options, curl for Supervisor/HA API calls during first-run
# theme + panel install.
#
# Note: we do NOT install python3 here. The setup wizard (which needed
# python3) lives in a separate add-on. Keeping this image lean.
RUN apk add --no-cache \
        nginx \
        nginx-mod-http-headers-more \
        curl \
        jq \
        ca-certificates \
        tzdata

# Static branding assets (themes, icons, manifest, panel JS, CSS)
COPY rootfs/ /

# Download card-mod at build time — needed by the cn_dark theme for the
# sidebar header override. Pinned to a known-good version; bump when we
# verify a newer one against the HA version we ship for.
ARG CARD_MOD_VERSION=3.4.4
RUN mkdir -p /usr/share/nginx/cn-override \
 && curl -fsSL -o /usr/share/nginx/cn-override/card-mod.js \
        "https://github.com/thomasloven/lovelace-card-mod/releases/download/${CARD_MOD_VERSION}/card-mod.js"

# Background image — bundled inside the image so customers don't need
# internet access on first boot to render the login screen properly.
RUN curl -fsSL -o /usr/share/nginx/cn-override/static/cn-bg.jpg \
        "https://raw.githubusercontent.com/roarbis/connectnest-frontend/main/connectnest_frontend/rootfs/usr/share/nginx/cn-override/static/cn-bg.jpg" \
    || echo "cn-bg.jpg not yet in repo — using fallback colour background"

# Make startup script executable + nginx runtime dirs
RUN chmod a+x /run.sh \
 && mkdir -p /run/nginx /var/log/nginx

# Healthcheck — Supervisor uses the watchdog URL, but having a Docker-level
# check helps when running the image standalone for testing.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8099/ > /dev/null || exit 1

CMD ["/run.sh"]
