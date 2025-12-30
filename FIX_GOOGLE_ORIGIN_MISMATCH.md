# Fix Google OAuth Origin Mismatch Error

## Problem
Error: `origin_mismatch` - The authorized JavaScript origins in Google Cloud Console don't match your domain.

## Solution: Update Google Cloud Console

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID: `849433739468-b6553cj0pgutpmqofh9qj00hrdho0hqs`
3. Click on the **pencil icon** (Edit) next to it

### Step 2: Add Authorized JavaScript Origins

In the **"Authorized JavaScript origins"** section, make sure you have these EXACT URLs:

```
https://edux-manager.online
https://www.edux-manager.online
```

**Important:**
- Must start with `https://` (not `http://`)
- No trailing slash
- Must match exactly

Click **"+ ADD URI"** for each if they're not already there.

### Step 3: Verify Authorized Redirect URIs

In the **"Authorized redirect URIs"** section, make sure you have:

```
https://edux-manager.online/login
https://edux-manager.online/register
```

### Step 4: Save Changes

1. Click **"SAVE"** at the bottom
2. Wait a few seconds for changes to propagate

### Step 5: Test Again

1. Clear your browser cache or use incognito mode
2. Visit: https://edux-manager.online/register
3. Try Google Sign-In again

## Quick Fix Checklist

- [ ] Added `https://edux-manager.online` to Authorized JavaScript origins
- [ ] Added `https://www.edux-manager.online` to Authorized JavaScript origins
- [ ] Added `https://edux-manager.online/login` to Authorized redirect URIs
- [ ] Added `https://edux-manager.online/register` to Authorized redirect URIs
- [ ] Clicked SAVE
- [ ] Waited a few seconds
- [ ] Cleared browser cache
- [ ] Tested again

## Common Mistakes to Avoid

❌ **Wrong:**
- `http://edux-manager.online` (must be https)
- `https://edux-manager.online/` (no trailing slash)
- `edux-manager.online` (missing https://)
- `https://213.130.144.96` (must use domain, not IP)

✅ **Correct:**
- `https://edux-manager.online`
- `https://www.edux-manager.online`

## Direct Link to Edit Your Client ID

If you're logged into Google Cloud Console, you can go directly to:
https://console.cloud.google.com/apis/credentials

Then click on your OAuth client ID to edit it.

## Still Having Issues?

If the error persists after adding the origins:
1. Make sure you saved the changes
2. Wait 5-10 minutes for Google's servers to update
3. Clear browser cache completely
4. Try in incognito/private browsing mode
5. Check browser console for any other errors

