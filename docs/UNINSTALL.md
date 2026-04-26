# Uninstalling Connect Nest Frontend

There are two levels of uninstall depending on your goal:

| Goal | Steps needed |
|------|-------------|
| **Upgrade / reinstall** — removing to put it back again | [Quick uninstall](#quick-uninstall) only |
| **Go back to stock Home Assistant** — no trace of CN branding | [Quick uninstall](#quick-uninstall) + [Full cleanup](#full-cleanup) |

> **Note:** Home Assistant does not give add-ons an uninstall hook, so any files written to `/config` during setup must be cleaned up manually. The steps below cover every file and config change the add-on makes.

---

## Quick Uninstall

Removes the running add-on container and its Docker image. Do this first regardless of which path you're taking.

1. In Home Assistant, go to **Settings → Add-ons**
2. Click **Connect Nest FrontEnd**
3. Click **Uninstall** (bottom of the page)
4. Confirm when prompted

The add-on stops immediately and the container is removed. Your hub returns to the default Home Assistant interface.

> **Reinstalling?** You're done. Go back to the Add-on Store and install again — `run.sh` will detect the existing setup marker and skip the first-run config patch, but it will always refresh theme files and panel JS.

---

## Full Cleanup

Only needed if you want zero trace of Connect Nest branding. Requires access to the HA file system — use the **File Editor** add-on, **Studio Code Server**, or SSH.

### Step 1 — Remove theme files

Delete these two files from `/config/themes/`:

```
/config/themes/cn_dark.yaml
/config/themes/cn_light.yaml
```

In File Editor: navigate to `config/themes/` → three-dot menu → Delete on each file.

### Step 2 — Remove panel and branding JS

Delete these files from `/config/www/`:

```
/config/www/cn-about-panel.js
/config/www/cn-init.js
/config/www/cn-scrubber.js
/config/www/cn-hide-leaks.js
/config/www/cn-whats-new.json
/config/www/card-mod.js
```

In File Editor: navigate to `config/www/` and delete each `cn-*` file and `card-mod.js`.

### Step 3 — Edit configuration.yaml

Open `/config/configuration.yaml` and remove the Connect Nest block. It looks like this:

```yaml
# ─── Connect Nest Frontend ─────────────────────────────────
# Auto-added by the Connect Nest Frontend add-on.
# Edit with care — incorrect changes will break the branded UI.
frontend:
  themes: !include_dir_merge_named themes
  extra_module_url:
    - /local/card-mod.js
    - /local/cn-init.js

panel_custom:
  - name: cn-about
    sidebar_title: About Connect Nest
    sidebar_icon: mdi:information-outline
    url_path: cn-about
    module_url: /local/cn-about-panel.js
    embed_iframe: false
    require_admin: false
# ─── End Connect Nest Frontend ─────────────────────────────
```

Delete the entire block including the comment lines. If you had a `frontend:` block before installing, restore it to its previous state.

> **Important:** Make sure no trailing blank lines or indentation errors are left in `configuration.yaml` — HA will refuse to start if YAML is malformed. Use the **Check Configuration** tool in Developer Tools → Template to verify before restarting.

### Step 4 — Delete the setup marker

Delete the hidden marker file that prevents `run.sh` from re-patching `configuration.yaml`:

```
/config/.cn_frontend_setup_done
```

In File Editor, enable "Show hidden files" (gear icon) then delete it. Via SSH: `rm /config/.cn_frontend_setup_done`

### Step 5 — Remove the Lovelace resource

The add-on registers `card-mod.js` as a Lovelace resource via the API. Remove it:

1. Go to **Settings → Dashboards**
2. Click the **three-dot menu** (top right) → **Resources**
3. Find `/local/card-mod.js` and click the bin icon to delete it

If Resources is not visible, enable **Advanced Mode** in your profile first.

### Step 6 — Restart Home Assistant Core

1. Go to **Developer Tools → Restart** (or **Settings → System → Restart**)
2. Choose **Restart Home Assistant**
3. Wait ~60 seconds for it to come back up

### Step 7 — Verify

After restart, check:

- [ ] The sidebar no longer shows "About Connect Nest"
- [ ] The theme dropdown in your profile no longer lists `cn_dark` or `cn_light`
- [ ] The browser tab says "Home Assistant" (not "Connect Nest")
- [ ] Settings → Dashboards → Resources: no `/local/card-mod.js` or `/local/cn-*` entries

---

## Re-installing after a full cleanup

After a full cleanup, a fresh install works exactly like the first time. `run.sh` will detect there is no marker file and re-patch `configuration.yaml` automatically.

---

## Getting help

If something goes wrong during uninstall, contact the team:

- **WhatsApp:** [+61 492 970 809](https://wa.me/61492970809)
- **Email:** hello@connectnest.com.au
