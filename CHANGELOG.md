# Changelog

All notable changes to Connect Nest Frontend are documented here. Customers see a
short version of these notes inside the **About Connect Nest** panel — see
[`whats-new.json`](connectnest_frontend/whats-new.json).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Calendar Versioning](https://calver.org/) (`YYYY.MM.PATCH`)
to mirror the Home Assistant Core release it is tested against.

---

## [2025.4.2] — 2026-04-27

### Fixed
- **Startup crash** — `whats-new.json` was at the add-on root but never copied
  into the container. `run.sh` called `cp` on a path that didn't exist, and
  `set -euo pipefail` caused an immediate exit. Added `COPY whats-new.json` to
  the Dockerfile so it lands at the expected `OVERRIDE_DIR` path.

---

## [2025.4.1] — 2026-04-27

### Fixed
- **Dockerfile build failure** — `run.sh` was never copied into the container,
  causing `chmod a+x /run.sh` to fail and the install to abort. Added explicit
  `COPY run.sh /run.sh` before the chmod step.
- Removed `nginx-mod-http-headers-more` from apk packages — not used in our nginx
  config and unavailable on some HA base image variants.

### Improved
- Every `RUN` step in the Dockerfile now prints a `==> [CN]` diagnostic line so
  build failures are immediately visible in **Settings → System → Logs → Supervisor**.
- card-mod download now retries with both `3.x.x` and `v3.x.x` tag formats and
  stubs a no-op file if GitHub is unreachable, so the build never hard-fails on
  a network hiccup.

### Changed
- Add-on display name updated to **Connect Nest FrontEnd** (capital E).

---

## [2025.4.0] — 2026-04-30

### Added
- First release as a standalone Home Assistant add-on (split from the original
  monolithic Connect Nest add-on)
- Brand-new **About Connect Nest** panel — replaces the Home Assistant About page
  with Connect Nest mission, contact, version, and live system health
- **What's New** section inside the About panel, driven by `whats-new.json`
- **System Health** widget — at-a-glance hub, internet, and backup status
- One-tap **WhatsApp**, email, and phone support links
- DOM-level branding cleanup that catches lazy-loaded strings as panels open
- Custom light theme (`cn_light`) for daytime use, alongside the existing dark theme

### Changed
- Default theme remains `cn_dark` for new installs
- Tagline aligned with the live website ("Turn On Smart Living")

### Removed
- Onboarding wizard — moved to the separate `connectnest-wizard` repository
  (planned). Customers running the original add-on should follow
  [docs/UPGRADE-FROM-V2.md](docs/UPGRADE-FROM-V2.md)

[2025.4.2]: https://github.com/roarbis/connectnest-frontend/releases/tag/2025.4.2
[2025.4.1]: https://github.com/roarbis/connectnest-frontend/releases/tag/2025.4.1
[2025.4.0]: https://github.com/roarbis/connectnest-frontend/releases/tag/2025.4.0
