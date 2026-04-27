# Connect Nest FrontEnd — Version Reference

Quick-reference table for rollbacks. Each row is a tagged release you can restore to at any time.

**To revert:** `git checkout vX.X.X` (view) or `git reset --hard vX.X.X` (full revert)  
**Local backups:** `C:\Temp\ClaudeCode\backups\`

---

| Version | Git Tag | Date | Milestone | What's in it | Revert to this if… |
|---------|---------|------|-----------|--------------|---------------------|
| **2025.4.12** | `v2025.4.12` | 2026-04-28 | About panel back button + version sync | Adds back-arrow on About Connect Nest panel matching HA's other panels (`history.back()` with `/` fallback). Fixes stale `VERSION` constant that was stuck on `2025.4.5` while add-on moved on. | Customers complain About panel has no way out, or the version label there is wrong |
| **2025.4.11** | `v2025.4.11` | 2026-04-28 | Customer-install polish (top 5) | CN favicon (browser tabs); wallpaper PNG → WebP (1.4 MB → 66 KB); "Forgot password?" support link on login; hub-offline banner with help button. TODO.md created with remaining 14 ideas | You want better customer-day-one polish |
| **2025.4.10** | `v2025.4.10` | 2026-04-28 | Hotfix — readable dropdowns | All three themes now comprehensively override the Material Web variables HA 2026.4 uses for filled text fields and selects. Fixes white-on-light text in Profile / Settings / dialogs. | Dropdown text is illegible after upgrade |
| **2025.4.9** | `v2025.4.9` | 2026-04-27 | Hotfix — ingress port collision | Internal ingress port `8099 → 8919` to fix `bind() failed (address in use)` errors on fresh installs where another add-on already held 8099 | A new install fails with "Address in use" or partner's install errors |
| **2025.4.8** | `v2025.4.8` | 2026-04-27 | Layer B — Bubble Card bundle | Pinned Bubble Card v3.1.6 inside Docker image; HACS-aware deploy to `/config/www/cn-cards/`; `--bubble-*` CSS vars in all 3 themes auto-inherit CN teal; wallpaper cache 30d→1d; existing installs get log warning with manual `extra_module_url` line | You want themes + bundled card library |
| **2025.4.7+** | `layer-a-complete` | 2026-04-27 | **Layer A complete** — sealed milestone | v2025.4.7 + refreshed wallpaper asset + TEST-GUIDE.md for partner testing. Last known-good before Layer B (Bubble Card). Restore here if Layer B work needs to be reverted. | You broke something in Layer B and want to come back to a clean glass-theme baseline |
| **2025.4.7** | `v2025.4.7` | 2026-04-27 | Layer A — glass theme + iOS polish | All 2025.4.6 + new `cn_glass` theme (visionOS-style auto light/dark glassmorphism); strips HA Companion install banner from iPhone Safari; hides OHF badge on splash | You want themes + iOS polish without bundled cards |
| **2025.4.6** | `v2025.4.6` | 2026-04-27 | **MVP** — Stable, no freeze | All 2025.4.5 features + browser freeze fixed: branding observers now wait for HA to finish loading before activating; hide-leaks observer no longer re-walks full DOM on every mutation | Last proven-stable base before glass theme |
| **2025.4.5** | `v2025.4.5` | 2026-04-27 | Feature-complete but freezes | CN branding on port 7080, dark + light themes, sidebar logo, login logo, "About Connect Nest" panel, sidebar quick-links, user avatar override, branded toasts, custom 404, wallpaper, add-on store icon | You want features without the freeze fix (not recommended) |
| **2025.4.4** | `v2025.4.4` | 2026-04-27 | Sidebar + login branding | CN icon above "Connect Hub" in sidebar, login page logo injected | You want branding without quick-links or JS extras |
| **2025.4.3** | *(no tag)* | 2026-04-27 | Stable startup | 400 Bad Request fix, nginx warnings fixed, trusted_proxies auto-patched | Port 7080 works but no sidebar icon or JS modules |
| **2025.4.1** | *(no tag)* | 2026-04-27 | Install fix | Dockerfile build error fixed, better build logs | First time install kept failing |
| **2025.4.0** | *(no tag)* | 2026-04-27 | First release | Initial standalone add-on split from monolithic CN add-on | You want to go back to absolute zero |

---

## Planned versions (not yet released)

| Version | Milestone | Planned changes |
|---------|-----------|-----------------|
| **2025.4.x** | Cosmetic polish (deferred) | Top-of-sidebar CN logo (HA 2026.4 shadow DOM changed `.menu` selector) and `ha-user-badge` avatar overlay — both deferred, not blocking MVP |
| **2025.4.10** | Favicon + PWA icon | nginx intercepts /favicon.ico and /manifest.json, serves CN icon — awaiting user confirmation on icon files |
| **2025.4.11** | Sidebar customisation | Hide Map / Energy / History from customer view, reorder items, rename labels |
| **2025.4.12** | Layer C — sample dashboard | Pre-built Connect Nest Lovelace YAML using bundled Bubble Card; opt-in via "Load Connect Nest sample dashboard" button on the About panel |
| **2025.5.x** | Dual-port customer/admin split | Port 7080 = clean customer view (no admin panels), port 7081 = full admin access |
| **2025.6.x** | Mushroom (alternative card) | Optional second bundled card library for users who prefer Mushroom over Bubble |

---

## How to restore a tagged version

```bash
# See what you have locally
git log --oneline --tags

# Restore to a specific tag (creates a detached HEAD — safe to look around)
git checkout v2025.4.5

# Or hard-reset your main branch back to that tag (destructive — make sure you have a backup)
git reset --hard v2025.4.5
git push --force origin main   # only if you want GitHub to match
```

## How to restore from a local backup zip

1. Rename the current folder as a safety copy: `connectnest-frontend-broken`
2. Unzip the backup: `connectnest-frontend_v2025.4.5_YYYYMMDD_HHMMSS.zip`
3. Rename the unzipped folder back to `connectnest-frontend`
4. Push to GitHub if needed: `git push --force origin main`
