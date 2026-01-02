# Deployment Guide

## Fast Deployment (Recommended - Skip Server Build)

This builds locally, compresses, uploads, and extracts on server:

```bash
./deploy-fast.sh
```

**Time:** ~3-5 minutes (local build + compressed upload + extract)

**Why it's faster:** Compression reduces 48MB → ~15-20MB, upload is faster

## Quick Deployment (Sync Source + Build on Server)

This syncs source files only (fast) and builds on the server:

```bash
./deploy.sh
```

**Time:** ~30 seconds for sync, then 3-5 minutes for server build

**Use when:** You want to verify server environment builds correctly

## Full Deployment (Direct rsync - Slower)

This builds locally and syncs the entire `.next` folder using rsync:

```bash
./deploy-full.sh
```

**Time:** ~3-5 minutes local build + 2-3 minutes rsync

**Note:** Slower than `deploy-fast.sh` because rsync is slower for large folders

## Manual Steps

If you prefer to do it manually:

### Option 1: Sync source files + build on server
```bash
# Build locally to check for errors
npm run build

# Sync source files (fast)
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  -e "sshpass -p 'Z6ptcPI7qCz7nIbh2ab+' ssh -o StrictHostKeyChecking=no" \
  src/ package.json tsconfig.json next.config.ts postcss.config.mjs \
  root@213.130.144.96:/home/edux-manager/htdocs/edux-manager.online/frontend/

# Build on server
sshpass -p 'Z6ptcPI7qCz7nIbh2ab+' ssh -o StrictHostKeyChecking=no root@213.130.144.96 \
  'cd /home/edux-manager/htdocs/edux-manager.online/frontend && npm run build && pm2 restart edux-frontend'
```

### Option 2: Build locally + sync .next folder
```bash
# Build locally
npm run build

# Sync .next folder (slower due to size)
rsync -avz --progress \
  -e "sshpass -p 'Z6ptcPI7qCz7nIbh2ab+' ssh -o StrictHostKeyChecking=no" \
  .next/ root@213.130.144.96:/home/edux-manager/htdocs/edux-manager.online/frontend/.next/

# Restart PM2 (no build needed on server)
sshpass -p 'Z6ptcPI7qCz7nIbh2ab+' ssh -o StrictHostKeyChecking=no root@213.130.144.96 \
  'cd /home/edux-manager/htdocs/edux-manager.online/frontend && pm2 restart edux-frontend'
```

## Recommendation

**Use `./deploy.sh`** - It's faster overall because:
- Source file sync is very fast (~30 seconds)
- Server builds in parallel while you can do other work
- Avoids transferring large `.next` folder

Use `./deploy-full.sh` only if:
- Server build is consistently failing
- You want to test the exact same build locally and on server
- You have fast upload bandwidth

