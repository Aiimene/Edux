#!/bin/bash

# Fast deploy - builds locally, compresses .next, uploads, and extracts on server
# This is faster than rsync for large folders

echo "📦 Building locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🗜️  Compressing .next folder..."

# Create a compressed archive
tar -czf .next.tar.gz .next/

if [ $? -ne 0 ]; then
    echo "❌ Compression failed."
    exit 1
fi

echo "✅ Compressed! ($(du -h .next.tar.gz | cut -f1))"
echo ""
echo "🚀 Uploading to VPS..."

# Upload compressed file
sshpass -p 'Z6ptcPI7qCz7nIbh2ab+' scp -o StrictHostKeyChecking=no .next.tar.gz \
  root@213.130.144.96:/home/edux-manager/htdocs/edux-manager.online/frontend/

echo "✅ Uploaded!"
echo ""
echo "📦 Extracting on server..."

# Extract on server and restart
sshpass -p 'Z6ptcPI7qCz7nIbh2ab+' ssh -o StrictHostKeyChecking=no root@213.130.144.96 << 'EOF'
cd /home/edux-manager/htdocs/edux-manager.online/frontend
rm -rf .next
tar -xzf .next.tar.gz
rm .next.tar.gz
pm2 restart edux-frontend
EOF

# Clean up local archive
rm .next.tar.gz

echo ""
echo "✅ Deployment complete!"

