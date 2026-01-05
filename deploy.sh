#!/bin/bash
set -euo pipefail

DOMAIN="builtwithautonomy.com"
APP_DIR="/home/rswfire/www/builtwithautonomy.com"
BRANCH="main"

echo "Deploying $DOMAIN"
echo "$APP_DIR"

cd "$APP_DIR"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
rm -rf node_modules .next
npm ci
npx prisma generate
npm run build

if [ ! -d ".next" ]; then
    echo "❌ Build failed: .next directory missing"
    exit 1
fi

echo "✅ Build successful"
echo "Commit: $(git rev-parse --short HEAD)"
systemctl --user restart builtwithautonomy
