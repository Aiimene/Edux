#!/bin/bash
# IMMEDIATE COMMANDS TO STOP HIGH CPU USAGE
# Run these commands on the VPS server

echo "=== EMERGENCY CPU FIX ==="
echo ""

# 1. Stop Frontend
echo "1. Stopping frontend..."
pm2 stop edux-frontend 2>/dev/null || echo "PM2 not running"
pkill -9 -f "next-server" 2>/dev/null || echo "No next-server process"
pkill -9 -f "node.*3000" 2>/dev/null || echo "No node process on 3000"
echo "✅ Frontend stopped"
echo ""

# 2. Stop Backend
echo "2. Stopping backend..."
docker stop edux-manageronline-backend-1 2>/dev/null || echo "Backend container not running"
echo "✅ Backend stopped"
echo ""

# 3. Kill all Node processes
echo "3. Killing all Node processes..."
pkill -9 node 2>/dev/null || echo "No node processes"
pkill -9 npm 2>/dev/null || echo "No npm processes"
echo "✅ Node processes killed"
echo ""

# 4. Check CPU usage
echo "4. Current CPU usage:"
top -bn1 | head -5
echo ""

# 5. Check what's still running
echo "5. Remaining processes:"
ps aux | grep -E "(node|npm|next)" | grep -v grep || echo "No node/npm/next processes found"
echo ""

echo "=== DONE ==="
echo "CPU should be back to normal. Check with: top"


