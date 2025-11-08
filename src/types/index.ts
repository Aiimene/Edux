// User Types
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Admin extends User {
  role: 'admin';
  department?: string;
}

export interface Teacher extends User {
  role: 'teacher';
  subjects?: string[];
  employeeId?: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  grade?: string;
  parentId?: string;
  enrollmentDate?: Date;
}

export interface Parent extends User {
  role: 'parent';
  children?: Student[];
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string;
  notes?: string;
}

// Academic Types
export interface Session {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Module {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
  credits?: number;
}

export interface Timetable {
  id: string;
  moduleId: string;
  teacherId: string;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  targetRoles: UserRole[];
  priority: 'low' | 'medium' | 'high';
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents?: number;
  totalTeachers?: number;
  totalParents?: number;
  attendanceRate?: number;
  activeModules?: number;
  upcomingClasses?: number;
}

