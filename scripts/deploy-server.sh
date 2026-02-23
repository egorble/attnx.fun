#!/bin/bash
###############################################################################
# attnx.fun Landing — Production Deployment Script
# Domain: attnx.fun
#
# First deploy:
#   sudo bash scripts/deploy-server.sh
#
# Update from GitHub:
#   sudo bash /opt/attnx-landing/scripts/update.sh
#
# What it does:
#   - Installs Node.js 20, nginx, certbot
#   - Clones repo, builds frontend (Vite)
#   - Configures nginx with SSL (Let's Encrypt)
#
# Safe to re-run (idempotent).
###############################################################################

set -euo pipefail

# ─── Configuration ───
DOMAIN="attnx.fun"
APP_DIR="/opt/attnx-landing"
REPO="https://github.com/egorble/attnx.fun.git"
CERTBOT_WEBROOT="/var/www/certbot"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
step() { echo -e "\n${CYAN}━━━ $1 ━━━${NC}"; }

# ─── Pre-flight checks ───
if [ "$(id -u)" -ne 0 ]; then
    err "This script must be run as root (sudo)"
fi

log "Target directory: ${APP_DIR}"
log "Domain: ${DOMAIN}"

###############################################################################
# STEP 1: Install system dependencies
###############################################################################
step "1/6 — Installing system dependencies"

apt-get update -qq

apt-get install -y -qq curl gnupg2 ca-certificates lsb-release software-properties-common git

# Node.js 20.x (skip if already installed)
if ! command -v node &>/dev/null || [[ "$(node -v)" != v20* && "$(node -v)" != v22* ]]; then
    log "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
else
    log "Node.js $(node -v) already installed"
fi

# nginx
if ! command -v nginx &>/dev/null; then
    apt-get install -y -qq nginx
else
    log "nginx already installed"
fi

# certbot
if ! command -v certbot &>/dev/null; then
    apt-get install -y -qq certbot python3-certbot-nginx
else
    log "certbot already installed"
fi

log "Node: $(node -v) | npm: $(npm -v) | nginx: $(nginx -v 2>&1 | cut -d/ -f2)"

###############################################################################
# STEP 2: Clone/pull from GitHub
###############################################################################
step "2/6 — Fetching code from GitHub"

mkdir -p "${APP_DIR}"
git config --global --add safe.directory "${APP_DIR}" 2>/dev/null || true

if [ -d "${APP_DIR}/.git" ]; then
    log "Repo exists — pulling latest..."
    cd "${APP_DIR}"
    git fetch origin main
    git reset --hard origin/main
else
    log "Cloning repo into ${APP_DIR}..."
    git clone "$REPO" "${APP_DIR}_tmp"
    cp -a "${APP_DIR}_tmp/." "${APP_DIR}/"
    rm -rf "${APP_DIR}_tmp"
fi

log "Code synced from GitHub"

###############################################################################
# STEP 3: Build frontend
###############################################################################
step "3/6 — Building frontend"

cd "${APP_DIR}"
npm ci --silent 2>&1 | tail -3 || npm install --silent 2>&1 | tail -3
npm run build
log "Frontend built at ${APP_DIR}/dist"

###############################################################################
# STEP 4: Configure nginx
###############################################################################
step "4/6 — Configuring nginx"

NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"

mkdir -p "$CERTBOT_WEBROOT"

if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    log "No SSL cert yet — installing temporary HTTP config for certbot..."
    cat > "$NGINX_CONF" << TMPNGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    location /.well-known/acme-challenge/ {
        root ${CERTBOT_WEBROOT};
        allow all;
    }

    location / {
        return 200 'attnx.fun setup in progress...';
        add_header Content-Type text/plain;
    }
}
TMPNGINX
else
    log "SSL cert exists — installing full nginx config..."
    cp "${APP_DIR}/deploy/nginx.conf" "$NGINX_CONF"
fi

ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx
log "nginx configured and reloaded"

###############################################################################
# STEP 5: SSL Certificate (Let's Encrypt)
###############################################################################
step "5/6 — SSL Certificate"

if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    log "SSL certificate already exists for ${DOMAIN}"
    EXPIRY=$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" | cut -d= -f2)
    log "Certificate expires: ${EXPIRY}"
    certbot renew --quiet --no-self-upgrade 2>/dev/null || true
else
    log "Requesting SSL certificate for ${DOMAIN}..."
    certbot certonly \
        --webroot \
        --webroot-path="$CERTBOT_WEBROOT" \
        --domain "$DOMAIN" \
        --domain "www.${DOMAIN}" \
        --non-interactive \
        --agree-tos \
        --email "admin@attnx.fun" \
        --no-eff-email

    if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
        log "SSL certificate obtained!"
        cp "${APP_DIR}/deploy/nginx.conf" "$NGINX_CONF"
        nginx -t
        systemctl reload nginx
        log "nginx updated with SSL config"
    else
        err "Failed to obtain SSL certificate. Check DNS: dig ${DOMAIN} should point to this server's IP."
    fi
fi

systemctl enable --now certbot.timer 2>/dev/null || true

###############################################################################
# STEP 6: Verification
###############################################################################
step "6/6 — Verification"

NGINX_OK=$(systemctl is-active nginx)

echo ""
echo -e "  ${CYAN}Status:${NC}"
echo -e "  nginx: ${NGINX_OK} $([ "$NGINX_OK" = "active" ] && echo "${GREEN}OK${NC}" || echo "${RED}FAIL${NC}")"
echo ""
echo -e "  ${CYAN}Site:${NC} https://${DOMAIN}"
echo ""

echo -e "${CYAN}Useful commands:${NC}"
echo "  sudo bash /opt/attnx-landing/scripts/update.sh  # Update from GitHub"
echo "  nginx -t && systemctl reload nginx               # Reload nginx"
echo "  certbot renew --dry-run                          # Test cert renewal"
echo ""
