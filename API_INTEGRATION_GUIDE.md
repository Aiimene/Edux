# Edux API Integration Guide

## Overview

This document explains how the frontend integrates with the Django backend API for managing students, teachers, and parents.

## Backend API Structure

### Base URLs

- **Authentication**: `http://127.0.0.1:8000/api/auth/`
- **Members (Students, Teachers, Parents)**: `http://127.0.0.1:8000/api/members/`
- **Dashboard**: `http://127.0.0.1:8000/api/dashboard/`

### Authentication

All API requests (except login/register) require a JWT access token in the header:

```
Authorization: Bearer <access_token>
```

The token is stored in localStorage as `authToken` or `access_token`.

## API Endpoints

### Students API

#### 1. Get All Students

```typescript
GET /api/members/students/
Response: Student[] (list view - basic info)
```

#### 2. Get Student Details

```typescript
GET /api/members/students/{id}/
Response: Student (detailed view with timetable and financial data)
```

#### 3. Create Student

```typescript
POST /api/members/students/
Body: {
  name: string;          // Required
  username: string;      // Required, must be unique
  password: string;      // Required
  email?: string;        // Optional
  phone_number?: string; // Optional
  parent?: number;       // Optional, parent ID
  fee_payment?: number;  // Optional, initial debt amount
}
Response: {
  success: true,
  message: "Student added successfully",
  data: {
    studentId: string,
    studentName: string,
    email: string
  }
}
```

#### 4. Update Student

```typescript
PATCH /api/members/students/{id}/
Body: {
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;     // Only update if provided
  parent?: number;
}
Response: Student (updated data)
```

#### 5. Delete Student

```typescript
DELETE /api/members/students/{id}/
Response: 204 No Content (success)
Error: 400 if student has outstanding balance
```

#### 6. Add Payment

```typescript
POST /api/members/students/{id}/add-payment/
Body: {
  amount: number;  // Must be positive
}
Response: {
  message: "Payment added successfully",
  payment_amount: string,
  financial_summary: {
    total_owed: string,
    total_paid: string,
    balance: string,
    status: "paid" | "pending"
  }
}
```

#### 7. Add Debt

```typescript
POST /api/members/students/{id}/add-debt/
Body: {
  amount: number;  // Must be positive
}
Response: {
  message: "Debt added successfully",
  debt_amount: string,
  financial_summary: {...}
}
```

### Teachers API

#### 1. Get All Teachers

```typescript
GET /api/members/teachers/
Response: Teacher[] (list view)
```

#### 2. Get Teacher Details

```typescript
GET /api/members/teachers/{id}/
Response: Teacher (detailed view with sessions and student counts)
```

#### 3. Create Teacher

```typescript
POST /api/members/teachers/
Body: {
  name: string;          // Required
  username: string;      // Required, must be unique
  password: string;      // Required
  email?: string;        // Optional
  phone_number?: string; // Optional
  first_name?: string;   // Optional
  last_name?: string;    // Optional
}
Response: Teacher (created data)
```

#### 4. Update Teacher

```typescript
PATCH /api/members/teachers/{id}/
Body: {
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}
Response: Teacher (updated data)
```

#### 5. Delete Teacher

```typescript
DELETE /api/members/teachers/{id}/
Response: 204 No Content (success)
Error: 400 if teacher has active classes or enrolled students
```

### Parents API

#### 1. Get All Parents

```typescript
GET /api/members/parents/
Response: Parent[] (list view with children count)
```

#### 2. Get Parent Details

```typescript
GET /api/members/parents/{id}/
Response: Parent (detailed view with children array and family debt summary)
```

#### 3. Create Parent

```typescript
POST /api/members/parents/
Body: {
  name: string;          // Required
  username: string;      // Required, must be unique
  password: string;      // Required
  email?: string;        // Optional
  phone_number?: string; // Optional
}
Response: {
  success: true,
  message: "Parent added successfully",
  data: {
    parentId: string,
    parentName: string,
    email: string
  }
}
```

#### 4. Update Parent

```typescript
PATCH /api/members/parents/{id}/
Body: {
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
}
Response: Parent (updated data)
```

