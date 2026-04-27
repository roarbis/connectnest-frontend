# Connect Nest FrontEnd — Version Reference

Quick-reference table for rollbacks. Each row is a tagged release you can restore to at any time.

**To revert:** `git checkout vX.X.X` (view) or `git reset --hard vX.X.X` (full revert)  
**Local backups:** `C:\Temp\ClaudeCode\backups\`

---

| Version | Git Tag | Date | Milestone | What's in it | Revert to this if… |
|---------|---------|------|-----------|--------------|---------------------|
| **2025.4.6** | `v2025.4.6` | 2026-04-27 | **MVP** — Stable, no freeze | All 2025.4.5 features + browser freeze fixed: branding observers now wait for HA to finish loading before activating; hide-leaks observer no longer re-walks full DOM on every mutation | Anything after this breaks and you need a clean working base |
| **2025.4.5** | `v2025.4.5` | 2026-04-27 | Feature-complete but freezes | CN branding on port 7080, dark + light themes, sidebar logo, login logo, "About Connect Nest" panel, sidebar quick-links, user avatar override, branded toasts, custom 404, wallpaper, add-on store icon | You want features without the freeze fix (not recommended) |
| **2025.4.4** | `v2025.4.4` | 2026-04-27 | Sidebar + login branding | CN icon above "Connect Hub" in sidebar, login page logo injected | You want branding without quick-links or JS extras |
| **2025.4.3** | *(no tag)* | 2026-04-27 | Stable startup | 400 Bad Request fix, nginx warnings fixed, trusted_proxies auto-patched | Port 7080 works but no sidebar icon or JS modules |
| **2025.4.1** | *(no tag)* | 2026-04-27 | Install fix | Dockerfile build error fixed, better build logs | First time install kept failing |
| **2025.4.0** | *(no tag)* | 2026-04-27 | First release | Initial standalone add-on split from monolithic CN add-on | You want to go back to absolute zero |

---

## Planned versions (not yet released)

| Version | Milestone | Planned changes |
|---------|-----------|-----------------|
| **2025.4.7** | Mushroom cards | Bundle mushroom.js, CN-branded CSS variables (teal accents, rounded shapes, hover effects), register via extra_module_url |
| **2025.4.8** | Favicon + PWA icon | nginx intercepts /favicon.ico and /manifest.json, serves CN icon — awaiting user confirmation on icon files |
| **2025.4.9** | Sidebar customisation | Hide Map / Energy / History from customer view, reorder items, rename labels |
| **2025.5.x** | Dual-port customer/admin split | Port 7080 = clean customer view (no admin panels), port 7081 = full admin access |
| **2025.6.x** | Factory dashboard | Pre-built Lovelace layout using mushroom cards, CN-styled, copies to /config on first run |

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
