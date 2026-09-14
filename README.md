# aso

Audio Software Overview — a filterable catalog of owned audio software and third-party plugins for Ableton Live workflows.

## App

The catalog UI lives in [`web/`](web/):

- **Stack:** Vite + React + TypeScript (runs in the browser)
- **OS:** macOS, Windows, and Linux via Node.js

```bash
cd web
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # preview the build
```

## Features

- Search by name, vendor, sonic character, or use case
- Filter by **type**, **vendor**, and **collection** (e.g. Arturia V Collection 7, Soundtoys Bundle v5.3, Plugin Alliance, Waves Horizon, Komplete 13)
- Detail pane: what it does, sonic character, best uses, and example use cases

Owned vs installed tracking can be added later.


## Phone testing

While a Cloud Agent session is running, a temporary public tunnel can be started for iPhone testing.

For a lasting URL, enable GitHub Pages on the `gh-pages` branch:

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` / `/ (root)`
4. Open `https://zeitfenster.github.io/aso/`

The Vite `base` is set to `/aso/` for that Pages URL.
