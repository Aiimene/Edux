# Manual Testing Steps

## What We've Fixed

1. **API Endpoint URL**: Changed from `/api/dashboard/students/` to `/api/members/students/`
2. **Payload**: Removed fields that backend doesn't accept (level, modules, sessions, date_of_birth, gender, parent_name)
3. **Payload sent**: Only `name`, `username`, `password`, `email`, `phone_number`, `fee_payment`
4. **TypeScript**: All errors fixed, build passes

## Step 1: Start the Backend

```bash
cd Edux_Backend
# Activate virtual environment (adjust path for your system)
source vedux/bin/activate  # Linux/Mac
# or
vedux\Scripts\activate  # Windows

# Start Django server
python manage.py runserver
```

Expected output:

```
Starting development server at http://127.0.0.1:8000/
```

## Step 2: Start the Frontend

In a new terminal:

```bash
npm run dev
```

Navigate to: `http://localhost:3000/admin/members/students`

## Step 3: Test Student Creation

1. Click "Add Student"
2. Fill in:
   - Student Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "1234567890"
   - Password: "test123456"
   - Fee Payment: "100"
3. Click Save

## Expected Behavior

The student should appear in the table immediately.

## If It Fails

Check the browser console (F12) for errors. The fix should handle:

- 400 Bad Request (validation errors)
- 500 Internal Server Error (backend error)
- Network errors

Both will now show detailed error messages.

## Debug: Check API Response

Open browser console and run:

```javascript
const token =
  localStorage.getItem("authToken") || localStorage.getItem("access_token");
fetch("http://127.0.0.1:8000/api/members/students/", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((r) => r.json())
  .then((data) => console.log(data));
```

This should show your students in the response.
