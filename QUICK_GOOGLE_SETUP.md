# Quick Google Sign-In Setup

## Option 1: Automated Script (Easiest)

I've created a script that will configure everything for you. You just need your Google Client ID.

### Step 1: Get Your Google Client ID

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. If prompted, configure OAuth consent screen first
4. Select **"Web application"**
5. Add these **Authorized JavaScript origins**:
   - `https://edux-manager.online`
   - `https://www.edux-manager.online`
6. Add these **Authorized redirect URIs**:
   - `https://edux-manager.online/login`
   - `https://edux-manager.online/register`
7. Click **"Create"** and copy the **Client ID**

### Step 2: Run the Setup Script

```bash
./setup-google-signin.sh YOUR_CLIENT_ID_HERE
```

Example:
```bash
./setup-google-signin.sh 123456789-abcdefghijklmnop.apps.googleusercontent.com
```

The script will:
- ✅ Update `.env.local` on the VPS
- ✅ Rebuild the frontend
- ✅ Restart the frontend server

## Option 2: Manual Setup

If you prefer to do it manually:

### 1. SSH into VPS
```bash
ssh root@213.130.144.96
```

### 2. Edit .env.local
```bash
cd /home/edux-manager/htdocs/edux-manager.online/frontend
nano .env.local
```

### 3. Add/Update Client ID
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 4. Save and Rebuild
```bash
# Save file (Ctrl+X, Y, Enter)
npm run build
pkill -f "next-server"
PORT=3000 nohup npm start > /tmp/frontend.log 2>&1 &
```

## Option 3: One-Line Command

Replace `YOUR_CLIENT_ID` with your actual Client ID:

```bash
sshpass -p 'Fateh.VPS.edux.123456789.typeshi' ssh -o StrictHostKeyChecking=no root@213.130.144.96 'cd /home/edux-manager/htdocs/edux-manager.online/frontend && sed -i "s|NEXT_PUBLIC_GOOGLE_CLIENT_ID=.*|NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID|g" .env.local && echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID" >> .env.local && npm run build && pkill -f "next-server" && sleep 2 && PORT=3000 nohup npm start > /tmp/frontend.log 2>&1 &'
```

## Verify It Works

1. Visit: https://edux-manager.online/register
2. You should see the Google Sign-In button
3. Click it - it should work without errors

## Need Help?

If you don't have a Google Client ID yet, follow the detailed guide in `GOOGLE_SIGNIN_SETUP_GUIDE.md`

