# API Data Structures Quick Reference

## Student Creation/Update

### Create Student (POST)

```typescript
{
  // Required fields
  name: "Ahmed Ben Ali",           // Full name
  username: "ahmed.benali",        // Unique username for login
  password: "SecurePass123!",      // Password for login

  // Optional fields
  email: "ahmed@example.com",      // Email address
  phone_number: "+213555123456",   // Phone with country code
  parent: 5,                       // Parent ID (number)
  fee_payment: 5000                // Initial debt amount in DZD
}
```

### Update Student (PATCH)

```typescript
{
  // All fields are optional - only send what you want to change
  name: "Ahmed Ben Ali",
  email: "newemail@example.com",
  phone_number: "+213666789012",
  password: "NewPassword123!",     // Only if changing password
  parent: 7                        // Change parent assignment
}
```

## Teacher Creation/Update

### Create Teacher (POST)

```typescript
{
  // Required fields
  name: "Dr. Fatima Zohra",        // Full name
  username: "fatima.zohra",        // Unique username for login
  password: "SecurePass123!",      // Password for login

  // Optional fields
  email: "fatima@example.com",
  phone_number: "+213777888999",
  first_name: "Fatima",           // First name
  last_name: "Zohra"              // Last name
}
```

### Update Teacher (PATCH)

```typescript
{
  // All fields are optional
  name: "Dr. Fatima Zohra Benali",
  email: "newemail@example.com",
  phone_number: "+213777111222",
  password: "NewPassword123!",
  first_name: "Fatima",
  last_name: "Benali"
}
```

## Parent Creation/Update

### Create Parent (POST)

```typescript
{
  // Required fields
  name: "Mohammed Amine",          // Full name
  username: "mohammed.amine",      // Unique username for login
  password: "SecurePass123!",      // Password for login

  // Optional fields
  email: "mohammed@example.com",
  phone_number: "+213666555444"
}
```

### Update Parent (PATCH)

```typescript
{
  // All fields are optional
  name: "Mohammed Amine Benali",
  email: "newemail@example.com",
  phone_number: "+213777222333",
  password: "NewPassword123!"
}
```

## Financial Operations (Students Only)

### Add Payment

```typescript
{
  amount: 2000; // Amount in DZD, must be positive number
}
```

### Add Debt

```typescript
{
  amount: 3500; // Amount in DZD, must be positive number
}
```

## Response Formats

### Student Response (List)

```typescript
{
  id: 1,
  name: "Ahmed Ben Ali",
  parent_name: "Mohammed Amine",
  total_owed: "5000.00",
  total_paid: "2000.00",
  balance: "3000.00",
  created_at: "2024-01-15T10:30:00Z"
}
```

### Student Response (Detail)

```typescript
{
  id: 1,
  name: "Ahmed Ben Ali",
  user: {
    id: 10,
    username: "ahmed.benali",
    email: "ahmed@example.com",
    phone_number: "+213555123456"
  },
  parent_name: "Mohammed Amine",
  workspace_name: "École Al-Amal",
  total_owed: "5000.00",
  total_paid: "2000.00",
  financial_summary: {
    total_owed: "5000.00",
    total_paid: "2000.00",
    balance: "3000.00",
    status: "pending"  // or "paid"
  },
  timetable: [
    {
      id: 1,
      session_name: "Mathematics 3AS",
      teacher_name: "Dr. Fatima Zohra",
      day_of_week: 1,  // 0=Sunday, 1=Monday, etc.
      start_time: "14:00:00",
      end_time: "16:00:00",
      enrolled_at: "2024-01-10T09:00:00Z"
    }
  ],
  created_at: "2024-01-15T10:30:00Z"
}
```

### Teacher Response (List)

```typescript
{
  id: 1,
  name: "Dr. Fatima Zohra",
  created_at: "2024-01-15T10:30:00Z"
}
```

### Teacher Response (Detail)

```typescript
{
  id: 1,
  name: "Dr. Fatima Zohra",
  user: {
    id: 5,
    username: "fatima.zohra",
    email: "fatima@example.com",
    phone_number: "+213777888999",
    first_name: "Fatima",
    last_name: "Zohra"
  },
  workspace_name: "École Al-Amal",
  sessions_count: 3,
  students_count: 45,
  created_at: "2024-01-15T10:30:00Z"
}
```

### Parent Response (List)

```typescript
{
  id: 1,
  name: "Mohammed Amine",
  children_count: 2,
  created_at: "2024-01-15T10:30:00Z"
}
```

