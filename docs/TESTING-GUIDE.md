# Connect Nest Frontend — Testing Guide

**For: Connect Nest testing partner**
**Version:** 2025.4.2
**Date:** April 2026

---

## What you're testing

You're checking that the Connect Nest branding looks correct, all the features work, and nothing says "Home Assistant" where a customer would see it. You don't need any technical knowledge — just follow each step and note down what you see.

**Time needed:** About 30–45 minutes (plus 10 min for iPhone setup)

---

## What you need before you start

- A working Home Assistant hub on your local network (the Connect Nest hub)
- Your hub's local IP address — e.g. `192.168.1.100` (ask the team if unsure)
- Login details for the hub (username + password)
- An iPhone (for the PWA section at the end)
- A notepad or the reply form to write down what you find

---

## PART 1 — Install the Add-on

> **Only needed on a fresh hub. Skip to Part 2 if already installed.**

1. Open a browser on your computer and go to: `http://<your-hub-ip>:8123`
2. Log in with your username and password
3. In the left sidebar, click **Settings**
4. Click **Add-ons**, then click **Add-on Store** (bottom right)
5. Click the three-dot menu (⋮) in the top right → **Repositories**
6. Paste this URL and click **Add**:
   ```
   https://github.com/roarbis/connectnest-frontend
   ```
7. Close the popup — refresh the page if nothing appears
8. Search for **Connect Nest Frontend** in the store
9. Click it → click **Install** → wait 2–3 minutes for it to download
10. Once installed, click **Start**
11. Turn on **Start on boot** and **Watchdog** (both toggles)
12. Click the **Log** tab — you should see `Connect Nest is running!` near the bottom

> ✅ **Pass:** Log shows "Connect Nest is running!" with no red errors  
> ❌ **Fail:** Red error lines — copy the last 10 lines and send to the team

---

## PART 2 — Branding Check

### 2A. The interface looks like Connect Nest

1. Go back to the main hub page: `http://<your-hub-ip>:8123`
2. Look at the **top of the left sidebar**

> ✅ **Pass:** You see **"Connect Hub"** in a teal/green colour (large text)  
> ❌ **Fail:** You see "Home Assistant" or nothing

3. Check the **browser tab title** (the text in the tab at the top of your browser)

> ✅ **Pass:** Tab says **"Connect Nest"** or the name of the page  
> ❌ **Fail:** Tab says "Home Assistant"

4. Scroll through the sidebar. Look for any text that says **"Home Assistant"**, **"Nabu Casa"**, or **"HASS"**

> ✅ **Pass:** None visible to a normal customer  
> ❌ **Fail:** Note down exactly where you see it

### 2B. The background and colours

5. The main background should have the Connect Nest dark green/teal feel (dark theme)
6. Cards (boxes on the dashboard) should have rounded corners and a dark background

> ✅ **Pass:** Looks like a branded, professional smart home app  
> ❌ **Fail:** Default white/grey Home Assistant look

---

## PART 3 — Dark and Light Themes

### 3A. Check dark theme (default)

The dark theme should already be active. It uses dark backgrounds with teal accents.

> ✅ **Pass:** Dark backgrounds, teal highlights, Raleway/modern font

### 3B. Switch to light theme

1. Click on your **profile picture or initial** in the bottom-left corner of the sidebar
2. Scroll down to **Theme**
3. Change it from `cn_dark` to `cn_light`

> ✅ **Pass:** Interface switches to a clean light cream/white look, still with teal accents  
> ❌ **Fail:** Ugly or broken colours, or no `cn_light` option in the list

4. Switch back to `cn_dark` when done

---

## PART 4 — About Connect Nest Panel

1. In the left sidebar, look for **"About Connect Nest"** (it may have an ℹ️ icon)
2. Click it

You should see a panel with these sections — tick each one:

### 4A. Hero section (top)
- [ ] Connect Nest logo/icon visible
- [ ] **"Connect Nest"** heading in large teal text
- [ ] **"Turn On Smart Living"** tagline below it
- [ ] A version badge like `v2025.4.2`

### 4B. About section
- [ ] A short paragraph about Connect Nest — should NOT mention Home Assistant

### 4C. What's New
- [ ] Shows a release title and date
- [ ] A tick-list of features in this version

### 4D. System Health widget
This checks if everything is running:

