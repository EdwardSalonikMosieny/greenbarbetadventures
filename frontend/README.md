# Green Barbet Adventures — Frontend

React + TypeScript, built with Vite. Talks to the [backend](../backend) API for admin
features (auth, CRUD, uploads); public-facing tour/destination/activity content is
still served from typed static data in `src/data/` (see root [README](../README.md)
for why, and what moving that to the live API would involve).

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Edit `.env`:

- `VITE_API_BASE_URL` — **optional**. `src/lib/apiClient.ts` already defaults to
  `http://localhost:3070/api/v1` in dev and a relative `/api/v1` in production,
  where the reverse proxy forwards `/api/` to the backend on the same origin.
  Set it only to target an API somewhere other than those defaults.

Runs at http://localhost:5173 by default.

## Scripts

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b && vite build — production build to /dist
npm run preview   # serve the production build locally, for a realistic Lighthouse/perf check
npm run lint       # ESLint (flat config)
npm run format     # Prettier
```

## Routing

Client-side routing via React Router v6 (`createBrowserRouter`). This means **direct
navigation to any non-root path** (e.g. loading `/about` fresh, or refreshing on it)
requires the host to serve `index.html` for every path instead of 404ing — see
"Deployment" below. `vercel.json` and `public/_redirects` already handle this for
Vercel and Netlify respectively; other static hosts need the equivalent SPA-fallback
rule configured.

## Deployment

**The live site does not use a static host.** It is built on the VPS and served
by `server.js` under PM2, behind a reverse proxy that also forwards `/api/` to
the backend — see `deploy/README.md`. Deploys are automatic on push to `main`.

The rest of this section applies only if you move the frontend to a static host
instead (Vercel or Netlify both fit a Vite build with no server-side rendering):

1. Build command: `npm run build`. Output directory: `dist`.
2. Set `VITE_API_BASE_URL` in the host's environment settings to the deployed
   backend's URL — a separate host means the API is no longer same-origin, so
   the relative default will not work. Vite bakes `VITE_*` vars into the build at
   build time, not runtime — changing it requires a rebuild, not just a redeploy
   of the same build.
3. SPA fallback routing is already configured (`vercel.json` for Vercel,
   `public/_redirects` for Netlify) — confirm whichever host you use actually picks
   one of these up (Vercel auto-detects `vercel.json`; Netlify auto-detects
   `_redirects` at the published root, which Vite copies there automatically since
   it lives in `public/`).
4. Make sure the backend's `FRONTEND_ORIGIN` env var is updated to match this
   deployed frontend's exact URL once you know it — otherwise every API request gets
   CORS-blocked.
