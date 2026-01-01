# Files I Changed That May Cause High CPU Usage

## IMMEDIATE COMMANDS TO RUN ON VPS:

```bash
# Copy and paste these commands one by one:

# 1. Stop frontend
pm2 stop edux-frontend
pkill -9 -f "next-server"
pkill -9 node

# 2. Stop backend  
docker stop edux-manageronline-backend-1

# 3. Check CPU
top
# Press 'q' to exit

# 4. If CPU is still high, kill everything
pkill -9 npm
pkill -9 next
systemctl stop nginx
```

## Files I Modified (Causing Potential Infinite Loops):

### 1. **CRITICAL - Pages with useEffect Issues:**

#### `src/app/admin/attendance/page.tsx`
- **Problem**: useEffect depends on `filters` object which may recreate on every render
- **Line**: `useEffect(() => { ... }, [filters]);`
- **Fix**: Revert to using static JSON data

#### `src/app/admin/academic/timetables/page.tsx`  
- **Problem**: useEffect depends on filters that update options, causing loop
- **Line**: `useEffect(() => { ... }, [moduleFilter, levelFilter, teacherFilter]);`
- **Fix**: Revert to using static data

#### `src/app/admin/announcements/page.tsx`
- **Problem**: useEffect may be called repeatedly
- **Line**: `useEffect(() => { ... }, []);`
- **Fix**: Revert to static announcements array

#### `src/app/admin/settings/page.tsx`
- **Problem**: useEffect loads settings on mount
- **Line**: `useEffect(() => { ... }, []);`
- **Fix**: Remove API call or add proper error handling

### 2. **API Files Created (New):**
- `src/lib/api/settings.ts` - DELETE THIS FILE
- `src/lib/api/attendance.ts` - DELETE THIS FILE  
- `src/lib/api/announcements.ts` - DELETE THIS FILE
- `src/lib/api/timetables.ts` - DELETE THIS FILE

### 3. **API Files Modified:**
- `src/lib/api/apiConfig.ts` - Added SETTINGS endpoint (can keep)
- `src/lib/api/students.tsx` - Updated to use centralized API (should be OK)
- `src/lib/api/teachers.tsx` - Updated to use centralized API (should be OK)
- `src/lib/api/parents.tsx` - Updated to use centralized API (should be OK)

## Quick Revert Commands:

### On VPS - Revert Frontend Files:
```bash
cd /home/edux-manager/htdocs/edux-manager.online/frontend

# Delete new API files
rm -f src/lib/api/settings.ts
rm -f src/lib/api/attendance.ts
rm -f src/lib/api/announcements.ts
rm -f src/lib/api/timetables.ts

# Restore original pages (if you have git)
git checkout HEAD -- src/app/admin/attendance/page.tsx
git checkout HEAD -- src/app/admin/announcements/page.tsx
git checkout HEAD -- src/app/admin/academic/timetables/page.tsx
git checkout HEAD -- src/app/admin/settings/page.tsx
```

### Or Manually Revert Pages:

1. **attendance/page.tsx** - Remove API calls, use `attendanceData` from JSON
2. **announcements/page.tsx** - Remove API calls, use static `announcements` array
3. **timetables/page.tsx** - Remove API calls, use static `sessions` array
4. **settings/page.tsx** - Remove `getGeneralSettings()` call from useEffect

## Most Likely Culprit:

**`src/app/admin/academic/timetables/page.tsx`** - The useEffect depends on filters that update the options, which may cause infinite re-renders.

## Emergency Fix - Disable Problematic Pages:

```bash
# On VPS, rename the problematic pages temporarily
cd /home/edux-manager/htdocs/edux-manager.online/frontend/src/app/admin

mv attendance/page.tsx attendance/page.tsx.disabled
mv announcements/page.tsx announcements/page.tsx.disabled  
mv academic/timetables/page.tsx academic/timetables/page.tsx.disabled
mv settings/page.tsx settings/page.tsx.disabled

# Rebuild
npm run build
pm2 restart edux-frontend
```


