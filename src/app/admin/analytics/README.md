# Analytics Page API Integration

## API Endpoint

**Endpoint:** `GET /api/analytics`

## Query Parameters

All query parameters are optional. Default values should be "All" for filter options.

| Parameter | Type | Description | Example Values |
|-----------|------|-------------|----------------|
| `level` | string | Filter by education level | `"Elementary"`, `"Middle School"`, `"High School"` |
| `module` | string | Filter by module | `"Module 1"`, `"Module 2"`, `"Module 3"`, `"Module 4"`, `"Module 5"` |
| `subject` | string | Filter by subject | `"Mathematics"`, `"Science"`, `"English"`, `"Arabic"` |
| `teacher` | string | Filter by teacher name | `"Hmida Teacher"`, `"Ahmed Teacher"`, `"Sara Teacher"`, etc. |
| `startDate` | string (ISO 8601) | Start date for date range filter | `"2024-12-15"` |
| `endDate` | string (ISO 8601) | End date for date range filter | `"2024-12-21"` |

## Example Request

```
GET /api/analytics?level=Elementary&module=Module%201&subject=Mathematics&teacher=Hmida%20Teacher&startDate=2024-12-15&endDate=2024-12-21
```

## Expected Response Structure

```json
{
  "revenue": {
    "value": "10,000 DZD",
    "chart": {
      "labels": ["#1", "#2", "#3", "#4", "#5", "#6", "#7", "#8"],
      "datasets": [
        {
          "label": "Revenue 1",
          "data": [2, 4, 6, 8, 6, 4, 8, 10],
          "borderColor": "#222"
        },
        {
          "label": "Revenue 2",
          "data": [1, 3, 5, 7, 5, 7, 9, 8],
          "borderColor": "#7AB2F9",
          "borderDash": [8, 4]
        }
      ]
    }
  },
  "summaryCards": [
    {
      "icon": "sessions",
      "label": "Total Sessions",
      "value": "100"
    },
    {
      "icon": "teachers",
      "label": "Working Teachers",
      "value": "100"
    },
    {
      "icon": "students",
      "label": "Students",
      "value": "100"
    }
  ],
  "smallCharts": [
    {
      "icon": "sessions",
      "label": "Sessions",
      "value": "100",
      "chart": {
        "labels": ["#1", "#2", "#3", "#4", "#5"],
        "datasets": [
          {
            "label": "Sessions 1",
            "data": [2, 4, 6, 4, 8],
            "borderColor": "#222"
          },
          {
            "label": "Sessions 2",
            "data": [1, 3, 5, 7, 6],
            "borderColor": "#7AB2F9",
            "borderDash": [8, 4]
          }
        ]
      }
    },
    {
      "icon": "attendance",
      "label": "Attendance",
      "value": "100",
      "chart": {
        "labels": ["#1", "#2", "#3", "#4", "#5"],
        "datasets": [
          {
            "label": "Attendance 1",
            "data": [3, 5, 7, 5, 9],
            "borderColor": "#222"
          },
          {
            "label": "Attendance 2",
            "data": [2, 4, 6, 8, 7],
            "borderColor": "#7AB2F9",
            "borderDash": [8, 4]
          }
        ]
      }
    },
    {
      "icon": "rate",
      "label": "Rate",
      "value": "100",
      "chart": {
        "labels": ["#1", "#2", "#3", "#4", "#5"],
        "datasets": [
          {
            "label": "Rate 1",
            "data": [4, 6, 8, 6, 10],
            "borderColor": "#222"
          },
          {
            "label": "Rate 2",
            "data": [3, 5, 7, 9, 8],
            "borderColor": "#7AB2F9",
            "borderDash": [8, 4]
          }
        ]
      }
    }
  ],
  "sessionsTable": {
    "columns": ["Session ID", "Teacher", "Counts", "Attendance Rate", "Revenue"],
    "rows": [
      {
        "sessionId": "12",
        "teacher": "Hmida Teacher",
        "counts": "x2",
        "attendanceRate": "80%",
        "revenue": "5000 DA",
        "date": "2024-12-15",
        "level": "Elementary",
        "module": "Module 1",
        "subject": "Mathematics"
      }
    ]
  }
}
```

## Filter Logic

- **AND Logic**: All filters are applied with AND logic (all conditions must match)
- **"All" Values**: If a filter parameter is `"All Levels"`, `"All Modules"`, `"All Subjects"`, or `"All Teachers"`, it should be omitted from the query or sent as `null`/empty
- **Date Range**: If both `startDate` and `endDate` are provided, filter sessions within that range (inclusive)
- **Backend Calculation**: The backend should calculate aggregated values (revenue, summary cards) based on filtered sessions

## Implementation Notes

- Replace the current `useMemo` logic in `page.tsx` with an API call using `useEffect`
- Use the `filters` state from `useFilters()` hook to construct the query parameters
- Handle loading and error states appropriately
- Consider caching or debouncing API calls when filters change rapidly
- The response should match the structure above to ensure proper rendering of all components

## Components Using This Data

- **RevenueCard**: Displays revenue value and chart
- **DashboardCard** (Summary Cards): Displays Total Sessions, Working Teachers, and Students
- **SmallChartCard**: Displays Sessions, Attendance, and Rate charts
- **SessionsTable**: Displays filtered session data in a table format

