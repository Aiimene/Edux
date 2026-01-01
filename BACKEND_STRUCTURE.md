# EduX Manager Backend Structure

## Location
`/home/edux-manager/htdocs/edux-manager.online/backend`

## Overview
Django REST Framework backend for EduX Manager school management system. This is a multi-workspace (multi-tenant) application where each school has its own workspace.

---

## Project Structure

```
backend/
├── config/              # Django project settings
│   ├── settings.py      # Main configuration
│   ├── urls.py          # Root URL routing
│   ├── wsgi.py          # WSGI config
│   └── asgi.py          # ASGI config
├── apps/                # Application modules
│   ├── authentication/  # User auth & workspace management
│   ├── dashboard/       # Dashboard & analytics
│   ├── members/         # Students, Teachers, Parents
│   ├── academic/        # Courses, Sessions, Attendance
│   └── settings/        # Workspace settings & billing
├── manage.py
├── requirements.txt
├── .env                 # Environment variables
└── Dockerfile
```

---

## Configuration (config/)

### settings.py
- **Django Version**: 4.2+ (supports up to 5.2)
- **Database**: PostgreSQL (via `psycopg2-binary`)
- **Authentication**: 
  - JWT tokens (djangorestframework-simplejwt)
  - Cookie-based authentication (custom)
  - Google OAuth (django-allauth)
- **CORS**: django-cors-headers
- **Custom User Model**: `apps.authentication.User`
- **Custom Auth Backend**: `apps.authentication.backends.WorkspaceAuthenticationBackend`

### Key Settings
- **AUTH_USER_MODEL**: `authentication.User`
- **AUTHENTICATION_BACKENDS**: Custom workspace-aware authentication
- **REST_FRAMEWORK**: CookieJWTAuthentication as default
- **SIMPLE_JWT**: Configured with HTTP-only cookies
- **CORS**: Configured for frontend domain

### URLs (config/urls.py)
```
/                          # API root (info endpoint)
/admin/                    # Django admin
/api/auth/                 # Authentication endpoints
/api/dashboard/            # Dashboard endpoints
/api/members/              # Members management
/api/academic/             # Academic data
/api/settings/             # Settings & billing
```

---

## Apps

### 1. Authentication (`apps/authentication/`)

**Purpose**: User authentication, workspace management, admin registration

**Models**:
- `User` (AbstractUser): Custom user model with workspace-scoped username/email
- `Admin`: School administrator profile
- `Workspace`: School workspace (multi-tenant isolation)

**Key Features**:
- Multi-workspace support (username/email not globally unique)
- Workspace-scoped authentication
- Admin registration creates workspace automatically
- Google OAuth integration
- Password reset functionality

**Endpoints** (`apps/authentication/urls.py`):
- `POST /api/auth/register/` - Admin registration
- `POST /api/auth/login/` - Unified login (all user types)
- `POST /api/auth/logout/` - Logout (blacklist token)
- `POST /api/auth/logout-all/` - Logout from all devices
- `POST /api/auth/verify/` - Verify token
- `POST /api/auth/token/` - Get JWT token pair
- `POST /api/auth/token/refresh/` - Refresh token
- `POST /api/auth/token/verify/` - Verify token
- `POST /api/auth/google/login/` - Google OAuth login
- `POST /api/auth/google/register/complete/` - Complete Google registration
- `GET /api/auth/me/` - Get user profile
- `POST /api/auth/password-reset/request/` - Request password reset
- `POST /api/auth/password-reset/validate-token/` - Validate reset token
- `POST /api/auth/password-reset/confirm/` - Confirm password reset

**Custom Authentication Backend**:
- `WorkspaceAuthenticationBackend`: Authenticates users by workspace + identifier + password
- Supports username or email as identifier
- Workspace isolation enforced

---

### 2. Dashboard (`apps/dashboard/`)

**Purpose**: Dashboard overview and analytics

