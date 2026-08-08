#!/usr/bin/env bash
# One-time VPS provisioning for Green Barbet Adventures.
# Run once, as root, on a fresh Ubuntu Hostinger VPS:
#   bash setup-vps.sh
#
# Installs Node.js, PostgreSQL, Nginx, PM2, and certbot; clones the repo;
# builds both apps; creates the Postgres database; starts the backend under
# PM2; and writes an Nginx site config. SSL (certbot) is a separate manual
# step at the bottom, run only after DNS is pointed at this server.

set -euo pipefail

# --- Configuration — edit these before running if anything differs ---
REPO_URL="https://github.com/EdwardSalonikMosieny/greenbarbetadventures.git"
APP_DIR="/var/www/green-barbet-adventures"
DOMAIN="greenbarbetadventures.com"
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

echo "== Fetching and validating Cloudflare proxy ranges =="
CF_RANGE_DIR="$(mktemp -d)"
trap 'rm -rf "$CF_RANGE_DIR"' EXIT
curl --proto '=https' --tlsv1.2 -fsS https://www.cloudflare.com/ips-v4 -o "${CF_RANGE_DIR}/ips-v4"
curl --proto '=https' --tlsv1.2 -fsS https://www.cloudflare.com/ips-v6 -o "${CF_RANGE_DIR}/ips-v6"
mapfile -t CLOUDFLARE_IPV4_RANGES < "${CF_RANGE_DIR}/ips-v4"
mapfile -t CLOUDFLARE_IPV6_RANGES < "${CF_RANGE_DIR}/ips-v6"

if [ "${#CLOUDFLARE_IPV4_RANGES[@]}" -eq 0 ] || [ "${#CLOUDFLARE_IPV6_RANGES[@]}" -eq 0 ]; then
  echo "Cloudflare returned an empty IP range list; refusing to configure the origin." >&2
  exit 1
fi

for range in "${CLOUDFLARE_IPV4_RANGES[@]}"; do
  if [[ ! "$range" =~ ^[0-9.]+/[0-9]{1,2}$ ]]; then
    echo "Invalid Cloudflare IPv4 CIDR: $range" >&2
    exit 1
  fi
done
for range in "${CLOUDFLARE_IPV6_RANGES[@]}"; do
  if [[ ! "$range" =~ ^[0-9A-Fa-f:]+/[0-9]{1,3}$ ]]; then
    echo "Invalid Cloudflare IPv6 CIDR: $range" >&2
    exit 1
  fi
done

{
  echo "# Generated from Cloudflare's published ranges by deploy/setup-vps.sh."
  for range in "${CLOUDFLARE_IPV4_RANGES[@]}" "${CLOUDFLARE_IPV6_RANGES[@]}"; do
    echo "set_real_ip_from ${range};"
  done
  echo "real_ip_header CF-Connecting-IP;"
  echo "real_ip_recursive on;"
} > /etc/nginx/conf.d/cloudflare-real-ip.conf

echo "== Installing PM2 =="
npm install -g pm2

echo "== Installing certbot (for SSL, run later) =="
apt-get install -y certbot python3-certbot-nginx

echo "== Configuring firewall =="
ufw allow OpenSSH
# The public origin must not be reachable around Cloudflare. This also makes
# CF-Connecting-IP trustworthy at Nginx because only Cloudflare can connect.
ufw --force delete allow 'Nginx Full' || true
for range in "${CLOUDFLARE_IPV4_RANGES[@]}" "${CLOUDFLARE_IPV6_RANGES[@]}"; do
  ufw allow proto tcp from "$range" to any port 80
  ufw allow proto tcp from "$range" to any port 443
done
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
HOST=127.0.0.1
NODE_ENV=production
FRONTEND_ORIGIN=https://${DOMAIN},https://www.${DOMAIN}
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
EOF
echo "Wrote ${APP_DIR}/backend/.env (DB password and JWT secret generated randomly — not printed)."

echo "== Writing frontend/.env.production =="
cat > "${APP_DIR}/frontend/.env.production" <<EOF
VITE_API_BASE_URL=https://${DOMAIN}/api/v1
EOF

echo "== Installing backend deps, running migrations, seeding, building =="
cd "${APP_DIR}/backend"
npm ci
npx prisma migrate deploy
npx prisma db seed
npm run build

echo "== Installing frontend deps and building =="
cd "${APP_DIR}/frontend"
npm ci
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
sed -i "s#__APP_DIR__#${APP_DIR}#g" "/etc/nginx/sites-available/${DOMAIN}"
ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "=========================================================="
echo "Base provisioning complete."
echo "Backend running under PM2 as 'gba-backend' on 127.0.0.1:4000"
echo "Nginx serving ${APP_DIR}/frontend/dist and proxying /api + /uploads"
echo ""
echo "NEXT STEPS:"
echo "1. Point ${DOMAIN}'s DNS A record at this server's IP."
echo "2. Proxy the apex and www DNS records through Cloudflare (orange cloud)."
echo "3. Once DNS has propagated, run:"
echo "   certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "4. In Cloudflare, select Full (strict) TLS and enable Authenticated Origin Pulls."
echo "5. Create the first admin with a unique secret (see deploy/README.md)."
echo "=========================================================="
