import { UserRole } from '@/types';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
  roles: UserRole[];
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'dashboard',
    roles: ['admin'],
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: 'analytics',
    roles: ['admin'],
  },
  {
    label: 'Attendance',
    href: '/admin/attendance',
    icon: 'attendance',
    roles: ['admin'],
  },
  {
    label: 'Members',
    href: '/admin/members',
    icon: 'members',
    roles: ['admin'],
    children: [
      {
        label: 'Students',
        href: '/admin/members/students',
        icon: 'students',
        roles: ['admin'],
      },
      {
        label: 'Parents',
        href: '/admin/members/parents',
        icon: 'parents',
        roles: ['admin'],
      },
      {
        label: 'Teachers',
        href: '/admin/members/teachers',
        icon: 'teachers',
        roles: ['admin'],
      },
    ],
  },
  {
    label: 'Academic',
    href: '/admin/academic',
    icon: 'academic',
    roles: ['admin'],
    children: [
      {
        label: 'Sessions',
        href: '/admin/academic/sessions',
        icon: 'sessions',
        roles: ['admin'],
      },
      {
        label: 'Modules',
        href: '/admin/academic/modules',
        icon: 'modules',
        roles: ['admin'],
      },
      {
        label: 'Timetables',
        href: '/admin/academic/timetables',
        icon: 'timetables',
        roles: ['admin'],
      },
    ],
  },
  {
    label: 'Announcement',
    href: '/admin/announcements',
    icon: 'announcement',
    roles: ['admin'],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: 'settings',
    roles: ['admin'],
  },
];

export const TEACHER_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/teacher/dashboard',
    icon: 'dashboard',
    roles: ['teacher'],
  },
  {
    label: 'My Classes',
    href: '/teacher/classes',
    icon: 'academic',
    roles: ['teacher'],
  },
  {
    label: 'Attendance',
    href: '/teacher/attendance',
    icon: 'attendance',
    roles: ['teacher'],
  },
  {
    label: 'Students',
    href: '/teacher/students',
    icon: 'students',
    roles: ['teacher'],
  },
  {
    label: 'Timetable',
    href: '/teacher/timetable',
    icon: 'timetables',
    roles: ['teacher'],
  },
  {
    label: 'Announcements',
    href: '/teacher/announcements',
    icon: 'announcement',
    roles: ['teacher'],
  },
  {
    label: 'Settings',
    href: '/teacher/settings',
    icon: 'settings',
    roles: ['teacher'],
  },
];

export const STUDENT_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/student/dashboard',
    icon: 'dashboard',
    roles: ['student'],
  },
  {
    label: 'My Courses',
    href: '/student/courses',
    icon: 'modules',
    roles: ['student'],
  },
  {
    label: 'Attendance',
    href: '/student/attendance',
    icon: 'attendance',
    roles: ['student'],
  },
  {
    label: 'Timetable',
    href: '/student/timetable',
    icon: 'timetables',
    roles: ['student'],
  },
  {
    label: 'Announcements',
    href: '/student/announcements',
    icon: 'announcement',
    roles: ['student'],
  },
  {
    label: 'Settings',
    href: '/student/settings',
    icon: 'settings',
    roles: ['student'],
  },
];

export const PARENT_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/parent/dashboard',
    icon: 'dashboard',
    roles: ['parent'],
  },
  {
    label: 'My Children',
    href: '/parent/children',
    icon: 'students',
    roles: ['parent'],
  },
  {
    label: 'Attendance',
    href: '/parent/attendance',
    icon: 'attendance',
    roles: ['parent'],
  },
  {
    label: 'Announcements',
    href: '/parent/announcements',
    icon: 'announcement',
    roles: ['parent'],
  },
  {
    label: 'Settings',
    href: '/parent/settings',
    icon: 'settings',
    roles: ['parent'],
  },
];