**Endpoints** (`apps/dashboard/urls.py`):
- `GET /api/dashboard/overview/` - Monthly overview (profit, students, teachers, parents)
- `GET /api/dashboard/classes-ranking/` - Class rankings by student count
- `GET /api/dashboard/students-evolvement/` - Student enrollment trends
- `GET /api/dashboard/teachers-ranking/` - Teacher rankings by sessions/students
- `GET /api/dashboard/weekly-sessions/` - Weekly sessions overview
- `GET /api/dashboard/analytics/` - Comprehensive analytics with filters

**Services**:
- `DashboardService`: Weekly sessions computation
- `AnalyticsService`: Analytics data computation with filtering

**Features**:
- Real-time data from database
- Month/year filtering
- Percentage change calculations
- Revenue charts with previous period comparison

---

### 3. Members (`apps/members/`)

**Purpose**: Student, Teacher, Parent management

**Models**:
- `Teacher`: Teacher profile linked to User and Workspace
- `Parent`: Parent profile linked to User and Workspace
- `Student`: Student profile linked to User, Workspace, and optional Parent

**Endpoints** (`apps/members/urls.py`):
- `GET /api/members/teachers/` - List teachers
- `POST /api/members/teachers/` - Create teacher
- `GET /api/members/teachers/{id}/` - Get teacher
- `PUT/PATCH /api/members/teachers/{id}/` - Update teacher
- `DELETE /api/members/teachers/{id}/` - Delete teacher
- Similar endpoints for `students` and `parents`

**Features**:
- Workspace-scoped members
- Unique username per workspace
- CRUD operations via ViewSets

---

### 4. Academic (`apps/academic/`)

**Purpose**: Academic data management (levels, courses, sessions, attendance)

**Models**:
- `Level`: Education level (e.g., Grade 1, Grade 2)
- `Course`: Course/Subject/Module at a specific level
- `Session`: Scheduled session for a course
- `SessionStudent`: Student enrollment in a session
- `Attendance`: Student attendance record (only tracks attended sessions)
- `Income`: Monthly financial summary per workspace

**Endpoints** (`apps/academic/urls.py`):
- `GET /api/academic/levels/` - List levels
- `POST /api/academic/levels/` - Create level
- Similar CRUD for `modules` (courses), `sessions`, `announcements`, `attendances`
- `GET /api/academic/timetable/` - Get timetable

**Features**:
- Session scheduling with day of week and time
- Student enrollment tracking
- Attendance tracking with financial data (session_price)
- Revenue calculation from attendance records

---

### 5. Settings (`apps/settings/`)

**Purpose**: Workspace settings, billing, and subscription management

**Models**:
- `WorkspaceSettings`: General workspace settings (timezone, language, logo, UI preferences)
- `SubscriptionPlan`: Subscription plan details
- `Payment`: Payment records

**Endpoints** (`apps/settings/urls.py`):
- `GET /api/settings/general/` - Get general settings
- `PUT/PATCH /api/settings/general/` - Update general settings
- `GET /api/settings/users/` - List workspace users
- `POST /api/settings/users/` - Create user
- `GET /api/settings/users/{id}/` - Get user
- `PUT/PATCH /api/settings/users/{id}/` - Update user
- `DELETE /api/settings/users/{id}/` - Delete user
- `GET /api/settings/billing/plan/` - Get subscription plan
- `GET /api/settings/billing/payments/` - List payments

---

## Authentication Flow

### Registration
1. Admin registers via `POST /api/auth/register/`
2. Creates User, Admin, and Workspace
3. Workspace name is slugified from display_name
4. Returns workspace name for login

### Login
1. User sends `school_name`, `identifier` (username/email), `password`
2. `WorkspaceAuthenticationBackend` authenticates
3. Returns JWT tokens in HTTP-only cookies + response body
4. Returns user role (admin/teacher/parent/student) and profile data

### Token Management
- Access tokens: 15 minutes lifetime
- Refresh tokens: 30 days lifetime
- Tokens stored in HTTP-only cookies
- Token blacklisting on logout
- Token rotation on refresh

---

## Database Schema

