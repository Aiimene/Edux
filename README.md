# Edux 📚

**Education Tracking & Attendance System**

A comprehensive web application for managing supplementary courses, tracking student and teacher attendance, and facilitating communication between administrators, teachers, students, and parents.

## 🎯 Overview

Edux is a role-based education management platform designed to streamline the tracking of supplementary courses. It provides dedicated dashboards and functionality for four distinct user roles:

- **👨‍💼 Administrator**: Full system control, member management, analytics, and academic operations
- **👨‍🏫 Teacher**: Class management, attendance marking, and student communication
- **👨‍🎓 Student**: Course viewing, personal attendance tracking, and schedule management
- **👨‍👩‍👧 Parent**: Children monitoring and attendance oversight

## 🚀 Features

- **Dashboard Analytics**: Real-time insights and statistics for each user role
- **Attendance Management**: Comprehensive attendance tracking system
- **Member Management**: Handle students, teachers, and parents efficiently
- **Academic Planning**: Sessions, modules, and timetable organization
- **Announcements**: System-wide communication and notifications
- **Role-Based Access**: Secure, customized experiences for each user type

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Linting**: ESLint

## 📁 Project Structure

```
Edux/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Authentication routes
│   │   │   ├── login/
│   │   │   │   ├── admin/            # Admin login
│   │   │   │   ├── teacher/          # Teacher login
│   │   │   │   ├── student/          # Student login
│   │   │   │   └── parent/           # Parent login
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   │
│   │   ├── admin/                     # Admin dashboard & features
│   │   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   ├── attendance/
│   │   │   ├── members/
│   │   │   │   ├── students/
│   │   │   │   ├── teachers/
│   │   │   │   └── parents/
│   │   │   ├── academic/
│   │   │   │   ├── sessions/
│   │   │   │   ├── modules/
│   │   │   │   └── timetables/
│   │   │   ├── announcements/
│   │   │   └── settings/
│   │   │
│   │   ├── teacher/                   # Teacher dashboard & features
│   │   │   ├── dashboard/
│   │   │   ├── classes/
│   │   │   ├── attendance/
│   │   │   ├── students/
│   │   │   ├── timetable/
│   │   │   ├── announcements/
│   │   │   └── settings/
│   │   │
│   │   ├── student/                   # Student dashboard & features
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   ├── attendance/
│   │   │   ├── timetable/
│   │   │   ├── announcements/
│   │   │   └── settings/
│   │   │
│   │   ├── parent/                    # Parent dashboard & features
│   │   │   ├── dashboard/
│   │   │   ├── children/
│   │   │   ├── attendance/
│   │   │   ├── announcements/
│   │   │   └── settings/
│   │   │
│   │   └── api/                       # API routes
│   │
│   ├── components/
│   │   ├── layout/                    # Layout components
│   │   ├── ui/                        # Reusable UI components
│   │   ├── dashboard/                 # Dashboard widgets
│   │   ├── members/                   # Member management components
│   │   ├── attendance/                # Attendance components
│   │   ├── academic/                  # Academic components
│   │   ├── announcements/             # Announcement components
│   │   ├── analytics/                 # Analytics components
│   │   ├── auth/                      # Authentication components
│   │   └── home/                      # Home page components
│   │       ├── hero/
│   │       ├── features/
│   │       ├── about/
│   │       └── contact/
│   │
│   ├── lib/
│   │   ├── api/                       # API client utilities
│   │   ├── utils/                     # Helper functions
│   │   ├── constants/                 # Constants and configs
│   │   ├── auth/                      # Authentication utilities
│   │   └── db/                        # Database utilities
│   │
│   ├── types/                         # TypeScript type definitions
│   ├── hooks/                         # Custom React hooks
│   ├── context/                       # React context providers
│   └── middleware.ts
│
├── public/                            # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── prisma/                            # Database schema (optional)
```

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Edux
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 User Roles

### Administrator
- Full system access and control
- Manage all users (students, teachers, parents)
- View comprehensive analytics
- Create and manage academic sessions, modules, and timetables
- Post system-wide announcements

### Teacher
- Manage assigned classes
- Mark student attendance
- View student information
- Access personal timetable
- Post announcements to students

### Student
- View enrolled courses
- Check personal attendance records
- Access class timetable
- Receive announcements
- Update profile settings

### Parent
- Monitor children's progress
- View attendance records
- Receive school announcements
- Communicate with teachers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or support, please contact the development team.

---

Built with ❤️ for better education management