#### 5. Delete Parent

```typescript
DELETE /api/members/parents/{id}/
Response: 204 No Content (success)
Error: 400 if parent has children
```

## Frontend Usage Examples

### Creating a Student

```typescript
import { createStudent } from "@/api/students";

const handleCreateStudent = async () => {
  try {
    const response = await createStudent({
      name: "John Doe",
      username: "john.doe",
      password: "securePassword123",
      email: "john@example.com",
      phone_number: "+213555123456",
      parent: 5, // Parent ID (optional)
      fee_payment: 5000, // Initial debt in DZD (optional)
    });

    console.log(response.data.studentId); // STU000001
    alert("Student created successfully!");
  } catch (error) {
    console.error("Error:", error.response?.data);
    alert("Failed to create student");
  }
};
```

### Updating a Student

```typescript
import { updateStudent } from "@/api/students";

const handleUpdateStudent = async (studentId: number) => {
  try {
    const updated = await updateStudent(studentId, {
      name: "John Smith", // Changed name
      email: "johnsmith@example.com",
      // Password is optional - only include if changing
    });

    console.log("Updated:", updated);
    alert("Student updated successfully!");
  } catch (error) {
    console.error("Error:", error.response?.data);
  }
};
```

### Adding Payment

```typescript
import { addPaymentToStudent } from "@/api/students";

const handleAddPayment = async (studentId: number) => {
  try {
    const result = await addPaymentToStudent(studentId, 2000);

    console.log("New balance:", result.financial_summary.balance);
    alert(
      `Payment added! New balance: ${result.financial_summary.balance} DZD`
    );
  } catch (error) {
    console.error("Error:", error.response?.data);
  }
};
```

### Fetching Students with Error Handling

```typescript
import { getStudents } from "@/api/students";
import { useState, useEffect } from "react";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getStudents();
        setStudents(data);
        setError(null);
      } catch (err) {
        setError("Failed to load students");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {students.map((student) => (
        <div key={student.id}>
          <h3>{student.name}</h3>
          <p>Balance: {student.balance} DZD</p>
        </div>
      ))}
    </div>
  );
};
```

## Common Issues & Solutions

### 1. 401 Unauthorized Error

**Problem**: API returns 401 status
**Solution**:

- Check if user is logged in
- Verify token is stored in localStorage as 'authToken' or 'access_token'
- Token may have expired - user needs to log in again

### 2. 400 Bad Request on Create

**Problem**: Creating student/teacher/parent fails with 400
**Causes**:

- Username already exists (must be unique)
- Email already exists (must be unique)
- Missing required fields (name, username, password)
- Invalid data format

### 3. CORS Errors

**Problem**: Browser blocks requests
**Solution**: Ensure Django backend has CORS configured:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### 4. Network Error

**Problem**: No response from server
**Solution**:

- Verify Django backend is running on port 8000
- Check URL: `http://127.0.0.1:8000/api/members/`
- Check firewall/antivirus settings

## Type Safety

All API functions are fully typed with TypeScript interfaces. Import types as needed:

```typescript
import {
  Student,
  CreateStudentData,
  UpdateStudentData,
  FinancialSummary,
} from "@/api/students";

import { Teacher, CreateTeacherData, UpdateTeacherData } from "@/api/teachers";

import { Parent, CreateParentData, UpdateParentData } from "@/api/parents";
```

## Testing the API

### Using the Browser Console

```javascript
// Get auth token first
const token = localStorage.getItem("authToken");
console.log("Token:", token);

// Test API directly
fetch("http://127.0.0.1:8000/api/members/students/", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((r) => r.json())
  .then((data) => console.log(data));
```

### Using Postman or Thunder Client

1. Set method (GET, POST, PATCH, DELETE)
2. Set URL: `http://127.0.0.1:8000/api/members/students/`
3. Add header: `Authorization: Bearer <your_token>`
4. For POST/PATCH, add JSON body
5. Send request

## Next Steps

1. Implement error handling in your UI components
2. Add loading states for better UX
3. Consider using React Query or SWR for data fetching
4. Add form validation before API calls
5. Implement optimistic updates for better perceived performance