### Core Models
- `auth_user`: Users (workspace-scoped)
- `admin`: Admin profiles
- `workspace`: School workspaces (multi-tenant isolation)
- `teacher`: Teacher profiles
- `parent`: Parent profiles
- `student`: Student profiles
- `level`: Education levels
- `course`: Courses/Subjects
- `session`: Scheduled sessions
- `session_student`: Student enrollments
- `attendance`: Attendance records (with financial data)
- `income`: Monthly income summaries
- `workspace_settings`: Workspace preferences
- `subscription_plan`: Subscription details
- `payment`: Payment records

### Key Relationships
- Workspace → Admin (One-to-Many)
- Workspace → Teachers/Students/Parents (One-to-Many)
- Session → Course → Level (Foreign Keys)
- Session → Teacher (Foreign Key)
- SessionStudent → Session + Student (Many-to-Many via junction table)
- Attendance → Session + Student + Workspace (Foreign Keys)

---

## Key Features

1. **Multi-Workspace (Multi-Tenant)**:
   - Each school has isolated workspace
   - Username/email not globally unique
   - Authentication scoped to workspace

2. **Role-Based Access**:
   - Admin: Full access to workspace
   - Teacher: Access to assigned sessions
   - Parent: Access to children's data
   - Student: Limited access

3. **Financial Tracking**:
   - Session pricing per course
   - Attendance-based revenue calculation
   - Student total_owed and total_paid tracking
   - Monthly income summaries

4. **Analytics**:
   - Dashboard overview with percentage changes
   - Class rankings
   - Teacher rankings
   - Student enrollment trends
   - Revenue analytics with charts
   - Filterable analytics (by level, module, teacher, date range)

5. **Google OAuth**:
   - Social login via Google
   - Integrated with django-allauth

---

## Environment Variables (.env)

Key variables (from settings.py):
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (bool)
- `ALLOWED_HOSTS`: Allowed hostnames
- `CORS_ALLOWED_ORIGINS`: Frontend origins
- `CSRF_TRUSTED_ORIGINS`: CSRF trusted origins
- `FRONTEND_URL`: Frontend URL
- `DATABASE_URL`: PostgreSQL connection string
- `OAUTH_CLIENT_ID`: Google OAuth client ID
- `OAUTH_CLIENT_SECRET`: Google OAuth secret
- `EMAIL_*`: Email configuration

---

## Dependencies (requirements.txt)

### Core
- Django >= 4.2, < 5.2
- djangorestframework >= 3.14
- psycopg2-binary >= 2.9 (PostgreSQL)
- django-environ >= 0.11

### Authentication
- djangorestframework-simplejwt >= 5.3
- dj-rest-auth[with_social] >= 6.0
- django-allauth >= 0.63

### CORS
- django-cors-headers >= 4.0

### Production
- gunicorn >= 21.0

### Optional
- Pillow >= 10.0 (image handling)
- google-auth, google-auth-oauthlib, google-auth-httplib2 (Google OAuth)

---

## API Authentication

**Default**: Cookie-based JWT authentication
- Tokens sent in HTTP-only cookies
- `Authorization: Bearer <token>` header also supported
- Tokens automatically included via Axios interceptors

**Custom Authentication Class**: `apps.authentication.cookie_authentication.CookieJWTAuthentication`

---

## Current Deployment

- **Server**: VPS at `213.130.144.96`
- **Process**: Gunicorn (3 workers, port 8000)
- **Command**: `gunicorn --bind 0.0.0.0:8000 --workers 3 --timeout 120 config.wsgi:application`
- **Location**: `/home/edux-manager/htdocs/edux-manager.online/backend`

---

## Notes

1. **Workspace Isolation**: All data is scoped to workspace, ensuring multi-tenant security
2. **Username Uniqueness**: Usernames are unique per workspace, not globally
3. **Attendance Model**: Only tracks attended sessions (not absences)
4. **Revenue Calculation**: Based on attendance records (session_price)
5. **Session Scheduling**: Uses day_of_week (0=Monday, 6=Sunday) and time fields
6. **Financial Tracking**: Students have total_owed and total_paid for billing

