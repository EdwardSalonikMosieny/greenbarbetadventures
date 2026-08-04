# Green Barbet Adventures

Website rebuild for Green Barbet Adventures Ltd, a Kenya-based tours and travel company.
See [CLAUDE.md](./CLAUDE.md) for full project context, content reference, and the step-by-step build plan.

This is a monorepo with two fully independent apps:

```
/frontend   React + TypeScript (Vite)
/backend    Node.js + Express + TypeScript + Prisma (PostgreSQL)
```

## Prerequisites

- Node.js 18+ (developed against Node 24; anything 18 LTS or newer works)
- npm 10+
- A PostgreSQL database (local install, or a hosted instance — see backend README for connection string format)

## Getting started

### One-time setup

Each app installs and configures independently — there's no root `npm install` that
sets up the apps themselves (the root `package.json` only exists to run both dev
servers together, see below; it has no app dependencies of its own).

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set DATABASE_URL to your PostgreSQL instance, and JWT_SECRET to a real secret
npm run prisma:migrate
npm run prisma:seed
cd ../frontend
npm install
cp .env.example .env
```

See [backend/README.md](./backend/README.md) and [frontend/README.md](./frontend/README.md)
for what each env var does and other per-app details.

### Running

```bash
npm install   # once, at the repo root — installs the `concurrently` dev-orchestration tool
npm run dev   # runs both apps together, from the root
```

This starts the backend (http://localhost:4000, health check `GET /api/v1/health`)
and frontend (http://localhost:5173) together in one terminal, output
color-labeled per app. **PostgreSQL must already be running** on its own — this
doesn't start the database for you.

Prefer separate terminals (e.g. to keep logs apart, or restart one without the
other)? Run each independently instead:

```bash
cd backend  && npm run dev
cd frontend && npm run dev   # in a second terminal
```

Admin dashboard: `/admin/login` — seeded dev login is
`admin@greenbarbetadventures.com` / `ChangeMe123!` (change this before using any
non-local database, see backend README).

## Linting & formatting

Each app has its own ESLint (flat config) + Prettier setup, run independently:

```bash
cd frontend && npm run lint && npm run format
cd backend  && npm run lint && npm run format
```

## Project status

All 17 build steps in [CLAUDE.md](./CLAUDE.md) are complete: full public site,
newsletter/booking-inquiry forms wired to a real backend, JWT admin auth, an admin
dashboard with CRUD for Tours/Destinations/Activities/Experiences plus inquiry and
subscriber management, and a polish pass (accessibility, SEO, error boundaries,
cross-browser/responsive QA).

One architectural note worth knowing before extending this further: the
public-facing site (destinations, tours, activities pages) still reads from typed
static data in `frontend/src/data/`, not the live database — the admin dashboard's
CRUD operates on the real Postgres tables (Prisma), but nothing yet connects the two.
Wiring the public site to `GET` endpoints against that same data would be the natural
next step before a real content-driven launch; it wasn't part of the original 17-step
scope and was flagged rather than assumed.

## Deployment

Suggested hosting split — each piece can be deployed independently and redeployed
without affecting the others:

| Piece | Suggested host | Notes |
|---|---|---|
| Frontend | Vercel or Netlify | Static Vite build, see [frontend/README.md](./frontend/README.md) |
| Backend API | Render or Railway | Node/Express, see [backend/README.md](./backend/README.md) |
| PostgreSQL | Railway, Supabase, or Neon | Any managed Postgres works — Prisma just needs a connection string |

### Environment variables

**Backend** (`backend/.env.example` is the source of truth):
`PORT`, `FRONTEND_ORIGIN`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`

**Frontend** (`frontend/.env.example`):
`VITE_API_BASE_URL`

`FRONTEND_ORIGIN` (backend) and `VITE_API_BASE_URL` (frontend) each point at the
*other* app's deployed URL — both need updating together whenever either app's URL
changes, or requests will fail (CORS block on the backend side, wrong API target on
the frontend side).

### Production build checklist

- [ ] Fresh `JWT_SECRET` generated for production — never reuse the local dev value
- [ ] `DATABASE_URL` points at the production database, not a local/dev one
- [ ] `npx prisma migrate deploy` run against production **before** first traffic (not `migrate dev` — see backend README)
- [ ] Seeded admin password (`ChangeMe123!`) changed on any non-local database
- [ ] Upload storage swapped from local disk to S3/Cloudinary (`backend/src/middleware/upload.ts`) — local disk storage does not persist across redeploys on most PaaS hosts
- [ ] `FRONTEND_ORIGIN` (backend) and `VITE_API_BASE_URL` (frontend) both set to the real deployed URLs, not localhost
- [ ] Frontend built with `npm run build` and served via a host that applies the SPA fallback rewrite (`vercel.json` / `public/_redirects` already provided — confirm the host actually picks one up)
- [ ] `npm run build && npm run lint` pass clean on both apps
- [ ] Real photography in place, or the current placeholder images (a mix of the old site's own uploads and labeled stock) are an acceptable interim — see CLAUDE.md's imagery notes
- [ ] Legal pages (`/privacy-policy`, `/terms`) reviewed by an actual lawyer — current copy is real and complete but was written by Claude, not counsel
- [ ] Social links in the footer point to real, confirmed profile URLs — current ones use a placeholder handle pattern (see `frontend/src/data/navigation.ts`)
