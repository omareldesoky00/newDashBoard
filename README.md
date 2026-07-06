# Noor City Bus Dashboard 🚌

A real-time-style bus tracking dashboard built with React + Vite.

- **Live clock** — always shows real Cairo (Africa/Cairo) time, ticking every second.
- **Live weather** — pulled from the free [Open-Meteo](https://open-meteo.com) API for Noor City / Cairo, no API key needed, refreshes every 10 minutes.
- **Animated buses** — three buses (101, 102, 103) glide slowly along their SVG lanes on the map, forever, using `requestAnimationFrame`.

## 1. Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 2. Push it to GitHub

You said you already have your git username/email configured, so from inside this project folder:

```bash
git init
git add .
git commit -m "Initial commit: Noor City Bus Dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Replace `<your-username>` and `<your-repo-name>` with your actual GitHub username and the repo name you create on GitHub.com (create an empty repo there first, no README/license, so it doesn't conflict).

## 3. Turn on GitHub Pages (this makes the link live forever)

1. On GitHub, go to your repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. That's it. This repo already includes `.github/workflows/deploy.yml`, which:
   - runs on every push to `main`
   - installs dependencies, builds the Vite project
   - publishes the `dist` folder to GitHub Pages automatically

After the first push, check the **Actions** tab — once the workflow finishes (green check), your site is live at:

```
https://<your-username>.github.io/<your-repo-name>/
```

From then on, every time you `git push`, the site automatically rebuilds and redeploys within a minute or two. You don't need to run `npm run build` yourself.

## 3b. Alternative: manual deploy (no Actions)

If you'd rather deploy by hand instead of using Actions:

```bash
npm run build
npm run deploy
```

This uses the `gh-pages` package (already in `devDependencies`) to push the `dist` folder to a `gh-pages` branch. If you use this method, go to **Settings → Pages** and set the source to the `gh-pages` branch instead of GitHub Actions.

## Project structure

```
src/
  hooks/
    useCairoClock.js   -> live Cairo time
    useWeather.js      -> live Open-Meteo weather fetch
    useAnimatedBus.js  -> moves a marker along an SVG path
  components/
    Header.jsx
    RoutePanel.jsx
    MapView.jsx        -> SVG map + animated buses
    WeatherPanel.jsx
    ClockPanel.jsx
    FleetStatus.jsx
  App.jsx
  index.css
```

## Customizing

- **Bus speed**: in `MapView.jsx`, change the `durationMs` prop on each `<BusMarker>` (bigger number = slower bus).
- **Routes**: edit the `ROUTE_101` / `ROUTE_102` / `ROUTE_103` SVG path strings in `MapView.jsx`.
- **Location for weather**: change `LAT` / `LON` at the top of `src/hooks/useWeather.js`.
