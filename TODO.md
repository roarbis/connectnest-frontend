# Connect Nest Frontend — To-Do

Living backlog of improvements queued for upcoming releases. Items move from
here into `CHANGELOG.md` once shipped.

> Risk: 🟢 trivial · 🟡 moderate · 🔴 needs care
> Effort: S = <1hr · M = 2–4hr · L = day+

---

## 🛠 Utility — customer-facing pain relief

| # | Idea | Risk | Effort | Notes |
|---|------|------|--------|-------|
| 1 | **Floating "Help" button** (FAB) bottom-right with WhatsApp / email / call to CN support | 🟢 | S | Visible on every page; reduces support tickets and humanises the product |
| 3 | **WhatsApp QR code on About panel** | 🟢 | S | One-scan opens chat with CN support; customer-friendly, no typing |
| 4 | **Customer-friendly error message replacements** | 🟢 | M | Replace HA's `Could not establish connection` with `Hub appears offline. Pull to refresh or call support` etc. |

## ⚡ Performance — felt as snappiness

| # | Idea | Risk | Effort | Notes |
|---|------|------|--------|-------|
| 6 | **Service worker for app shell** | 🟡 | M | PWA opens to last cached UI instantly even when hub rebooting; "feels native" |
| 7 | **Convert PNG icons to WebP** with PNG fallback | 🟢 | S | Apple touch-icon doesn't support WebP, so keep PNG for those; convert manifest icons |
| 9 | **Enable HTTP/2 in nginx** | 🟢 | S | Multiplexed asset delivery; needs SSL or HTTP/2 cleartext (h2c) |
| 10 | **Lazy-load `cn-about-panel.js`** | 🟢 | S | Only fetch when user opens About panel; trims first-load JS |

## 🤝 Ease of use — reduces "how do I…" calls

| # | Idea | Risk | Effort | Notes |
|---|------|------|--------|-------|
| 11 | **First-launch welcome tour** — 4 dismiss-once slides | 🟡 | M | Sidebar / Rooms / About / How to call us. The de facto user manual |
| 12 | **Personalised greeting on dashboard** — "Good morning, Alex" | 🟢 | S | Uses `hass.user.name` + time-of-day; tiny touch, big perceived premium |
| 13 | **Skeleton loading instead of "Loading data" spinner** | 🟡 | M | Branded shimmer in the layout shape; feels intentional vs broken |
| 14 | **Post-update notification toast** — "Connect Nest updated to vX.X.X — see what's new" | 🟢 | S | Detects version change vs last seen, links to About panel |
| 15 | **Accessibility — "Easy Mode" toggle** | 🟡 | M | 110% font, 56×56 touch targets; CN-stored preference |

## 🎨 Beautiful & intuitive — premium feel

| # | Idea | Risk | Effort | Notes |
|---|------|------|--------|-------|
| 17 | **PWA install screenshots** in manifest.json | 🟢 | S | Apple shows them in "Add to Home Screen" preview; first-impression polish |
| 18 | **Branded confirm/alert dialogs** | 🟢 | S | CSS-inject CN teal buttons + Raleway font into HA's stock Material modals |
| 19 | **Connection status pill** top-right — "Connected ●" / "Reconnecting…" / "Offline" | 🟢 | M | Replaces silent failure; complements item 2 (banner is for prolonged outage, pill is at-a-glance) |
| 20 | **Subtle time-of-day tint on `cn_glass`** | 🟡 | M | CSS overlay shifting hue 5% morning→evening; "alive without gimmicky" |

---

## Architectural / longer-term

| Idea | Notes |
|------|-------|
| **HTTPS + external hostname** | Prerequisite for Option 2 LLAT auto-login. Likely Caddy or HA's built-in cert add-on |
| **Option 2 — LLAT injection auto-login** | Off-LAN persistent auth. Build only after HTTPS is in place |
| **Dual-port customer/admin split (2025.5.x)** | Port 7080 = clean customer view, port 7081 = full admin |
| **Layer C — sample dashboard (2025.4.12)** | Pre-built CN Lovelace YAML using Bubble Card; opt-in via About panel button |
| **Native iOS Companion app fork** | POST-V1 — solves Keychain auth, push notifications, deeper iOS integration |
| **Mushroom card alternative bundle (2025.6.x)** | Optional second card library for users who prefer Mushroom over Bubble |
| **build.yaml deprecation cleanup** | Move build args into Dockerfile per Supervisor warning |
| **Top-of-sidebar CN logo** | HA 2026.4 broke the `.menu` selector; needs fresh shadow-DOM audit |
| **`ha-user-badge` avatar overlay** | Same — current selector doesn't match in HA 2026.4 |

---

## Priority hint for next session

Top of the list once #1, #2, #5, #7, #8, #16 are validated in the field:

1. **#1** — Floating Help FAB (every page, reduces tickets)
2. **#3** — WhatsApp QR on About panel
3. **#11** — First-launch welcome tour (cuts onboarding workload)
4. **#12** — Personalised greeting (cheapest premium-feel win)
