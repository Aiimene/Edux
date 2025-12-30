# Google Authentication Setup - Step by Step

## Current Status
❌ Google Sign-In is not configured (missing Client ID)

## What You Need to Do

### Step 1: Create Google OAuth Client ID (5 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it: `Edux Platform`
   - Click "Create"

3. **Configure OAuth Consent Screen**
   - Go to: **APIs & Services** > **OAuth consent screen**
   - User Type: Select **External** (unless you have Google Workspace)
   - Click "Create"
   - Fill in:
     - App name: `Edux Platform`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Click "Save and Continue" (default is fine)
   - Test users: Click "Save and Continue" (skip for now)
   - Summary: Click "Back to Dashboard"

4. **Create OAuth 2.0 Client ID**
   - Go to: **APIs & Services** > **Credentials**
   - Click **"+ CREATE CREDENTIALS"** at the top
   - Select **"OAuth client ID"**
   - Application type: **Web application**
   - Name: `Edux Web Client`
   
   **Authorized JavaScript origins** (click "+ ADD URI" for each):
   ```
   https://edux-manager.online
   https://www.edux-manager.online
   ```
   
   **Authorized redirect URIs** (click "+ ADD URI" for each):
   ```
   https://edux-manager.online/login
   https://edux-manager.online/register
   ```
   
   - Click **"Create"**
   - **IMPORTANT**: Copy the **Client ID** (it looks like: `123456789-abc.apps.googleusercontent.com`)
   - Keep this window open or save the Client ID somewhere safe

### Step 2: Add Client ID to VPS

Once you have your Client ID, I can configure it for you automatically. Just provide me with:
- Your Google Client ID (the one you just copied)

Or you can run this command (replace YOUR_CLIENT_ID):

```bash
./setup-google-signin.sh YOUR_CLIENT_ID
```

## Quick Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Create OAuth Client ID](https://console.cloud.google.com/apis/credentials)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)

## What Happens After Setup

Once configured:
- ✅ Google Sign-In button will work on login page
- ✅ Google Sign-In button will work on register page
- ✅ Users can sign in/up with their Google accounts
- ✅ No more "Google Sign-In is not configured" message

## Need Help?

If you get stuck at any step, let me know and I'll help you through it!

