#!/bin/bash

# Full deploy script - builds locally and syncs .next folder (skips server build)

echo "📦 Building locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🚀 Syncing .next folder to VPS (this may take a while due to size)..."

# Sync the built .next folder
rsync -avz --progress \
  -e "sshpass -p 'Z6ptcPI7qCz7nIbh2ab+' ssh -o StrictHostKeyChecking=no" \
  .next/ root@213.130.144.96:/home/edux-manager/htdocs/edux-manager.online/frontend/.next/

echo ""
echo "✅ .next folder synced!"
echo ""
echo "🔄 Restarting PM2..."
sshpass -p 'Z6ptcPI7qCz7nIbh2ab+' ssh -o StrictHostKeyChecking=no root@213.130.144.96 \
  'cd /home/edux-manager/htdocs/edux-manager.online/frontend && pm2 restart edux-frontend'

echo ""
echo "✅ Deployment complete!"

