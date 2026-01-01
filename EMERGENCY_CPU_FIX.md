# Emergency CPU Usage Fix - Commands

## Immediate Actions to Stop High CPU Usage

### 1. Check What's Using CPU
```bash
ssh root@213.130.144.96
top
# Press 'q' to exit
```

### 2. Stop Frontend (PM2)
```bash
pm2 stop edux-frontend
# Or kill all Node processes
pkill -f "next-server"
pkill -f "node"
```

### 3. Stop Backend (Docker)
```bash
docker stop edux-manageronline-backend-1
# Or stop all containers
docker stop $(docker ps -q)
```

### 4. Stop Nginx (if needed)
```bash
systemctl stop nginx
```

### 5. Check for Running Builds
```bash
ps aux | grep -E "(npm|node|next|build)" | grep -v grep
# Kill any build processes
pkill -f "npm run build"
pkill -f "next build"
```

### 6. Check PM2 Status
```bash
pm2 list
pm2 stop all
pm2 delete all
```

### 7. Check Docker Containers
```bash
docker ps
docker stats  # Shows CPU usage per container
```

## Complete Service Stop (Nuclear Option)
```bash
# Stop everything
pm2 stop all
docker stop $(docker ps -q)
systemctl stop nginx
pkill -9 node
pkill -9 npm
pkill -9 next
```

## What I Changed (Files to Review/Revert)

### 1. API Configuration Files
- `src/lib/api/apiConfig.ts` - Updated to use environment variable
- `src/lib/api/students.tsx` - Updated to use centralized API
- `src/lib/api/teachers.tsx` - Updated to use centralized API
- `src/lib/api/parents.tsx` - Updated to use centralized API

### 2. New API Files Created
- `src/lib/api/settings.ts` - NEW FILE
- `src/lib/api/attendance.ts` - NEW FILE
- `src/lib/api/announcements.ts` - NEW FILE
- `src/lib/api/timetables.ts` - NEW FILE

### 3. Page Files Updated (Now Fetching from API)
- `src/app/admin/settings/page.tsx` - Added API calls
- `src/app/admin/attendance/page.tsx` - Changed from JSON to API
- `src/app/admin/announcements/page.tsx` - Changed from static to API
- `src/app/admin/academic/timetables/page.tsx` - Changed from static to API

### 4. Potential Issues
- **Infinite loops**: Check useEffect hooks in updated pages
- **Continuous API calls**: Check if API calls are being made in loops
- **Build process**: Check if build is running continuously

## Quick Fix - Revert to Previous Version

### Option 1: Restore from Git (if you have git)
```bash
cd /home/edux-manager/htdocs/edux-manager.online/frontend
git status
git log --oneline -10  # See recent commits
git reset --hard HEAD~1  # Revert last commit (CAREFUL!)
```

### Option 2: Stop Services and Restart One by One
```bash
# 1. Stop everything
pm2 stop all
docker stop edux-manageronline-backend-1

# 2. Wait 30 seconds
sleep 30

# 3. Start backend only
cd /home/edux-manager/htdocs/edux-manager.online/backend
docker start edux-manageronline-backend-1

# 4. Check CPU
top
# If CPU is normal, then start frontend
# If CPU is still high, the issue is in backend
```

## Check for Infinite Loops in Code

Look for these patterns in the updated files:
- `useEffect` without proper dependencies
- API calls in render functions
- `setState` calls that trigger re-renders in loops

## Files Most Likely Causing Issues

1. `src/app/admin/attendance/page.tsx` - Has useEffect that might be looping
2. `src/app/admin/announcements/page.tsx` - Has useEffect that might be looping
3. `src/app/admin/academic/timetables/page.tsx` - Has useEffect that might be looping
4. `src/app/admin/settings/page.tsx` - Has useEffect that might be looping


