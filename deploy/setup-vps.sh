#!/usr/bin/env bash
# One-time VPS provisioning for the Green Barbet Adventures API.
# Run once, as root, on a fresh Ubuntu Hostinger VPS:
#   bash setup-vps.sh
#
# This box runs ONLY the backend (Express + Postgres), at api.greenbarbetadventures.com.
# The frontend is a static build served separately from hosting.com — see
# deploy/README.md for that half of the setup.
#
# Installs Node.js, PostgreSQL, Nginx, PM2, and certbot; clones the repo;
# builds the backend; creates the Postgres database; starts it under PM2;
# and writes an Nginx site config. SSL (certbot) is a separate manual step
# at the bottom, run only after DNS is pointed at this server.

set -euo pipefail

# --- Configuration — edit these before running if anything differs ---
REPO_URL="https://github.com/EdwardSalonikMosieny/greenbarbetadventures.git"
APP_DIR="/var/www/green-barbet-adventures"
DOMAIN="api.greenbarbetadventures.com"
FRONTEND_ORIGINS="https://greenbarbetadventures.com,https://www.greenbarbetadventures.com"
DB_NAME="green_barbet_adventures"
DB_USER="gba_app"
NODE_MAJOR=20

echo "== Updating apt and installing base packages =="
apt-get update -y
apt-get install -y curl git build-essential ufw

echo "== Installing Node.js ${NODE_MAJOR}.x =="
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt "$NODE_MAJOR" ]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
node -v
npm -v

echo "== Installing PostgreSQL =="
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

echo "== Installing Nginx =="
apt-get install -y nginx
systemctl enable nginx

echo "== Installing PM2 =="
npm install -g pm2

echo "== Installing certbot (for SSL, run later) =="
apt-get install -y certbot python3-certbot-nginx

echo "== Configuring firewall =="
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "== Creating PostgreSQL database and user =="
DB_PASSWORD="$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 32)"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

echo "== Cloning application repo =="
mkdir -p "$(dirname "$APP_DIR")"
if [ -d "$APP_DIR/.git" ]; then
  echo "Repo already present at $APP_DIR — pulling latest instead of cloning."
  git -C "$APP_DIR" pull
else
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "== Writing backend/.env =="
JWT_SECRET="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 64)"
cat > "${APP_DIR}/backend/.env" <<EOF
PORT=4000
FRONTEND_ORIGIN=${FRONTEND_ORIGINS}
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
EOF
echo "Wrote ${APP_DIR}/backend/.env (DB password and JWT secret generated randomly — not printed)."

echo "== Installing backend deps, running migrations, seeding, building =="
cd "${APP_DIR}/backend"
npm ci
npx prisma migrate deploy
npx prisma db seed
npm run build

echo "== Creating uploads dir (writable) =="
mkdir -p "${APP_DIR}/backend/uploads"

echo "== Starting backend under PM2 =="
cd "${APP_DIR}/backend"
pm2 start dist/index.js --name gba-backend --time
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

echo "== Writing Nginx site config =="
cp "${APP_DIR}/deploy/nginx-green-barbet.conf" "/etc/nginx/sites-available/${DOMAIN}"
sed -i "s/__DOMAIN__/${DOMAIN}/g" "/etc/nginx/sites-available/${DOMAIN}"
ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "=========================================================="
echo "Base provisioning complete."
echo "Backend running under PM2 as 'gba-backend' on 127.0.0.1:4000"
echo "Nginx proxying https://${DOMAIN}/api and /uploads to it"
echo "(the frontend is NOT served from this box — see deploy/README.md)"
echo ""
echo "NEXT STEPS:"
echo "1. Point ${DOMAIN}'s DNS A record at this server's IP."
echo "2. Once DNS has propagated, run:"
echo "   certbot --nginx -d ${DOMAIN}"
echo "=========================================================="
