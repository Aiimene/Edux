#!/bin/bash

# Quick deploy script - syncs source files only (fast), then builds on server

echo "📦 Building locally to check for errors..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed locally. Fix errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"
echo ""
echo "🚀 Syncing source files to VPS (this is fast)..."

# Sync only source files, exclude node_modules, .next, .git
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' --exclude '*.log' \
  -e "sshpass -p 'Z6ptcPI7qCz7nIbh2ab+' ssh -o StrictHostKeyChecking=no" \
  src/ package.json tsconfig.json next.config.ts postcss.config.mjs \
  root@213.130.144.96:/home/edux-manager/htdocs/edux-manager.online/frontend/

echo ""
echo "✅ Source files synced!"
echo ""
echo "🔨 Building on server (this will take a few minutes)..."
echo "You can check progress with: ssh root@213.130.144.96 'cd /home/edux-manager/htdocs/edux-manager.online/frontend && npm run build'"

