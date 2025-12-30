#!/bin/bash

# Google Sign-In Configuration Script
# This script helps you configure Google OAuth for Edux Platform

echo "=========================================="
echo "Google Sign-In Configuration for Edux"
echo "=========================================="
echo ""

# Check if Client ID is provided as argument
if [ -z "$1" ]; then
    echo "Usage: ./setup-google-signin.sh YOUR_GOOGLE_CLIENT_ID"
    echo ""
    echo "Example:"
    echo "  ./setup-google-signin.sh 123456789-abc.apps.googleusercontent.com"
    echo ""
    echo "To get your Google Client ID:"
    echo "1. Go to https://console.cloud.google.com/"
    echo "2. Navigate to APIs & Services > Credentials"
    echo "3. Create OAuth 2.0 Client ID (Web application)"
    echo "4. Copy the Client ID"
    echo ""
    exit 1
fi

CLIENT_ID=$1
VPS_HOST="213.130.144.96"
VPS_USER="root"
VPS_PASS="Fateh.VPS.edux.123456789.typeshi"
FRONTEND_DIR="/home/edux-manager/htdocs/edux-manager.online/frontend"

echo "Setting up Google Client ID: $CLIENT_ID"
echo ""

# Validate Client ID format
if [[ ! $CLIENT_ID =~ ^[0-9]+-[a-zA-Z0-9_-]+\.apps\.googleusercontent\.com$ ]]; then
    echo "⚠️  Warning: Client ID format doesn't look correct."
    echo "Expected format: 123456789-abc.apps.googleusercontent.com"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "Step 1: Updating .env.local on VPS..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
cd $FRONTEND_DIR

# Create or update .env.local
if [ ! -f .env.local ]; then
    echo "# Google OAuth Configuration" > .env.local
    echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=$CLIENT_ID" >> .env.local
    echo "NEXT_PUBLIC_API_URL=https://edux-manager.online/api" >> .env.local
else
    # Update existing file
    if grep -q "NEXT_PUBLIC_GOOGLE_CLIENT_ID" .env.local; then
        sed -i "s|NEXT_PUBLIC_GOOGLE_CLIENT_ID=.*|NEXT_PUBLIC_GOOGLE_CLIENT_ID=$CLIENT_ID|g" .env.local
    else
        echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=$CLIENT_ID" >> .env.local
    fi
fi

echo "✅ .env.local updated"
cat .env.local
EOF

if [ $? -ne 0 ]; then
    echo "❌ Failed to update .env.local"
    exit 1
fi

echo ""
echo "Step 2: Rebuilding frontend..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
cd $FRONTEND_DIR
npm run build
EOF

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "Step 3: Restarting frontend..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
cd $FRONTEND_DIR
pkill -f "next-server" || true
sleep 2
PORT=3000 nohup npm start > /tmp/frontend.log 2>&1 &
sleep 3
ps aux | grep -E "(next-server|npm start)" | grep -v grep | head -2
EOF

echo ""
echo "=========================================="
echo "✅ Google Sign-In Configuration Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Make sure your Google OAuth Client ID has these authorized origins:"
echo "   - https://edux-manager.online"
echo "   - https://www.edux-manager.online"
echo ""
echo "2. Make sure these redirect URIs are configured:"
echo "   - https://edux-manager.online/login"
echo "   - https://edux-manager.online/register"
echo ""
echo "3. Test Google Sign-In at:"
echo "   https://edux-manager.online/register"
echo ""

