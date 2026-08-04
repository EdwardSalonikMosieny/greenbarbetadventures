# Green Barbet Adventures — Backend

Node.js + Express + TypeScript API, using Prisma as the ORM against PostgreSQL.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — a long random string (never commit the real value)
- `FRONTEND_ORIGIN` — must exactly match the frontend's origin (cors is scoped, not wildcard)

## Database (Prisma)

```bash
# Create/apply migrations against schema.prisma (dev workflow)
npm run prisma:migrate

# Regenerate the Prisma Client after schema changes
npm run prisma:generate

# Populate the database with real Green Barbet Adventures content (destinations, tours, a dev admin account)
npm run prisma:seed

# Browse the database in a local GUI
npm run prisma:studio
```

The dev seed creates an admin login of `admin@greenbarbetadventures.com` / `ChangeMe123!` — **change this password before using any non-local database** (there's no "forgot password" flow yet; update it directly via `prisma:studio` or a one-off script that writes a new bcrypt hash).

## Running

```bash
npm run dev     # tsx watch — hot-reloads on file changes
npm run build   # compiles to /dist
npm run start   # runs the compiled build
```

## File uploads

`multer` writes to `/backend/uploads` in dev, served statically at `/uploads/*`. **This does not survive deployment** on most PaaS hosts (Render, Railway, etc. use ephemeral filesystems — uploads vanish on every redeploy/restart). Before going live, swap `src/middleware/upload.ts`'s disk storage for an S3 or Cloudinary storage engine — it's the only file that needs to change; every route already just stores whatever URL the upload handler returns.

## API

All routes are versioned under `/api/v1`.

**Public:**
- `GET /api/v1/health`
- `POST /api/v1/newsletter` — subscribe (rate-limited)
- `POST /api/v1/booking-inquiries` — submit an inquiry (rate-limited)
- `POST /api/v1/auth/login` — admin login, returns a JWT (rate-limited: 5/15min)

**Admin-only** (`Authorization: Bearer <token>`, obtained from `/auth/login`):
- `GET /api/v1/auth/me`
- `POST /api/v1/uploads` — image upload (multipart, field name `image`)
- Full CRUD at `/api/v1/admin/destinations`, `/api/v1/admin/activities`, `/api/v1/admin/experiences`, `/api/v1/admin/tours`
- `GET /api/v1/admin/booking-inquiries`, `PATCH /api/v1/admin/booking-inquiries/:id/status`
- `GET /api/v1/admin/newsletter-subscribers`, `DELETE /api/v1/admin/newsletter-subscribers/:id`
- `GET /api/v1/admin/stats`

## Deployment

Suggested hosts: **Render** or **Railway** for the API, with **Railway**, **Supabase**, or **Neon** for managed PostgreSQL (any of the three works fine — pick whichever also hosts your Postgres instance to keep both in the same region).

1. Set every variable from `.env.example` in the host's environment settings — especially `DATABASE_URL` (pointing at the production database), a freshly-generated `JWT_SECRET` (**do not reuse the local dev one**), and `FRONTEND_ORIGIN` (the deployed frontend's exact URL, e.g. `https://greenbarbetadventures.com` — no trailing slash, no wildcard).
2. Build command: `npm run build`. Start command: `npm run start`.
3. Run migrations against the production database **before** the app first starts serving traffic: `npx prisma migrate deploy` (not `migrate dev` — that command is interactive and meant for local development only). Most hosts support this as a "release" or "pre-deploy" command; otherwise run it manually once via the host's shell/console.
4. Run `npx prisma db seed` once against production if you want the real destinations/tours content pre-loaded — then **immediately change the seeded admin password** (see above).
5. Swap the upload storage engine (see "File uploads" above) before real content editing begins — otherwise every uploaded image disappears on the next deploy.
6. `helmet`, scoped `cors`, and `express-rate-limit` are already wired in `src/index.ts` — no extra config needed there, just make sure `FRONTEND_ORIGIN` is correct or every request from the real frontend will be CORS-blocked.
