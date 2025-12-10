# Settings Page API Documentation

This document outlines the API endpoints and data structures required for the Settings page functionality.

## Table of Contents

1. [General Settings](#general-settings)
2. [User & Role Management](#user--role-management)
3. [Billing](#billing)
4. [Security](#security)
5. [Support](#support)

---

## General Settings

### Get General Settings

**Endpoint:** `GET /api/settings/general`

**Description:** Retrieves the current general settings including school information and interface preferences.

**Response:**
```json
{
  "schoolData": {
    "schoolName": "string",
    "schoolEmail": "string",
    "address": "string",
    "timezone": "string", // e.g., "UTC", "America/New_York", "Europe/London", "Asia/Dubai", "Africa/Algiers"
    "language": "string", // e.g., "English", "Arabic", "French", "Spanish"
    "logo": "string | null" // Base64 encoded image or URL
  },
  "interfaceData": {
    "darkMode": boolean,
    "accentColor": "string", // "Default", "Blue", "Green", "Purple", "Orange"
    "sidebarLayout": "string" // "Default", "Compact", "Expanded"
  }
}
```

### Update General Settings

**Endpoint:** `POST /api/settings/general`

**Description:** Updates general settings including school information and interface preferences.

**Request Body:**
```json
{
  "schoolData": {
    "schoolName": "string", // Required
    "schoolEmail": "string", // Required, must be valid email format
    "address": "string", // Required
    "timezone": "string",
    "language": "string",
    "logo": "string | null" // Base64 encoded image string
  },
  "interfaceData": {
    "darkMode": boolean,
    "accentColor": "string",
    "sidebarLayout": "string"
  }
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Validation Rules:**
- `schoolName`: Required, non-empty string
- `schoolEmail`: Required, valid email format
- `address`: Required, non-empty string
- `logo`: If provided, must be base64 encoded image (JPG, PNG, or SVG), max 2MB

---

## User & Role Management

### Get Users and Roles

**Endpoint:** `GET /api/settings/user-role`

**Description:** Retrieves all users and roles with their permissions.

**Response:**
```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string", // Role name (e.g., "Admin", "Teacher")
      "status": "Active" | "Inactive"
    }
  ],
  "roles": [
    {
      "id": "string",
      "name": "string",
      "permissions": [
        {
          "id": "string",
          "name": "string",
          "checked": boolean
        }
      ]
    }
  ]
}
```

### Update Users and Roles

**Endpoint:** `POST /api/settings/user-role`

**Description:** Updates users and roles. This endpoint should handle both user and role updates in a single request.

**Request Body:**
```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "status": "Active" | "Inactive"
    }
  ],
  "roles": [
    {
      "id": "string",
      "name": "string",
      "permissions": [
        {
          "id": "string",
          "name": "string",
          "checked": boolean
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

### Create User

**Endpoint:** `POST /api/settings/users`

**Description:** Creates a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "string",
  "status": "Active" | "Inactive"
}
```

**Response:**
```json
{
  "success": boolean,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "status": "Active" | "Inactive"
  }
}
```

### Update User

**Endpoint:** `PUT /api/settings/users/:id`

**Description:** Updates an existing user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "string",
  "status": "Active" | "Inactive"
}
```

**Response:**
```json
{
  "success": boolean,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "status": "Active" | "Inactive"
  }
}
```

### Delete User

**Endpoint:** `DELETE /api/settings/users/:id`

**Description:** Deletes a user.

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

### Create Role

**Endpoint:** `POST /api/settings/roles`

**Description:** Creates a new role.

**Request Body:**
```json
{
  "name": "string",
  "permissions": [
    {
      "id": "string",
      "name": "string",
      "checked": boolean
    }
  ]
}
```

**Response:**
```json
{
  "success": boolean,
  "role": {
    "id": "string",
    "name": "string",
    "permissions": [
      {
        "id": "string",
        "name": "string",
        "checked": boolean
      }
    ]
  }
}
```

### Update Role

**Endpoint:** `PUT /api/settings/roles/:id`

**Description:** Updates an existing role.

**Request Body:**
```json
{
  "name": "string",
  "permissions": [
    {
      "id": "string",
      "name": "string",
      "checked": boolean
    }
  ]
}
```

**Response:**
```json
{
  "success": boolean,
  "role": {
    "id": "string",
    "name": "string",
    "permissions": [
      {
        "id": "string",
        "name": "string",
        "checked": boolean
      }
    ]
  }
}
```

### Delete Role

**Endpoint:** `DELETE /api/settings/roles/:id`

**Description:** Deletes a role.

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

---

## Billing

### Get Plan Information

**Endpoint:** `GET /api/settings/billing/plan`

**Description:** Retrieves the current subscription plan information.

**Response:**
```json
{
  "planName": "string", // e.g., "Professional Plan"
  "status": "Active" | "Inactive" | "Expired",
  "price": "string", // e.g., "299$"
  "period": "string", // e.g., "Per month"
  "features": [
    "string" // e.g., "Unlimited number of teachers"
  ],
  "nextPaymentDue": "string", // ISO date string or formatted date
  "paymentMethod": "string" // e.g., "Bank", "Credit Card", "Manual"
}
```

### Get Payment History

**Endpoint:** `GET /api/settings/billing/payments`

**Description:** Retrieves payment history with pagination support.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "payments": [
    {
      "id": "string",
      "paymentId": "string", // e.g., "PAY-XYZ-ABC"
      "date": "string", // Formatted date string (e.g., "1 December 2025")
      "method": "string", // e.g., "Bank Transfer", "Credit Card"
      "status": "Approved" | "Pending" | "Failed",
      "amount": "string" // e.g., "299$"
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "hasMore": boolean
  }
}
```

### Submit New Payment

**Endpoint:** `POST /api/settings/billing/payments`

**Description:** Submits a new payment with proof of payment file.

**Request Body:** (multipart/form-data)
```
method: string // e.g., "Bank", "Credit Card", "PayPal", "Other"
date: string // ISO date string (YYYY-MM-DD)
proof: File // Image file (JPG, PNG, or PDF), max 5MB
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "payment": {
    "id": "string",
    "paymentId": "string",
    "date": "string",
    "method": "string",
    "status": "Pending",
    "amount": "string"
  }
}
```

**Validation Rules:**
- `method`: Required
- `date`: Required, valid date
- `proof`: Required, file must be JPG, PNG, or PDF, max size 5MB

---

## Security

### Change Password

**Endpoint:** `POST /api/settings/security/password`

**Description:** Changes the user's password.

**Request Body:**
```json
{
  "currentPassword": "string", // Required
  "newPassword": "string", // Required, minimum 8 characters
  "confirmPassword": "string" // Required, must match newPassword
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Validation Rules:**
- `currentPassword`: Required, must match current password
- `newPassword`: Required, minimum 8 characters
- `confirmPassword`: Required, must match `newPassword`

### Update Session Timeout

**Endpoint:** `POST /api/settings/security/session-timeout`

**Description:** Updates the session timeout setting.

**Request Body:**
```json
{
  "timeout": "string" // e.g., "15 minutes", "30 minutes", "1 hour", "2 hours", "Never"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

### Get Login Activity

**Endpoint:** `GET /api/settings/security/login-activity`

**Description:** Retrieves login activity and active sessions.

**Response:**
```json
{
  "sessions": [
    {
      "id": "string",
      "device": "string", // e.g., "Windows PC-Himda"
      "ip": "string", // e.g., "127.0.0.0"
      "date": "string", // Formatted date string
      "isCurrent": boolean, // true for current session
      "status": "Active" | "Inactive"
    }
  ]
}
```

### Revoke Session

**Endpoint:** `DELETE /api/settings/security/sessions/:id`

**Description:** Revokes/terminates a specific session.

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

### Forgot Password

**Endpoint:** `POST /api/settings/security/forgot-password`

**Description:** Initiates password reset flow.

**Request Body:**
```json
{
  "email": "string" // User's email address
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

---

## Support

### Submit Support Message

**Endpoint:** `POST /api/settings/support/message`

**Description:** Submits a support message to the support team.

**Request Body:**
```json
{
  "message": "string" // Required, non-empty message
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "ticketId": "string" // Optional: if a ticket is created
}
```

**Validation Rules:**
- `message`: Required, non-empty string

---

## Error Responses

All endpoints should return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "string",
  "details": {} // Optional: validation error details
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Forbidden"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Authentication

All API endpoints require authentication. Include the authentication token in the request headers:

```
Authorization: Bearer <token>
```

---

## Notes

1. **File Uploads**: For logo uploads and payment proof, use `multipart/form-data` content type.

2. **Date Formats**: 
   - Use ISO 8601 format (YYYY-MM-DD) for API requests
   - Display dates in a user-friendly format (e.g., "1 December 2025")

3. **Image Handling**:
   - Logo: Accept base64 encoded strings or file uploads (JPG, PNG, SVG), max 2MB
   - Payment Proof: Accept file uploads (JPG, PNG, PDF), max 5MB

4. **Pagination**: For endpoints that return lists (e.g., payment history), implement pagination with `page` and `limit` query parameters.

5. **Real-time Updates**: Consider implementing WebSocket connections or polling for real-time updates to session activity and payment status changes.

6. **Rate Limiting**: Implement rate limiting for sensitive operations like password changes and support message submissions.

