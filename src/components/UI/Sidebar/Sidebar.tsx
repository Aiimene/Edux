'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import enterpriseData from '../../../data/enterprise.json';
import { logout } from "@/lib/authUtils";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isDashboardActive = pathname === '/admin/dashboard';
  const isStudentsActive = pathname?.startsWith('/admin/members/students');
  const isTeachersActive = pathname?.startsWith('/admin/members/teachers');
  const isParentsActive = pathname?.startsWith('/admin/members/parents');
  const isLevelsActive = pathname?.startsWith('/admin/academic/levels');
  const isTimetablesActive = pathname?.startsWith('/admin/academic/timetables');
  const isSessionsActive = pathname?.startsWith('/admin/academic/sessions');
  const isAnnouncementsActive = pathname?.startsWith('/admin/announcements');

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.logoBox}>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose} aria-label="Close menu">
            ×
          </button>
        )}
        <Image src="/images/logo2.png" alt="Logo" width={80} height={80} className={styles.logoImg} />
        <div className={styles.logoTextBox}>
          <span className={styles.logoTitle}>Education Tracking</span>
          <span className={styles.logoSubtitle}>&AttendanceSystem</span>
        </div>
      </div>

      <nav className={styles.nav}>
         <div className={`${styles.sectionTitle} ${styles.sectionWithLine}`}>Main</div>
        <Link href="/admin/dashboard" className={`${styles.link} ${isDashboardActive ? styles.active : ''}`}>
          <Image src="/icons/dashboard.svg" alt="dashboard" width={20} height={20} />
          <span>Dashboard</span>
        </Link>

        <Link href="/admin/analytics" className={`${styles.link} ${isAnalyticsActive ? styles.active : ''}`}>
          <Image src="/icons/analytics.svg" alt="analytics" width={20} height={20} />
          <span>Analytics</span>
        </Link>

        <Link href="/admin/attendance" className={`${styles.link} ${isAttendanceActive ? styles.active : ''}`}>
          <Image src="/icons/attendance.svg" alt="attendance" width={20} height={20} />
          <span>Attendance</span>
        </Link>
        <div className={`${styles.sectionTitle} ${styles.sectionWithLine}`}>Control</div>
        {/* Members Section */}
<div className={`${styles.sectionTitle} ${styles.Mindented}`}>Members</div>

<Link href="/admin/members/students/studentList" className={`${styles.link} ${styles.indented} ${isStudentsActive ? styles.active : ''}`}>
  <Image src="/icons/students.svg" alt="students" width={20} height={20} />
  <span>Students</span>
</Link>

<Link href="/admin/members/teachers/teacherList" className={`${styles.link} ${styles.indented} ${isTeachersActive ? styles.active : ''}`}>
  <Image src="/icons/teachers.svg" alt="teachers" width={20} height={20} />
  <span>Teachers</span>
</Link>

<Link href="/admin/members/parents/parentList" className={`${styles.link} ${styles.indented} ${isParentsActive ? styles.active : ''}`}>
  <Image src="/icons/parents.svg" alt="parents" width={20} height={20} />
  <span>Parents</span>
</Link>

{/* Academic Section */}
<div className={`${styles.sectionTitle} ${styles.Mindented}`}>Academic</div>

        {/* Single Level link under Modules */}
        <Link href="/admin/academic/levels" className={`${styles.link} ${styles.indented} ${isLevelsActive ? styles.active : ''}`}>
          <Image src="/icons/levels.svg" alt="level" width={26} height={24} />
          <span>Levels</span>
        </Link>

<Link href="/admin/academic/timetables" className={`${styles.link} ${styles.indented} ${isTimetablesActive ? styles.active : ''}`}>
  <Image src="/icons/timetables.svg" alt="timetables" width={20} height={20} />
  <span>Timetables</span>
</Link>

<Link href="/admin/academic/sessions" className={`${styles.link} ${styles.indented} ${isSessionsActive ? styles.active : ''}`}>
  <Image src="/icons/sessions.svg" alt="sessions" width={20} height={20} />
  <span>Sessions</span>
</Link>


                <Link href="/admin/announcements" className={`${styles.link} ${isAnnouncementsActive ? styles.active : ''}`}>
          <Image src="/icons/announcement.svg" alt="announcement" width={20} height={20} />
          <span>Announcement</span>
        </Link>

        <div className={`${styles.sectionTitle} ${styles.sectionWithLine}`}>General</div>



        <Link href="/admin/settings" className={`${styles.link} ${pathname === '/admin/settings' ? styles.active : ''}`}>
          <Image src="/icons/settings.svg" alt="settings" width={20} height={20} />
          <span>Settings</span>
        </Link>

        <Link href="#" className={styles.logout} onClick={() => logout()}>
          <Image src="/icons/logout.svg" alt="logout" width={20} height={20} />
          <span>Logout</span>
        </Link>
      </nav>
    </aside>
    </>
  );
}

