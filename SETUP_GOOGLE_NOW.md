# 🚀 Set Up Google Authentication NOW

## Current Status
✅ VPS is ready for Google Client ID
❌ Waiting for your Google Client ID

## ⚡ Quick Setup (5 minutes)

### Step 1: Get Your Google Client ID

**Click this link to go directly to create credentials:**
👉 [Create OAuth Client ID](https://console.cloud.google.com/apis/credentials)

**Follow these steps:**

1. **If you don't have a project:**
   - Click "Select a project" → "New Project"
   - Name: `Edux Platform`
   - Click "Create"

2. **Configure OAuth Consent Screen (if prompted):**
   - User Type: **External**
   - App name: `Edux Platform`
   - Your email (for support and developer contact)
   - Click through the steps (Save and Continue)
   - Click "Back to Dashboard"

3. **Create OAuth Client ID:**
   - Click **"+ CREATE CREDENTIALS"**
   - Select **"OAuth client ID"**
   - Application type: **Web application**
   - Name: `Edux Web Client`
   
   **Add these Authorized JavaScript origins:**
   - `https://edux-manager.online`
   - `https://www.edux-manager.online`
   
   **Add these Authorized redirect URIs:**
   - `https://edux-manager.online/login`
   - `https://edux-manager.online/register`
   
   - Click **"Create"**
   - **COPY THE CLIENT ID** (looks like: `123456789-abc.apps.googleusercontent.com`)

### Step 2: Give Me Your Client ID

Once you have your Client ID, just tell me:
```
My Google Client ID is: 123456789-abc.apps.googleusercontent.com
```

I'll configure it on the VPS immediately!

### Step 3: Done! 🎉

After I configure it, Google Sign-In will work automatically!

---

## Alternative: Configure It Yourself

If you prefer to do it yourself, run:

```bash
./setup-google-signin.sh YOUR_CLIENT_ID_HERE
```

Or manually:

```bash
ssh root@213.130.144.96
cd /home/edux-manager/htdocs/edux-manager.online/frontend
nano .env.local
# Add: NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
# Save (Ctrl+X, Y, Enter)
npm run build
pkill -f "next-server"
PORT=3000 nohup npm start > /tmp/frontend.log 2>&1 &
```

---

## What's Already Done ✅

- ✅ CSP headers configured for Google scripts
- ✅ Code updated to handle Google OAuth
- ✅ `.env.local` file created on VPS (ready for your Client ID)
- ✅ Setup script ready to use

## What You Need to Do

1. Get your Google Client ID (5 minutes)
2. Share it with me, and I'll configure it!

That's it! 🚀