| Item | What to look for |
|------|-----------------|
| **Hub** | Should say **"Online"** in green/teal |
| **Internet** | Should say **"Online"** within 5 seconds |
| **Last Backup** | Shows a date or number of days ago |

> ✅ **Pass:** Hub = Online, Internet = Online, Backup shows a date  
> ❌ **Fail:** Any item stuck on "Checking…" after 10 seconds, or shows red "Offline"

### 4E. Support section
- [ ] A large **green "Chat with us on WhatsApp"** button
- [ ] Email: hello@connectnest.com.au
- [ ] Phone: 0492 970 809
- [ ] Website: connectnest.com.au

5. Tap the **WhatsApp button** — it should open WhatsApp with a pre-filled message to Connect Nest support

> ✅ **Pass:** WhatsApp opens with a message ready to send  
> ❌ **Fail:** Nothing happens, or it opens to the wrong number

---

## PART 5 — Error / Loading Screen

This tests what customers see if the hub is slow to start. We simulate it:

1. In your browser, go to: `http://<your-hub-ip>:8123`
2. While the page is loading (or if you catch it on a slow connection), you may briefly see the loading screen

Alternatively, ask the team to briefly stop HA Core — you'll then see the error page.

### What the loading/error screen should show:
- [ ] Connect Nest logo (icon)
- [ ] **"Connect Nest"** heading
- [ ] **"Turn On Smart Living"** tagline
- [ ] Animated bouncing dots
- [ ] Message: "Your smart home is starting up. This usually takes less than a minute."
- [ ] Page auto-refreshes every 8 seconds

> ✅ **Pass:** All above visible, no "Home Assistant" text, no WhatsApp link  
> ❌ **Fail:** Shows generic HA error page, or has unwanted text

---

## PART 6 — iPhone PWA (Add to Home Screen)

**This must be done on an iPhone using Safari — not Chrome.**

1. Open **Safari** on your iPhone
2. Go to: `http://<your-hub-ip>:7080`
   *(Note: port 7080, not 8123 — this is the iPhone-friendly URL)*
3. Log in if prompted
4. Tap the **Share button** (the box with an arrow pointing up, at the bottom of Safari)
5. Scroll down and tap **"Add to Home Screen"**
6. The name should show as **"Connect Nest"** — tap **Add**

### Check the home screen icon:
- [ ] The icon on your home screen shows the **Connect Nest logo** (not a screenshot of the page)
- [ ] The name under the icon says **"Connect Nest"**

### Open the app:
7. Tap the **Connect Nest** icon on your home screen

- [ ] The app opens **fullscreen** (no Safari address bar at the top)
- [ ] The status bar at the very top of the iPhone shows **dark/translucent** (not white)
- [ ] The interface looks identical to the browser version

> ✅ **Pass:** Fullscreen, correct icon, no browser chrome visible  
> ❌ **Fail:** Opens in Safari with address bar, or shows wrong icon

---

## PART 7 — Quick Regression Check

Browse around the interface briefly and check:

- [ ] The **Overview/Dashboard** page loads normally
- [ ] Lights/switches (if any) can be toggled
- [ ] The sidebar links all work (Settings, etc.)
- [ ] Nothing is broken or blank that wasn't blank before

---

## What to report back

For each section above, send:

1. **Pass / Fail** for each checkbox
2. A **screenshot** of anything that looks wrong
3. Any places you spotted **"Home Assistant"** text visible to a customer
4. How the **iPhone PWA** looked (especially fullscreen and icon)
5. What the **System Health** widget showed (Online/Offline/dates)

---

## If something goes wrong

| Problem | Try this |
|---------|----------|
| Can't reach `http://<ip>:8123` | Make sure your computer is on the same WiFi as the hub |
| Can't see "About Connect Nest" in sidebar | Hard-refresh the page (Ctrl+Shift+R) and wait 30 seconds |
| Theme options not showing `cn_light` | Restart the add-on, then hard-refresh |
| Internet shows "Offline" | Check if connectnest.com.au is reachable in your browser |
| iPhone PWA not fullscreen | Make sure you added it from **Safari**, not Chrome |
| Port 7080 not loading | Check the add-on is running in HA Settings → Add-ons |

---

*Questions? Message the team on WhatsApp or email hello@connectnest.com.au*
