# Dashboard API Endpoints

## Base URL
```
https://edux-manager.online/api/dashboard
```

## Available Endpoints

### 1. Dashboard Overview
**Endpoint:** `GET /api/dashboard/overview/`

**Description:** Returns overview statistics including monthly profit, students, teachers, and parents counts with percentage changes.

**Query Parameters:**
- `month` (optional): Month number (1-12), defaults to current month
- `year` (optional): Year, defaults to current year

**Response:**
```json
{
  "name": "Workspace Name",
  "role": "Administrator",
  "monthly_profit": 150000.0,
  "monthly_profit_percentage": 15.5,
  "students": 250,
  "students_percentage": 10.2,
  "teachers": 15,
  "teachers_percentage": 5.0,
  "parents": 200,
  "parents_percentage": 8.3
}
```

**Example:**
```
GET /api/dashboard/overview/?month=12&year=2024
```

---

### 2. Classes Ranking
**Endpoint:** `GET /api/dashboard/classes-ranking/`

**Description:** Returns classes ranking data showing highest students per class by month.

**Query Parameters:**
- `months` (optional): Comma-separated list of month numbers (1-12), defaults to [1,2,3,4,5,6]
- `year` (optional): Year, defaults to current year

**Response:**
```json
{
  "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  "highest_students_per_class": [30, 35, 32, 38, 40, 35]
}
```

**Example:**
```
GET /api/dashboard/classes-ranking/?months=1,2,3,4,5,6&year=2024
```

---

### 3. Students Evolvement
**Endpoint:** `GET /api/dashboard/students-evolvement/`

**Description:** Returns students count per month showing student growth over time.

**Query Parameters:**
- `months` (optional): Comma-separated list of month numbers (1-12), defaults to [1,2,3,4,5,6]
- `year` (optional): Year, defaults to current year

**Response:**
```json
{
  "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  "students_per_month": [10, 15, 20, 25, 30, 35]
}
```

**Example:**
```
GET /api/dashboard/students-evolvement/?months=1,2,3,4,5,6&year=2024
```

---

### 4. Teachers Ranking
**Endpoint:** `GET /api/dashboard/teachers-ranking/`

**Description:** Returns top 5 teachers ranked by sessions and student increase percentage.

**Query Parameters:**
- `month` (optional): Month number (1-12), defaults to current month
- `year` (optional): Year, defaults to current year

**Response:**
```json
{
  "teachers": [
    {
      "name": "Teacher Name",
      "sessions": 45,
      "students_increase_percentage": 12.5
    }
  ]
}
```

**Example:**
```
GET /api/dashboard/teachers-ranking/?month=12&year=2024
```

---

### 5. Weekly Sessions
**Endpoint:** `GET /api/dashboard/weekly-sessions/`

**Description:** Returns weekly sessions overview with remaining sessions information.

**Authentication:** Required (IsAuthenticated)

**Response:**
```json
{
  "sessions": [
    {
      "module": "Arabic",
      "teacher": "Lounis",
      "students": 30,
      "date": "2024-12-12",
      "time": "11:00 AM"
    }
  ],
  "remainingSessionsCount": 15,
  "remainingSessionsHours": 32,
  "remainingSessionsDays": 4
}
```

**Example:**
```
GET /api/dashboard/weekly-sessions/
```

---

### 6. Analytics
**Endpoint:** `GET /api/dashboard/analytics/`

**Description:** Returns comprehensive analytics data with filtering options.

**Authentication:** Required (IsAuthenticated)

**Query Parameters:**
- `level` (optional): Filter by education level
- `module` (optional): Filter by module/course
- `subject` (optional): Filter by subject (same as module)
- `teacher` (optional): Filter by teacher name
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response:**
```json
{
  "revenue": {
    "value": "150,000 DZD",
    "chart": {
      "labels": ["Jan", "Feb", "Mar"],
      "datasets": [
        {
          "label": "Revenue",
          "data": [100000, 120000, 150000],
          "borderColor": "#3B82F6"
        }
      ]
    }
  },
  "summaryCards": [
    {
      "icon": "sessions",
      "label": "Total Sessions",
      "value": "150"
    }
  ],
  "smallCharts": [
    {
      "icon": "attendance",
      "label": "Attendance Rate",
      "value": "85%",
      "chart": { ... }
    }
  ],
  "sessionsTable": [
    {
      "sessionId": "123",
      "teacher": "Teacher Name",
      "counts": "30/35",
      "attendanceRate": "85%",
      "revenue": "5,000 DZD",
      "date": "2024-12-12"
    }
  ]
}
```

**Example:**
```
GET /api/dashboard/analytics/?level=Primary&startDate=2024-01-01&endDate=2024-12-31
```

---

## Authentication

- **Overview, Classes Ranking, Students Evolvement, Teachers Ranking:** No authentication required (but workspace is determined from user context)
- **Weekly Sessions, Analytics:** Authentication required (IsAuthenticated)

## Error Responses

All endpoints may return:
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Workspace not found
- `500 Internal Server Error`: Server error

## Notes

1. All endpoints that require workspace will get it from the authenticated user's profile (admin, teacher, parent, or student)
2. Date parameters should be in YYYY-MM-DD format
3. Month numbers are 1-12 (January = 1, December = 12)
4. Percentage changes are calculated compared to the previous month
5. Teachers ranking returns top 5 teachers only

