# Changelog

All notable changes to Connect Nest Frontend are documented here. Customers see a
short version of these notes inside the **About Connect Nest** panel — see
[`whats-new.json`](connectnest_frontend/whats-new.json).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Calendar Versioning](https://calver.org/) (`YYYY.MM.PATCH`)
to mirror the Home Assistant Core release it is tested against.

---

## [2025.4.12] — 2026-04-28

### Added
- **Back button on the About Connect Nest panel** — small circular icon-only
  button at the top-left, matching the look of HA's other panel pages.
  Calls `history.back()` when there is browser history; falls back to `/`
  otherwise (covers the case where a user opened the panel via direct URL).

### Fixed
- **Stale version label on About panel** — the hardcoded `VERSION` constant
  was still showing `v2025.4.5` even though the add-on had moved to
  `2025.4.11`. Now in sync. Comment added next to the constant reminding
  future-us to bump it alongside `config.yaml` / `run.sh` / `whats-new.json`.

---

## [2025.4.11] — 2026-04-28

### Added
- **Branded "Forgot password?" link on login page** — appended below the auth
  form via `cn-init.js`. One-tap WhatsApp message to CN support
  (`+61 492 970 809`) plus a `tel:` fallback. Replaces silent failure when
  customers forget passwords with an explicit human-contact path.
- **Hub-offline banner** — slides down from the top of every page when the
  WebSocket connection drops for 4+ seconds. Includes a "Get help" link to
  WhatsApp. Hides automatically on reconnect. Polled every 2s, requires two
  consecutive offline samples before showing (avoids flashing during normal
  page transitions or auth refreshes).

### Changed
- **Wallpaper format `cn-bg.png` → `cn-bg.webp`** — 1.4 MB → 66 KB, ~95.5%
  smaller with no perceptible quality loss at q90. iOS 14+ Safari supports
  WebP universally, so safe for the customer base. nginx location block,
  Dockerfile reference and theme `background-image:` URLs all updated in
  lockstep. Cache headers unchanged (1 day).
- **CN favicon override** — `nginx sub_filter` now replaces HA's
  `<link rel="icon" href="/static/icons/favicon.ico">` with two CN PNGs
  (128×128 and 48×48). Browser tabs, bookmarks and history entries now show
  the Connect Nest icon instead of HA's blue diamond.
- **CN mask-icon override** — Safari pinned-tabs and macOS Dock icons now
  pick up the CN icon at the CN teal accent colour instead of HA's blue.

---

## [2025.4.10] — 2026-04-28

### Fixed
- **Illegible dropdown text in Profile / settings dialogs** (`cn_dark` and
  `cn_glass`) — HA 2026.4 reads a wider set of `mdc-*` and `mwc-*` variables
  for filled text fields and selects than older releases. Our themes had only
  set the legacy subset, leaving the fill colour to fall back to a near-default
  light shade while text stayed white → unreadable. All three themes now
  comprehensively override `mdc-text-field-*`, `mdc-select-*`, `mdc-menu-surface-*`,
  and `mdc-theme-on-surface` with explicit dark fills (cn_dark / cn_glass) or
  light fills (cn_light) and matching contrast text colours.

---

## [2025.4.9] — 2026-04-27

### Fixed
- **Ingress port collision (`bind() to 0.0.0.0:8099 failed`)** — moved the
  internal nginx ingress port from `8099` to `8919`. With `host_network: true`
  the chosen port must be unique on the host; `8099` is HA Supervisor's
  default ingress port and frequently already in use by other add-ons.
  Updated `config.yaml`, `run.sh`, the Dockerfile healthcheck, and the
  watchdog URL in lockstep.

---

## [2025.4.8] — 2026-04-27

### Added
- **Bubble Card v3.1.6 bundled** — premium iOS Control Center–style pill button
  card library. Downloaded into the Docker image at build time (pinned, no
  runtime fetch), deployed to `/config/www/cn-cards/bubble-card.js` plus the
  `bubble-pop-up-fix.js`.
- **HACS-aware deploy** — `run.sh` now detects existing Bubble Card installs
  under `/config/www/community/Bubble-Card/` and skips the bundled copy to
  prevent duplicate custom-element registration.
- **Bubble CSS variables in all themes** — `cn_glass`, `cn_dark`, `cn_light`
  set `--bubble-accent-color`, `--bubble-border-radius`,
  `--bubble-main-background-color` and friends via `var()` references, so any
  `custom:bubble-card` automatically inherits CN teal accents and the active
  theme's surface colour without per-card YAML.

### Changed
- **Wallpaper cache reduced from 30d to 1d** — `cn-bg.png` now refreshes within
  24 hours of an add-on update instead of forcing a hard browser refresh.
- **First-run `configuration.yaml` template** now lists
  `/local/cn-cards/bubble-card.js` under `extra_module_url`. Existing
  installations get a clear log warning with the exact line to add.

### Notes
- Bubble Card is **opt-in** — your existing dashboards keep working untouched.
  To use it, add `type: custom:bubble-card` to a card and pick a sub-type from
  https://github.com/Clooos/Bubble-Card.

---

## [2025.4.7] — 2026-04-27

### Added
- **`cn_glass` theme** — visionOS-inspired glassmorphic theme with auto
  light/dark mode switching. Translucent cards with `blur(20px) saturate(160%)`
  over the bundled wallpaper, glass-edge inset shadows, and CN teal accents.
  Available alongside `cn_dark` and `cn_light` via the add-on options dropdown.
- `.ohf-logo` selector added to `cn-hide-leaks.js` so the Open Home Foundation
  badge no longer flashes on the launch splash.

### Fixed
- **Apple Smart App Banner** — `<meta name="apple-itunes-app" content="app-id=1099568401">`
  was leaking through and prompting iPhone Safari users to install the Home
  Assistant Companion app. Stripped via nginx `sub_filter` on both server blocks.

---

## [2025.4.6] — 2026-04-27

### Fixed
- **Browser freeze / "Loading data" hang on port 7080** — `cn-init.js` was running
  all MutationObservers immediately when HA loaded its extra modules, blocking
  HA's WebSocket authentication loop. All heavy observers now wait until
  `home-assistant.hass` exists (HA fully authenticated) before starting.
  Login page logo still injects immediately as it is needed pre-auth.
- **`cn-hide-leaks.js` O(n) observer** — was calling `walkShadowRoots(document.documentElement)`
  on every DOM mutation, re-traversing the entire document tree. Now processes
  only newly added nodes, matching the pattern used in `cn-scrubber.js`.

---

## [2025.4.5] — 2026-04-27

### Added
- **CN logo in sidebar** — Connect Nest icon appears above "Connect Hub" in both themes
- **Login page logo** — CN icon, brand name, and tagline above the login form
- **Sidebar quick-links** — Devices, Automations, Dashboards, Apps shortcuts injected
  below the main nav via `cn-init.js`
- **User avatar override** — profile badge replaced with CN icon instead of initials
- **Branded notification toasts** — teal accent colours applied to snackbars and alerts
- **Custom "page not found" screen** — CN-styled 404 with navigation and WhatsApp link
- **Background wallpaper bundled** — `cn-bg.png` now ships inside the add-on image;
  no longer fetched from GitHub at build time (faster installs, works offline)
- **Add-on store icon** — `icon.png` added so the add-on shows the CN logo in
  Settings → Apps

### Fixed
- **400 Bad Request on port 7080** — HA 2024+ validates the `Host` header and
  rejects requests from untrusted proxies. `run.sh` now auto-adds an `http:`
  block with `use_x_forwarded_for: true` and `trusted_proxies: [127.0.0.1, ::1]`
  to `configuration.yaml` on first run, then restarts HA Core to apply it.
- **nginx duplicate MIME type warning** — removed `text/html` from
  `sub_filter_types` (it is sub_filter's implicit default and listing it
  explicitly generates a harmless but noisy warning).
- **Missing `X-Forwarded-Proto` header** on direct port (7080) server block —
  added to match the ingress block.

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

[2025.4.5]: https://github.com/roarbis/connectnest-frontend/releases/tag/2025.4.5
[2025.4.1]: https://github.com/roarbis/connectnest-frontend/releases/tag/2025.4.1
[2025.4.0]: https://github.com/roarbis/connectnest-frontend/releases/tag/2025.4.0
