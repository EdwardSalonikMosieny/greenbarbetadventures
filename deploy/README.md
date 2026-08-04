# Deployment — Hostinger VPS

How the live site stays in sync with GitHub: push to `main` → GitHub Actions
SSHes into the VPS → pulls, rebuilds, restarts. No manual server work after
the one-time setup below.

## Architecture

One Ubuntu VPS runs everything:

- **PostgreSQL** — the database, local to the VPS.
- **Backend** (Express) — built to `backend/dist`, run under **PM2** as
  `gba-backend`, listening on `127.0.0.1:4000` (not exposed directly).
- **Frontend** (React) — built to `frontend/dist`, served as static files
  directly by **Nginx**.
- **Nginx** — serves the frontend, reverse-proxies `/api/` and `/uploads/`
  to the backend, and terminates SSL (via certbot/Let's Encrypt).

```
Browser → Nginx (443) → / → frontend/dist (static files)
                       → /api/*, /uploads/* → 127.0.0.1:4000 (PM2: gba-backend)
```

## One-time setup

### 1. Provision the server

SSH into the fresh VPS as root and run:

```bash
curl -fsSL https://raw.githubusercontent.com/EdwardSalonikMosieny/greenbarbetadventures/main/deploy/setup-vps.sh -o setup-vps.sh
bash setup-vps.sh
```

This installs Node, PostgreSQL, Nginx, PM2, and certbot; clones the repo to
`/var/www/green-barbet-adventures`; creates the database with a randomly
generated password; generates a random `JWT_SECRET`; builds both apps;
starts the backend under PM2; and configures Nginx. It prints next steps at
the end (DNS + certbot).

### 2. Point DNS at the server

In your domain registrar (or Hostinger's DNS zone editor if the domain is
also managed there), add:

| Type | Name | Value            |
| ---- | ---- | ---------------- |
| A    | @    | `<your VPS IP>`  |
| A    | www  | `<your VPS IP>`  |

DNS can take anywhere from a few minutes to a few hours to propagate.

### 3. Issue the SSL certificate

Once DNS resolves to the server (`ping greenbarbetadventures.com` shows the
VPS IP), run on the VPS:

```bash
certbot --nginx -d greenbarbetadventures.com -d www.greenbarbetadventures.com
```

Certbot edits the Nginx config to add HTTPS and sets up auto-renewal.

### 4. Wire up GitHub Actions auto-deploy

A dedicated deploy keypair was generated for this
(`~/.ssh/gba_deploy` / `gba_deploy.pub`) and its public half added to the
VPS's `authorized_keys` (via hPanel) before initial setup ran.

In the GitHub repo, go to **Settings → Secrets and variables → Actions**
and add:

| Secret        | Value                                                      |
| ------------- | ------------------------------------------------------------ |
| `VPS_HOST`    | The VPS's IP address                                        |
| `VPS_USER`    | `root` (or whichever user has the deploy key + repo access) |
| `VPS_SSH_KEY` | The **private** key content (`~/.ssh/gba_deploy`, not the `.pub` file) |
| `VPS_PORT`    | Only needed if SSH isn't on port 22                          |

That's it — `.github/workflows/deploy.yml` picks these up automatically.
Every push to `main` now redeploys the live site within about a minute.

## Day-to-day workflow

```bash
git add .
git commit -m "..."
git push
```

GitHub Actions handles the rest: pulls the new commit, reinstalls deps if
`package.json` changed, applies any new Prisma migrations, rebuilds both
apps, and restarts the backend. Watch progress under the repo's **Actions**
tab.

## Manual redeploy / troubleshooting

SSH in directly and re-run the same steps the workflow runs:

```bash
ssh -i ~/.ssh/gba_deploy root@<VPS_IP>
cd /var/www/green-barbet-adventures
git pull
cd backend && npm ci && npx prisma migrate deploy && npm run build && pm2 restart gba-backend
cd ../frontend && npm ci && npm run build
sudo nginx -t && sudo systemctl reload nginx
```

Useful commands on the VPS:

```bash
pm2 logs gba-backend      # backend logs
pm2 status                # is it running?
sudo journalctl -u nginx  # nginx errors
sudo tail -f /var/log/nginx/error.log
```
