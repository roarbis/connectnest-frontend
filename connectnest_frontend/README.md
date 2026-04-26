# Connect Nest Frontend

**Turn On Smart Living** — the Connect Nest interface for your smart home hub.

This add-on re-skins your Home Assistant interface with full Connect Nest
branding: colours, fonts, icons, theme, and a custom **About Connect Nest**
panel with built-in support contacts and live system health.

## What this add-on does

- Replaces the default theme with `cn_dark` (and `cn_light` for daytime)
- Branded sidebar, login page, loading screen
- iPhone PWA — "Connect Nest" on the home screen, fullscreen, push notifications
- Custom **About Connect Nest** panel with WhatsApp/email/phone support
- Hides settings pages a typical customer doesn't need

## What this add-on does NOT do

- Set up MQTT, Zigbee, HACS, or backups — that's the **Connect Nest Wizard**
  add-on (separate, post-v1)
- Replace Home Assistant Core itself — this sits *on top of* a standard HA
  install and re-skins it

## Configuration

| Option | Default | Description |
|---|---|---|
| `ha_port` | `8123` | Port your Home Assistant Core listens on |
| `default_theme` | `cn_dark` | Theme applied on first install |
| `ssl` | `false` | Serve Connect Nest over HTTPS |
| `certfile` | `fullchain.pem` | SSL certificate filename |
| `keyfile` | `privkey.pem` | SSL private key filename |

## Access

After starting the add-on:
- **In the HA sidebar**: click "Connect Nest" — opens the branded interface inline
- **Direct browser** (for iPhone PWA install): `http://<your-hub-ip>:7080`

## Support

| | |
|---|---|
| 💬 WhatsApp | [+61 492 970 809](https://wa.me/61492970809) |
| 📧 Email | hello@connectnest.com.au |
| 📞 Phone | (+61) 0492 970 809 |
| 🌐 | [connectnest.com.au](https://connectnest.com.au) |

## License

Apache 2.0. Powered by Home Assistant.
