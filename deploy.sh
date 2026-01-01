#!/bin/bash
set -euo pipefail

DOMAIN="builtwithautonomy.com"
APP_DIR="/home/rswfire/www/builtwithautonomy.com"
BRANCH="main"

echo "🚀 Deploying $DOMAIN"
echo "📂 $APP_DIR"
echo ""

cd "$APP_DIR"

echo "⬇️  Updating code..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
echo ""

echo "🧹 Cleaning build artifacts..."
rm -rf node_modules .next
echo ""

echo "📦 Installing dependencies..."
npm ci
echo ""

echo "🔨 Building application..."
npm run build
echo ""

if [ ! -d ".next" ]; then
    echo "❌ Build failed: .next directory missing"
    exit 1
fi

echo "✅ Build successful"
echo "📍 Commit: $(git rev-parse --short HEAD)"
echo "⏱  Finished: $(date)"

sudo systemctl restart builtwithautonomy
