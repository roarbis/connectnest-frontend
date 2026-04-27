# Connect Nest Frontend — Quick Test Guide

A 15-minute walkthrough to install and test Connect Nest Frontend on a Home Assistant hub.

> **You'll need:**
> - A Home Assistant hub with Supervisor (HAOS or Supervised — not Container)
> - A laptop or phone on the **same Wi-Fi** as the hub
> - Admin access to the hub (URL like `http://192.168.x.x:8123`)
>
> **Recommended before starting:** take a backup. Settings → System → Backups → Create backup. If anything goes wrong you can roll back in 2 minutes.

---

## 1 · Add the Connect Nest repository

1. Open Home Assistant in a browser → **Settings → Add-ons → Add-on store**
2. Click the **⋮ menu** (top right) → **Repositories**
3. Paste this URL and click **Add**:
   ```
   https://github.com/roarbis/connectnest-frontend
   ```
4. Close the dialog. The store will refresh.

You should now see a new section called **Connect Nest** (or similar) with one add-on inside: **Connect Nest FrontEnd**.

---

## 2 · Install the add-on

1. Click **Connect Nest FrontEnd**
2. Click **Install** (it will build from source — takes 2–5 minutes the first time)
3. When the spinner stops, you'll see Info / Configuration / Log tabs

If the install fails, open the **Log** tab and screenshot it.

---

## 3 · Configure & start

1. On the **Configuration** tab, leave defaults as-is (or change `default_theme` to `cn_glass` if you want the new glassmorphic look from day one). Click **Save** if you change anything.
2. Switch to the **Info** tab.
3. Toggle **Start on boot** ON, **Watchdog** ON, **Show in sidebar** ON.
4. Click **Start**. Wait ~30 seconds.
5. Open the **Log** tab — you should see the startup banner ending with:
   ```
   [Connect Nest] ✓ Connect Nest is running!
   ```

If you see errors instead, screenshot the log.

---

## 4 · Open the Connect Nest interface

There are **two ways** to access it:

**Option A — sidebar** (lives inside Home Assistant)
- Look for **Connect Nest** in the left sidebar of HA. Click it.

**Option B — direct port** (this is the one you want for the PWA install on iPhone)
- Open a new browser tab and go to: `http://<HUB-IP>:7080`
- Replace `<HUB-IP>` with your hub's IP, e.g. `http://192.168.8.40:7080`
- Log in with your normal HA username and password.

You should see the Connect Nest branded interface — teal accents, "Connect Nest" in the title bar, dashboard areas (Living Room / Kitchen / Bedroom / etc).

---

## 5 · Try the themes

Three CN themes are available:

| Theme | Look |
|-------|------|
| `cn_dark` | Dark, opaque, default |
| `cn_light` | Light, opaque |
| `cn_glass` | Frosted glass over wallpaper, auto-switches with your OS dark mode |

**To switch:**
1. Click the **circle icon (your initial / avatar)** at the bottom-left of the sidebar
2. Scroll down to **Themes** section
3. Pick one from the dropdown — the screen updates instantly
4. To switch back to the default for everyone, change `default_theme` in the add-on Configuration tab and Restart the add-on

**Recommended for the demo:** try `cn_glass` first. It's the most visually distinctive.

---

## 6 · Install the iPhone PWA

This adds Connect Nest as a fullscreen app icon on your iPhone home screen — no App Store, no Companion app.

> **Must be on the same Wi-Fi as the hub. Must use Safari (not Chrome).**

1. Open **Safari** on your iPhone
2. Go to: `http://<HUB-IP>:7080` (e.g. `http://192.168.8.40:7080`)
3. Wait for the dashboard to fully load
4. Tap the **Share button** (square with up-arrow, bottom centre of Safari)
5. Scroll down → tap **Add to Home Screen**
6. Confirm:
   - **Title** says "Connect Nest" ✓
   - **Icon** is the teal CN logo ✓
7. Tap **Add** (top right)

A new icon appears on your home screen. **Tap it.**

**What to check on the launched app:**
- Splash screen with CN icon (not a Safari loading bar)
- **No URL bar at the top** — fullscreen, like a native app
- Status bar (date/time/battery) is legible over the teal header
- Sidebar shows Connect Nest with all dashboards listed
- Your login persists if you swipe up to close and reopen

---

## 7 · Things to look for / report

If you spot any of these, screenshot and send:

- ❌ "Home Assistant" text appearing anywhere (should always say "Connect Nest")
- ❌ "Open in Home Assistant Companion" banner at top of Safari
- ❌ "Open Home Foundation" badge on the splash screen
- ❌ Cards that look broken / overlap / have weird colours
- ❌ Login prompts on every refresh
- ❌ Slow load times or freezes
- ✅ Anything you really like — we want to know what's working

Bonus tests if you have time:
- Switch your phone's dark/light mode and see if `cn_glass` follows
- Try the **About Connect Nest** panel in the sidebar — it has version info, system health, support contact
- Try clicking **Devices / Automations / Dashboards / Apps** quick-links at the bottom of the sidebar

---

## 8 · Removing it (if needed)

To uninstall completely:
1. **Settings → Add-ons → Connect Nest FrontEnd → Uninstall**
2. The CN themes stay in `/config/themes/` — you can delete `cn_dark.yaml`, `cn_light.yaml`, `cn_glass.yaml` from File Editor if you want them gone.
3. Switch your active theme back to **Backend-selected** (Profile → Themes).

The home-screen PWA icon on iPhone — long-press → **Remove App → Delete from Home Screen**.

---

**Hub IP:** _________________ (write this in before sharing)
**Tester:** _________________
**Date:** _________________
