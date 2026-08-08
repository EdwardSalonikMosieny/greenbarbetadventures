# Deployment

Push to `main` → GitHub Actions runs the test suite → rsyncs the repo to the
server → rebuilds both apps → reloads both PM2 processes.

This mirrors the deploy pattern used by the sibling Salama and Johjam projects,
with one difference: this is a **monorepo**, so a single workflow
(`.github/workflows/deploy-production.yml`) ships the API and the site together
instead of one workflow per repo.

> **This is a public repository.** Nothing here should name a host, an IP, a
> filesystem path, a database credential, a key file, or an account. Every
> server-specific value belongs in a GitHub Actions secret or in a file that
> only ever exists on the server. The placeholders below are deliberate — please
> keep them that way when editing.

## Scope

This repo owns the **applications and their deploy**: the two PM2 ecosystem
configs, the GitHub Actions workflow, and the build steps.

It does **not** own the server. Provisioning, the reverse proxy, TLS, the
firewall, the database, and PM2's boot integration are all managed outside this
repo. Nothing here writes to `/etc`, installs packages, or reloads the proxy.
What the server has to provide is the [contract](#what-the-server-must-provide)
below.

## Architecture

Both apps run under **PM2**, bound to loopback only:

| Process                | Port             | What it is                                |
| ---------------------- | ---------------- | ----------------------------------------- |
| `greenbarbet-prod`     | `127.0.0.1:3070` | Express API, built to `backend/dist`      |
| `greenbarbet-web-prod` | `127.0.0.1:5070` | React SPA, served by `frontend/server.js` |

Neither is exposed directly — a reverse proxy in front terminates TLS and routes
to the two ports.

```
Browser → reverse proxy (443)
             → /          → 127.0.0.1:5070  (greenbarbet-web-prod)
             → /api/      → 127.0.0.1:3070  (greenbarbet-prod)
             → /uploads/  → 127.0.0.1:3070  (greenbarbet-prod)
```

Both `ecosystem.config.production.json` files use relative paths, so no server
path is committed to this public repo. PM2 resolves those against **the cwd of
the `pm2` command**, not the config file's location — so always `cd` into the
app's own directory before starting or reloading it. Passing PM2 a path to the
config from somewhere else makes it look for the script in the wrong place.

### What the frontend process is

Vite emits a static SPA, but the proxy routes to a port rather than a directory,
so `frontend/server.js` serves `frontend/dist` over HTTP. It uses only Node
built-ins — no runtime dependencies — and handles client-side-routing fallback
to `index.html`, immutable caching for hashed `/assets/`, `no-cache` on
`index.html`, ETag/304, and a path-traversal guard.

## What the server must provide

Set up once, outside this repo, before the first deploy:

1. **Node.js ≥ 20.19** and **PM2** installed globally, with PM2's systemd
   startup hook enabled so both apps survive a reboot.
2. **PostgreSQL** running locally, with a database and an owning role.
3. A **deploy directory** containing a `git` checkout of this repo, owned by the
   account the workflow connects as. Its path goes in the `APP_DEPLOY_PATH`
   secret and appears nowhere in this repo.
4. **`backend/.env`** inside that directory, mode `600`, never committed. See
   `backend/.env.example` for the full list; production needs `PORT=3070`,
   `HOST=127.0.0.1`, `NODE_ENV=production`, a real `DATABASE_URL`, a 64+
   character random `JWT_SECRET`, and `FRONTEND_ORIGIN` listing the apex and
   `www` origins.
5. **Reverse proxy** configured per the contract below, with TLS issued.
6. **Firewall** allowing 80/443 from the public internet. The domain resolves
   straight to this server — there is no CDN or scrubbing layer in front — so
   restricting these ports to a proxy provider's ranges would black-hole every
   real visitor.

The workflow creates `logs/` and `backend/uploads/` itself, and both are
excluded from `rsync --delete`, so neither is wiped on deploy.

## Reverse-proxy contract

| Path        | Upstream                         |
| ----------- | -------------------------------- |
| `/`         | `http://127.0.0.1:5070`          |
| `/api/`     | `http://127.0.0.1:3070/api/`     |
| `/uploads/` | `http://127.0.0.1:3070/uploads/` |

Requirements:

- Forward `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`.
- Allow request bodies up to **10M** (image uploads).
- Send `Cache-Control: no-store` on `/api/` responses so no edge or intermediary
  caches a JWT or customer PII.
- `X-Content-Type-Options: nosniff` on `/uploads/`.
- Leave caching of `/` and `/assets/` alone — `frontend/server.js` sets those
  headers itself, and overriding them will serve stale asset hashes after a
  deploy.
- Set `X-Forwarded-For` from the **socket peer address** — the address the
  connection actually came from. Do not copy it, or any vendor header like
  `CF-Connecting-IP`, from what the client sent.

That last point is load-bearing. The backend trusts only loopback as its proxy
(`configureProxyTrust`), so whatever the proxy puts in `X-Forwarded-For` is
exactly what `express-rate-limit` buckets on. Clients connect to this server
directly, so any client-supplied address header is attacker-controlled: honour
one and a single caller can present a new "address" per request and never hit a
rate limit.

## DNS

The apex and `www` A records point straight at this server. There is no CDN,
proxy provider or scrubbing layer in front, so the origin is the public
endpoint: it terminates TLS itself, sees real client addresses on the socket,
and is directly exposed to the internet. Firewall and rate-limit decisions
should be made on that basis.

## First administrator

The content seed does not install a default administrator. On the server, supply
a unique secret without saving it in shell history:

```bash
cd <deploy-dir>/backend
read -rsp 'Admin password: ' ADMIN_PASSWORD && echo
export ADMIN_PASSWORD
ADMIN_EMAIL='<admin email>' ADMIN_NAME='Green Barbet Admin' npm run prisma:create-admin
unset ADMIN_PASSWORD
```

Use at least 16 random characters. Rotate `JWT_SECRET` too if the account may
ever have been exposed.

## GitHub Actions secrets

**Settings → Secrets and variables → Actions**:

| Secret            | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| `SSH_HOST`        | Server IP or hostname                                          |
| `SSH_PORT`        | SSH port                                                       |
| `SSH_USER`        | Account that owns the deploy directory and can run `pm2`       |
| `SSH_PRIVATE_KEY` | The **private** half of the deploy keypair                     |
| `APP_DEPLOY_PATH` | Absolute path to the deploy directory                          |
| `SSH_KNOWN_HOSTS` | _Optional but recommended_ — see below                         |

The deploy job refuses to run if any of the first five is missing, and refuses
to `rsync --delete` if `APP_DEPLOY_PATH` is empty (which would target the home
directory and wipe it).

### About `SSH_KNOWN_HOSTS`

If the secret is set, the workflow pins the host key and a swapped or spoofed
host fails the connection. If it is **not** set, the workflow falls back to
`ssh-keyscan` at run time and logs a warning. That fallback is
trust-on-first-use on every run and gives **no protection against a
man-in-the-middle** — it exists only so the first deploy can succeed before
anyone has the host key.

To close the gap: run the first deploy, open the **Add known hosts** step in the
Actions log, copy the scanned host keys it prints, and save them as
`SSH_KNOWN_HOSTS`. Subsequent runs use the pinned key and the warning
disappears.

## Day-to-day workflow

```bash
git add .
git commit -m "..."
git push
```

GitHub Actions handles the rest: lints, tests and builds both apps; rsyncs the
repo (preserving `.env`, `backend/uploads`, and `logs`); reinstalls deps;
applies any new Prisma migrations; rebuilds; reloads both PM2 processes; then
health-checks the API on `:3070/api/v1/health` and the site on `:5070/`. Watch
progress under the repo's **Actions** tab.

Backend dev dependencies stay installed on the server: the TypeScript build and
the Prisma CLI both live there and are needed on every deploy and for
`npm run prisma:create-admin`.

## Manual redeploy / troubleshooting

Run from the deploy directory:

```bash
git pull

# npm ci wipes node_modules, which is where the Prisma client is generated;
# backend/package.json regenerates it on postinstall.
cd backend
npm ci && npx prisma migrate deploy && npm run build
pm2 startOrReload ecosystem.config.production.json --only greenbarbet-prod --update-env

cd ../frontend
npm ci && npm run build
pm2 startOrReload ecosystem.config.production.json --only greenbarbet-web-prod --update-env

pm2 save
```

Checks:

```bash
pm2 status                             # are both apps running?
pm2 logs greenbarbet-prod              # API logs
pm2 logs greenbarbet-web-prod          # site logs
tail -f logs/backend-error.log         # from the deploy directory
curl -s  localhost:3070/api/v1/health  # API up?
curl -sI localhost:5070/               # site up?
```

If a process from an earlier layout is still registered under a different name,
it will keep holding its port and shadow the new one. Remove it once with
`pm2 delete <old-name> && pm2 save`, and repoint the reverse proxy at the ports
in the table above.
