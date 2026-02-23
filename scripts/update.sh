#!/bin/bash
###############################################################################
# attnx.fun Landing — Quick Update from GitHub
#
# Usage: sudo bash /opt/attnx-landing/scripts/update.sh
#
# What it does:
#   1. git pull from GitHub
#   2. npm ci + npm run build
#   3. Update nginx config if changed
#
# Safe to run anytime. Does NOT touch: SSL, nginx zones.
###############################################################################

set -euo pipefail

APP_DIR="/opt/attnx-landing"
REPO="https://github.com/egorble/attnx.fun.git"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[UPDATE]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

if [ "$(id -u)" -ne 0 ]; then
    err "Run as root: sudo bash $0"
fi

# Fix git ownership warning
git config --global --add safe.directory "${APP_DIR}" 2>/dev/null || true

# ─── Ensure remote is set correctly ───
if [ -d "${APP_DIR}/.git" ]; then
    cd "${APP_DIR}"
    CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
    if [ "$CURRENT_REMOTE" != "$REPO" ]; then
        git remote remove origin 2>/dev/null || true
        git remote add origin "$REPO"
        log "Fixed remote origin → $REPO"
    fi
fi

# ─── Check if repo exists, clone or pull ───
if [ ! -d "${APP_DIR}/.git" ]; then
    log "First time setup — cloning repo..."
    mkdir -p "${APP_DIR}"
    cd "${APP_DIR}"
    git init
    git remote add origin "$REPO"
    git fetch origin main
    git checkout -f main
    log "Repo cloned"
else
    log "Pulling latest changes..."
    cd "${APP_DIR}"
    git fetch origin main
    git reset --hard origin/main
    log "Pull complete"
fi

# ─── Show what changed ───
echo ""
log "Recent commits:"
git log --oneline -5
echo ""

# ─── Build frontend ───
log "Installing dependencies..."
npm ci --silent 2>&1 | tail -3 || npm install --silent 2>&1 | tail -3
log "Building frontend..."
npm run build
log "Frontend built"

# ─── Update nginx config ───
DOMAIN="attnx.fun"
if [ -f "${APP_DIR}/deploy/nginx.conf" ]; then
    log "Updating nginx config..."
    NGINX_TARGET="/etc/nginx/sites-available/${DOMAIN}"
    cp "${APP_DIR}/deploy/nginx.conf" "$NGINX_TARGET"
    ln -sf "$NGINX_TARGET" "/etc/nginx/sites-enabled/${DOMAIN}"

    if nginx -t 2>/dev/null; then
        systemctl reload nginx
        log "Nginx reloaded"
    else
        warn "Nginx config test failed — skipping reload"
    fi
fi

echo ""
NGINX_OK=$(systemctl is-active nginx)
echo -e "  ${CYAN}Status:${NC}"
echo -e "  nginx: ${NGINX_OK} $([ "$NGINX_OK" = "active" ] && echo "${GREEN}OK${NC}" || echo "${RED}FAIL${NC}")"
echo -e "  ${CYAN}Site:${NC} https://${DOMAIN}"
echo ""
log "Update complete!"
