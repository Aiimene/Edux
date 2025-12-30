# Google OAuth Client ID Setup

## Problem
The error "Missing required parameter: client_id" occurs because the Google OAuth Client ID is not configured.

## Solution

### Step 1: Get Your Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Add authorized JavaScript origins:
   - `https://edux-manager.online`
   - `https://www.edux-manager.online`
7. Add authorized redirect URIs:
   - `https://edux-manager.online/login`
   - `https://edux-manager.online/register`
8. Copy the **Client ID** (format: `xxxxxx-xxxxx.apps.googleusercontent.com`)

### Step 2: Add Client ID to VPS

SSH into your VPS and edit the `.env.local` file:

```bash
ssh root@213.130.144.96
cd /home/edux-manager/htdocs/edux-manager.online/frontend
nano .env.local
```

Add your Google Client ID:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

Save and exit (Ctrl+X, then Y, then Enter).

### Step 3: Rebuild and Restart

```bash
cd /home/edux-manager/htdocs/edux-manager.online/frontend
npm run build
pkill -f "next-server"
PORT=3000 nohup npm start > /tmp/frontend.log 2>&1 &
```

### Step 4: Verify

1. Visit `https://edux-manager.online/register`
2. The Google Sign-In button should now work without errors

## Current Status

- ✅ CSP headers updated to allow Google scripts
- ✅ Code updated to handle missing Client ID gracefully
- ✅ `.env.local` file created on VPS (needs Client ID to be added)
- ⚠️ **Action Required**: Add your Google Client ID to `.env.local` on the VPS

## Notes

- The Google Client ID must be set in `.env.local` on the VPS
- After adding the Client ID, rebuild and restart the frontend
- Make sure authorized origins and redirect URIs are correctly configured in Google Cloud Console