### Parent Response (Detail)

```typescript
{
  id: 1,
  name: "Mohammed Amine",
  user: {
    id: 8,
    username: "mohammed.amine",
    email: "mohammed@example.com",
    phone_number: "+213666555444"
  },
  workspace_name: "École Al-Amal",
  children_count: 2,
  total_family_debt: {
    total_owed: "10000.00",
    total_paid: "6000.00",
    balance: "4000.00"
  },
  children: [
    {
      id: 1,
      name: "Ahmed Ben Ali",
      // ... student data
    },
    {
      id: 2,
      name: "Sara Ben Ali",
      // ... student data
    }
  ],
  created_at: "2024-01-15T10:30:00Z"
}
```

### Create Responses

#### Student Create

```typescript
{
  success: true,
  message: "Student added successfully",
  data: {
    studentId: "STU000001",
    studentName: "Ahmed Ben Ali",
    email: "ahmed@example.com"
  }
}
```

#### Parent Create

```typescript
{
  success: true,
  message: "Parent added successfully",
  data: {
    parentId: "PAR000001",
    parentName: "Mohammed Amine",
    email: "mohammed@example.com"
  }
}
```

## Validation Rules

### Username

- Must be unique across all users
- Alphanumeric + dots/underscores
- Cannot be changed after creation

### Email

- Must be unique if provided
- Valid email format
- Optional but recommended

### Password

- Required on creation
- Optional on update (only if changing)
- Stored securely (hashed)

### Phone Number

- Optional
- Recommend format: +213XXXXXXXXX (Algeria)
- No validation on format (stored as string)

### Parent Assignment (Students)

- Must be a valid Parent ID
- Optional - students can exist without parents
- Can be changed later

### Financial Amounts

- Must be positive numbers
- Decimal precision: 2 places
- Currency: Algerian Dinar (DZD)

## Common Errors

### 400 Bad Request

```typescript
// Username already exists
{
  "username": ["Username already exists"]
}

// Email already exists
{
  "email": ["Email already exists"]
}

// Missing required field
{
  "name": ["This field is required"]
}

// Cannot delete (has dependencies)
{
  "error": "Cannot delete parent with existing children",
  "children_count": 2
}
```

### 401 Unauthorized

```typescript
{
  "detail": "Authentication credentials were not provided."
}
// OR
{
  "detail": "Given token not valid for any token type"
}
```

### 404 Not Found

```typescript
{
  "detail": "Not found."
}
```

## Form Validation Examples

### React Hook Form Example (Student)

```typescript
import { useForm } from "react-hook-form";
import { createStudent, CreateStudentData } from "@/api/students";

const StudentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStudentData>();

  const onSubmit = async (data: CreateStudentData) => {
    try {
      const result = await createStudent(data);
      alert(`Student created: ${result.data.studentId}`);
    } catch (error) {
      console.error("Error:", error.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", { required: "Name is required" })}
        placeholder="Full Name"
      />
      {errors.name && <span>{errors.name.message}</span>}

      <input
        {...register("username", {
          required: "Username is required",
          pattern: {
            value: /^[a-z0-9._]+$/,
            message: "Only lowercase letters, numbers, dots and underscores",
          },
        })}
        placeholder="Username"
      />
      {errors.username && <span>{errors.username.message}</span>}

      <input
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <input
        type="email"
        {...register("email")}
        placeholder="Email (optional)"
      />

      <input
        {...register("phone_number")}
        placeholder="Phone Number (optional)"
      />

      <input
        type="number"
        {...register("parent")}
        placeholder="Parent ID (optional)"
      />

      <input
        type="number"
        step="0.01"
        {...register("fee_payment")}
        placeholder="Initial Fee (optional)"
      />

      <button type="submit">Create Student</button>
    </form>
  );
};
```

## Testing Checklist

- [ ] Create student with all fields
- [ ] Create student with minimum fields (name, username, password)
- [ ] Update student name and email
- [ ] Change student password
- [ ] Assign/reassign parent
- [ ] Add payment to student
- [ ] Add debt to student
- [ ] Delete student (with zero balance)
- [ ] Try to delete student with balance (should fail)
- [ ] Create teacher
- [ ] Update teacher
- [ ] Delete teacher (without classes)
- [ ] Create parent
- [ ] Update parent
- [ ] Delete parent (without children)
- [ ] Try to delete parent with children (should fail)
- [ ] Test with invalid token (should get 401)
- [ ] Test duplicate username (should get 400)
- [ ] Test duplicate email (should get 400)
