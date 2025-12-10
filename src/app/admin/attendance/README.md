# Attendance Page API Integration

## API Endpoint

**Endpoint:** `GET /api/attendance`

## Query Parameters

All query parameters are optional. Default values should be "All" for filter options.

| Parameter | Type | Description | Example Values |
|-----------|------|-------------|----------------|
| `level` | string | Filter by education level | `"Elementary"`, `"Middle School"`, `"High School"`, `"3rd Level"` |
| `module` | string | Filter by module | `"Module 1"`, `"Module 2"`, `"Module 3"`, `"Module 4"`, `"Module 5"` |
| `subject` | string | Filter by subject | `"Mathematics"`, `"Science"`, `"English"`, `"Arabic"` |
| `startDate` | string (ISO 8601) | Start date for date range filter | `"2024-12-15"` |
| `endDate` | string (ISO 8601) | End date for date range filter | `"2024-12-21"` |

## Example Request

```
GET /api/attendance?level=Elementary&module=Module%201&subject=Mathematics&startDate=2024-12-15&endDate=2024-12-21
```

## Expected Response Structure

```json
{
  "filters": {
    "levels": ["All Levels", "Elementary", "Middle School", "High School", "3rd Level"],
    "modules": ["All Modules", "Module 1", "Module 2", "Module 3", "Module 4", "Module 5"],
    "subjects": ["All Subjects", "Mathematics", "Science", "English", "Arabic"],
    "dateRanges": ["This Week", "This Month", "This Year", "Custom"]
  },
  "summary": {
    "teachers": {
      "percentage": "80%",
      "trend": "15.50%",
      "trendDirection": "up"
    },
    "students": {
      "percentage": "80%",
      "trend": "15.50%",
      "trendDirection": "up"
    }
  },
  "teachers": {
    "columns": ["Teacher", "Level", "Module", "Sessions", "Working", "Attendance Rate"],
    "rows": [
      {
        "id": "1",
        "name": "Hmida Teacher",
        "level": "3rd Level",
        "module": "Science",
        "sessions": "20",
        "working": "16",
        "attendanceRate": "80%",
        "memberId": "teacher_001"
      },
      {
        "id": "1a",
        "name": "Hmida Teacher",
        "level": "Elementary",
        "module": "Mathematics",
        "sessions": "18",
        "working": "15",
        "attendanceRate": "83%",
        "memberId": "teacher_001"
      }
    ]
  },
  "students": {
    "columns": ["Student", "Level", "Module", "Sessions", "Working", "Attendance Rate"],
    "rows": [
      {
        "id": "1",
        "name": "Hmida Student",
        "level": "3rd Level",
        "module": "Science",
        "sessions": "20",
        "working": "16",
        "attendanceRate": "80%",
        "memberId": "student_001"
      },
      {
        "id": "1a",
        "name": "Hmida Student",
        "level": "Elementary",
        "module": "Module 1",
        "sessions": "18",
        "working": "15",
        "attendanceRate": "83%",
        "memberId": "student_001"
      }
    ]
  }
}
```

## Response Field Descriptions

### Summary Object
- **teachers.percentage**: Overall teacher attendance percentage (string format: "80%")
- **teachers.trend**: Percentage change from previous period (string format: "15.50%")
- **teachers.trendDirection**: Direction of trend (`"up"` or `"down"`)
- **students.percentage**: Overall student attendance percentage (string format: "80%")
- **students.trend**: Percentage change from previous period (string format: "15.50%")
- **students.trendDirection**: Direction of trend (`"up"` or `"down"`)

### Table Row Object
- **id**: Unique identifier for the row (string)
- **name**: Full name of the teacher/student (string)
- **level**: Education level (string)
- **module**: Module name (string)
- **sessions**: Total number of sessions (string format: "20")
- **working**: Number of sessions attended (string format: "16")
- **attendanceRate**: Attendance rate percentage (string format: "80%")
- **memberId**: Unique identifier for the member (string) - **Required for "Clean" functionality**

### Important Notes on memberId
- The `memberId` field is **critical** for the "Clean" functionality
- Members with the same `memberId` will be grouped together when the "Clean" button is activated
- When cleaning, the backend should return all rows for members with multiple levels/modules
- The frontend will calculate averages and aggregate data for cleaned rows

## Filter Logic

- **AND Logic**: All filters are applied with AND logic (all conditions must match)
- **"All" Values**: If a filter parameter is `"All Levels"`, `"All Modules"`, or `"All Subjects"`, it should be omitted from the query or sent as `null`/empty
- **Date Range**: If both `startDate` and `endDate` are provided, filter attendance records within that range (inclusive)
- **Backend Calculation**: The backend should calculate summary statistics (teachers/students percentages and trends) based on filtered data

## Clean Functionality

The attendance page includes a "Clean" feature that groups rows by `memberId`. When this feature is used:

1. **Multiple Rows per Member**: If a member (teacher/student) has multiple rows with different levels/modules, the frontend will:
   - Group rows by `memberId`
   - Calculate average attendance rate across all rows
   - Sum total sessions and working sessions
   - Display an eye icon (👁️) next to Level/Module columns when multiple values exist

2. **Backend Consideration**: The backend should return all individual rows for members with multiple levels/modules. The frontend handles the aggregation and display logic.

3. **Data Structure**: Ensure each row includes:
   - Unique `id` for the row
   - `memberId` that groups related rows together
   - All other fields (name, level, module, sessions, working, attendanceRate)

## Implementation Notes

- Replace the current `useMemo` logic in `page.tsx` with an API call using `useEffect`
- Use the `filters` state from `useAttendanceFilters()` hook to construct the query parameters
- Handle loading and error states appropriately
- Consider caching or debouncing API calls when filters change rapidly
- The response should match the structure above to ensure proper rendering of all components
- Ensure `memberId` is consistent across rows for the same member to support the "Clean" functionality

## Components Using This Data

- **DashboardCard** (Summary Cards): Displays Teachers and Students attendance percentages with trends
- **AttendanceTable** (Teachers Table): Displays filtered teacher attendance data with sorting and cleaning capabilities
- **AttendanceTable** (Students Table): Displays filtered student attendance data with sorting and cleaning capabilities

## Filter Components

The page uses the following filter components:
- **FilterBy**: Dropdown filters for Level, Module, and Subject
- **DateRangePicker**: Date range selection for custom date filtering
- **CurrentFilter**: Displays active filters and allows clearing all filters

## Sorting

The table supports sorting by:
- Name
- Level
- Module
- Sessions
- Working
- Attendance Rate

Sorting is handled on the frontend, but the backend can optionally support sorting via query parameters:
- `sortBy`: Field name to sort by (e.g., `"name"`, `"attendanceRate"`)
- `sortOrder`: Sort direction (`"asc"` or `"desc"`)

