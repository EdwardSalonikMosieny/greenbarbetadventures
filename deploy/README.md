# Deployment — split hosting

The site is split across two providers:

- **Frontend** (static React build) — hosted on **hosting.com**, on the same
  **WP Starter** plan that used to run the old WordPress site, at
  `greenbarbetadventures.com` / `www.greenbarbetadventures.com`.
- **Backend** (Express + PostgreSQL) — a **VPS**, at
  `api.greenbarbetadventures.com`. WP Starter is PHP/MySQL shared hosting
  with no SSH and no Node.js runtime, so it can't run the API — the backend
  needs a real server.

Push to `main` → two independent GitHub Actions workflows deploy each half:
`deploy.yml` (backend, over SSH) and `deploy-frontend.yml` (frontend, over
FTP). No manual server work after the one-time setup below.

## Architecture

```
Browser → greenbarbetadventures.com / www (hosting.com, Apache/LiteSpeed)
            → serves frontend/dist (static files) + .htaccess SPA fallback

Browser → api.greenbarbetadventures.com (VPS, Nginx, port 443)
            → /api/*, /uploads/* → 127.0.0.1:4000 (PM2: gba-backend)
                                  → PostgreSQL (local to the VPS)
```

The frontend talks to the API cross-origin (`VITE_API_BASE_URL` baked in at
build time as `https://api.greenbarbetadventures.com/api/v1`); the backend's
`FRONTEND_ORIGIN` env var allow-lists both frontend domains for CORS.

## One-time setup

### 1. Clear out the old WordPress site (hosting.com)

**Manual, do this yourself** — back up anything you want to keep (hPanel →
Files → Backups, or download via File Manager/FTP first), then remove the
WordPress files from `public_html` (and the WordPress database, if you want
it fully gone — check hPanel → Databases). This isn't something to automate;
it's a one-way step on the client's existing production site.

### 2. Get FTP credentials for the frontend

In hPanel → **Files → FTP Accounts**, note (or create) an FTP account scoped
to this site, and its server hostname. You'll need these for step 5 and for
the first manual upload in step 6.

### 3. Provision the backend VPS

SSH into the fresh VPS as root and run:

```bash
curl -fsSL https://raw.githubusercontent.com/EdwardSalonikMosieny/greenbarbetadventures/main/deploy/setup-vps.sh -o setup-vps.sh
bash setup-vps.sh
```

This installs Node, PostgreSQL, Nginx, PM2, and certbot; clones the repo to
`/var/www/green-barbet-adventures`; creates the database with a randomly
generated password; generates a random `JWT_SECRET`; sets `FRONTEND_ORIGIN`
to the two hosting.com domains; builds and starts the backend under PM2; and
configures Nginx for `api.greenbarbetadventures.com` only — it does not
build or serve the frontend. It prints next steps at the end (DNS + certbot).

### 4. Point DNS at both targets (hosting.com's DNS zone)

In hosting.com's DNS zone editor for the domain, confirm/add:

| Type | Name | Value                          | Purpose                         |
| ---- | ---- | ------------------------------ | -------------------------------- |
| A    | @    | hosting.com's shared-hosting IP | Frontend (WP Starter) — should already be the default |
| A    | www  | hosting.com's shared-hosting IP | Frontend (WP Starter) — should already be the default |
| A    | api  | `<VPS IP>`                      | Backend API                     |

Only the `api` record is new. DNS can take anywhere from a few minutes to a
few hours to propagate.

### 5. Issue the SSL certificate (VPS only)

hosting.com issues/manages its own SSL for the WP Starter domains — nothing
to do there. On the VPS, once `api.greenbarbetadventures.com` resolves to
it:

```bash
certbot --nginx -d api.greenbarbetadventures.com
```

Certbot edits the Nginx config to add HTTPS and sets up auto-renewal.

### 6. First frontend upload (before Actions secrets exist)

Either wait for step 7, or ship the first build manually so the domain isn't
sitting on stale WordPress files while you set up secrets:

```bash
cd frontend
VITE_API_BASE_URL=https://api.greenbarbetadventures.com/api/v1 npm run build
```

Upload the contents of `frontend/dist/` (including the hidden `.htaccess`
file — make sure your FTP client shows hidden files) to `public_html` via
FTP or hPanel's File Manager.

### 7. Wire up GitHub Actions auto-deploy

**Backend** — a dedicated deploy keypair was generated for this
(`~/.ssh/gba_deploy` / `gba_deploy.pub`) and its public half added to the
VPS's `authorized_keys` (via hPanel, if the VPS is also on Hostinger, or
directly) before initial setup ran.

In the GitHub repo, go to **Settings → Secrets and variables → Actions**
and add:

| Secret          | Value                                                                   |
| --------------- | ------------------------------------------------------------------------ |
| `VPS_HOST`      | The VPS's IP address                                                    |
| `VPS_USER`      | `root` (or whichever user has the deploy key + repo access)             |
| `VPS_SSH_KEY`   | The **private** key content (`~/.ssh/gba_deploy`, not the `.pub` file)  |
| `VPS_PORT`      | Only needed if SSH isn't on port 22                                     |
| `FTP_SERVER`    | The FTP hostname from step 2                                            |
| `FTP_USERNAME`  | The FTP username from step 2                                            |
| `FTP_PASSWORD`  | The FTP password from step 2                                            |

That's it — `.github/workflows/deploy.yml` and
`.github/workflows/deploy-frontend.yml` pick these up automatically. Every
push to `main` now redeploys both halves within about a minute.

**Check `server-dir` in `deploy-frontend.yml` before relying on it** — it's
currently `./`, which assumes the FTP account's home directory is already
`public_html`. If your FTP account instead lands somewhere else, change
`server-dir` to the right relative path (e.g. `public_html/`).

## Day-to-day workflow

```bash
git add .
git commit -m "..."
git push
```

GitHub Actions handles the rest, for both halves:
- **Backend**: pulls the new commit, reinstalls deps if `package.json`
  changed, applies any new Prisma migrations, rebuilds, and restarts the
  backend under PM2. Watch progress under the **Actions** tab
  (`Deploy backend to VPS`).
- **Frontend**: rebuilds the static site against the production API URL and
  uploads it over FTP (`Deploy frontend to hosting.com`).

## Manual redeploy / troubleshooting

**Backend** — SSH in directly and re-run the same steps the workflow runs:

```bash
ssh -i ~/.ssh/gba_deploy root@<VPS_IP>
cd /var/www/green-barbet-adventures
git pull
cd backend && npm ci && npx prisma migrate deploy && npm run build && pm2 restart gba-backend
sudo nginx -t && sudo systemctl reload nginx
```

Useful commands on the VPS:

```bash
pm2 logs gba-backend      # backend logs
pm2 status                # is it running?
sudo journalctl -u nginx  # nginx errors
sudo tail -f /var/log/nginx/error.log
```

**Frontend** — rebuild locally and re-upload, same as step 6 above.
