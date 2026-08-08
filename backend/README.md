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

# Populate the database with destinations, tours, and other public content
npm run prisma:seed

# Create or rotate an administrator using secrets supplied at execution time
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='<at-least-16-random-characters>' npm run prisma:create-admin

# Browse the database in a local GUI
npm run prisma:studio
```

The content seed never creates an administrator. Use `npm run prisma:create-admin` with
`ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `ADMIN_NAME`. The command rejects short and known
default passwords and can also rotate an existing administrator. Supply the password through a
protected environment or secret manager rather than committing it.

## Running

```bash
npm run dev     # tsx watch — hot-reloads on file changes
npm run build   # compiles to /dist
npm run start   # runs the compiled build
```

## File uploads

Uploads are held in memory, decoded, stripped of metadata, and re-encoded as server-named WEBP files
before being written to `/backend/uploads` and served at `/uploads/*`. This local directory does not
survive deployment on most PaaS hosts; use an isolated object-storage/media origin when deploying to
an ephemeral platform.

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
4. Run `npx prisma db seed` once against production if you want the destinations/tours content pre-loaded. This does not create an administrator.
5. Create the initial administrator separately with `npm run prisma:create-admin`, supplying a unique password through the host's secret-management facility.
6. Swap the upload storage engine (see "File uploads" above) before real content editing begins — otherwise every uploaded image disappears on the next deploy.
7. `helmet`, scoped `cors`, and `express-rate-limit` are already wired in `src/index.ts` — make sure the reverse-proxy trust chain documented in `deploy/README.md` and `FRONTEND_ORIGIN` are configured.
