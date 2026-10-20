# My App

A blank **PWA** starter (plain HTML/CSS/JS, no build step). Hosted on GitHub
Pages, installable on Android from the browser, and works offline.

## What's inside

- `index.html` — the UI shell (edit this)
- `css/style.css` — styling with light/dark theme
- `js/app.js` — app logic + install prompt + service worker registration
- `js/vendor/qrcode.js` — bundled QR generator (works offline)
- `manifest.json` — PWA metadata (name, icons, standalone display)
- `sw.js` — service worker (offline caching)
- `icons/` — app icons (replace with your own 192x192 and 512x512 PNGs)
- `.github/workflows/deploy.yml` — auto-deploys to GitHub Pages on push to `main`

## Publish to GitHub (so it lives online)

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
Wait ~1 minute; your app is live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## Install on Android as an app

1. Open the live URL above in **Chrome** on your phone.
2. Tap the **⋮** menu → **Add to Home screen** / **Install app**.
3. It opens fullscreen with its own icon, like a native app.

> Must be HTTPS (GitHub Pages is) — not `file://`.

### QR shortcut

Open the site on your computer and use the **QR code** card: scan it with your
phone camera to open the exact same URL, then choose **"Add to Home screen"**.
The QR is generated from the page's own URL, so it always matches where the app
is hosted.

## Run locally

Any static server works. From this folder:

```powershell
python -m http.server 8000
```

Then open http://localhost:8000

## Checklist when you turn this into your real app

- [ ] Change `name` / `short_name` in `manifest.json` and the `<title>` in `index.html`
- [ ] Replace `icons/icon-192.png` and `icons/icon-512.png` with your own
- [ ] Bump `CACHE` in `sw.js` when you ship changes (`my-app-v1` → `v2`)
- [ ] Build your UI in `index.html` + `js/app.js`, styles in `css/style.css`

## Notes for later

- **Updating the installed app:** push to `main`; reopening the app picks up the
  new version. Bump the `CACHE` name in `sw.js` so the old cache is replaced.
- **Reminders / notifications:** use the Notification API + service worker. They
  are less reliable on mobile than a desktop Electron app.
- **If you ever need a real APK** (Play Store / sideload): wrap this same folder
  with [PWABuilder](https://www.pwabuilder.com/) or Capacitor — no code changes
  needed, since it's already a PWA.
