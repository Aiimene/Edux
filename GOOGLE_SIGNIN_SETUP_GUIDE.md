# Complete Google Sign-In Configuration Guide

## Step-by-Step Instructions

### Step 1: Create Google Cloud Project (if you don't have one)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `Edux Platform` (or any name you prefer)
5. Click **"Create"**

### Step 2: Enable Google+ API

1. In your project, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"** or **"Google Identity Services"**
3. Click on it and click **"Enable"**

### Step 3: Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. If prompted, configure the OAuth consent screen first:
   - User Type: **External** (unless you have a Google Workspace)
   - App name: `Edux Platform`
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"** through the steps
   - Click **"Back to Dashboard"**

5. Now create the OAuth client ID:
   - Application type: **Web application**
   - Name: `Edux Web Client`
   - **Authorized JavaScript origins** (click "+ ADD URI"):
     ```
     https://edux-manager.online
     https://www.edux-manager.online
     ```
   - **Authorized redirect URIs** (click "+ ADD URI"):
     ```
     https://edux-manager.online/login
     https://edux-manager.online/register
     ```
   - Click **"Create"**

6. **Copy the Client ID** - it looks like:
   ```
   123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   ```

### Step 4: Add Client ID to VPS

**Option A: Using SSH (Recommended)**

```bash
# SSH into your VPS
ssh root@213.130.144.96

# Navigate to frontend directory
cd /home/edux-manager/htdocs/edux-manager.online/frontend

# Edit the .env.local file
nano .env.local
```

Add or update the line:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Save and exit:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

**Option B: Using Command Line (One-liner)**

Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID:

```bash
sshpass -p 'Fateh.VPS.edux.123456789.typeshi' ssh -o StrictHostKeyChecking=no root@213.130.144.96 'cd /home/edux-manager/htdocs/edux-manager.online/frontend && sed -i "s|NEXT_PUBLIC_GOOGLE_CLIENT_ID=.*|NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE|g" .env.local && cat .env.local'
```

### Step 5: Rebuild and Restart Frontend

```bash
# SSH into VPS
ssh root@213.130.144.96

# Navigate to frontend
cd /home/edux-manager/htdocs/edux-manager.online/frontend

# Rebuild the application (this reads the new .env.local)
npm run build

# Stop the current frontend
pkill -f "next-server"

# Start the frontend
PORT=3000 nohup npm start > /tmp/frontend.log 2>&1 &

# Verify it's running
sleep 3
ps aux | grep next-server | grep -v grep
```

### Step 6: Verify Configuration

1. Visit `https://edux-manager.online/register`
2. You should see the Google Sign-In button
3. Click it - it should open Google's sign-in popup
4. After signing in, you should be redirected back to your app

### Troubleshooting

**If you see "Missing required parameter: client_id":**
- Check that `.env.local` has the correct Client ID
- Make sure you rebuilt the app after adding the Client ID
- Restart the frontend server

**If you see "redirect_uri_mismatch":**
- Go back to Google Cloud Console
- Check that your redirect URIs exactly match:
  - `https://edux-manager.online/login`
  - `https://edux-manager.online/register`

**If the button doesn't appear:**
- Check browser console for errors
- Verify CSP headers allow Google scripts (already configured)
- Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly

### Quick Reference

**File Location on VPS:**
```
/home/edux-manager/htdocs/edux-manager.online/frontend/.env.local
```

**Required Environment Variable:**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Google Cloud Console:**
- [Credentials](https://console.cloud.google.com/apis/credentials)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)

### Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Keep your Client ID secret
- Only add trusted domains to authorized origins
- Regularly review OAuth consent screen settings

