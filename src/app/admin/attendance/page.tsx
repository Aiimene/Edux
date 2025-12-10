'use client';

import React, { useMemo } from 'react';
import DashboardCard from '../../../components/dashboard/DashboardCard/DashboardCard';
import AttendanceTable from '../../../components/attendance/AttendanceTable/AttendanceTable';
import { useAttendanceFilters } from './layout';
import attendanceData from '../../../data/attendance.json';
import styles from './page.module.css';

export default function AttendancePage() {
  const { filters } = useAttendanceFilters();

  // Get filtered data based on current filters - all data comes from JSON
  const filteredData = useMemo(() => {
    let teachersRows = [...attendanceData.teachers.rows];
    let studentsRows = [...attendanceData.students.rows];

    // Apply filters to teachers
    if (filters.level !== 'All Levels') {
      teachersRows = teachersRows.filter((row) => row.level === filters.level);
    }
    if (filters.module !== 'All Modules') {
      teachersRows = teachersRows.filter((row) => row.module === filters.module);
    }
    if (filters.subject !== 'All Subjects') {
      teachersRows = teachersRows.filter((row) => row.module === filters.subject);
    }

    // Apply filters to students
    if (filters.level !== 'All Levels') {
      studentsRows = studentsRows.filter((row) => row.level === filters.level);
    }
    if (filters.module !== 'All Modules') {
      studentsRows = studentsRows.filter((row) => row.module === filters.module);
    }
    if (filters.subject !== 'All Subjects') {
      studentsRows = studentsRows.filter((row) => row.module === filters.subject);
    }

    // Use summary data directly from JSON file
    return {
      summary: attendanceData.summary,
      teachers: {
        ...attendanceData.teachers,
        rows: teachersRows,
      },
      students: {
        ...attendanceData.students,
        rows: studentsRows,
      },
    };
  }, [filters]);

  return (
    <>
      {/* Summary Cards */}
      <div className={styles.summaryCards}>
        <DashboardCard
          icon="teachers"
          label="Teachers"
          value={filteredData.summary.teachers.percentage}
          percentage={filteredData.summary.teachers.trend}
        />
        <DashboardCard
          icon="students"
          label="Students"
          value={filteredData.summary.students.percentage}
          percentage={filteredData.summary.students.trend}
        />
      </div>

      {/* Teachers Table */}
      <AttendanceTable
        title="Teachers"
        icon="/icons/teachers.svg"
        columns={filteredData.teachers.columns}
        rows={filteredData.teachers.rows}
        onSeeAll={() => console.log('See all teachers')}
      />

      {/* Students Table */}
      <AttendanceTable
        title="Students"
        icon="/icons/students.svg"
        columns={filteredData.students.columns}
        rows={filteredData.students.rows}
        onSeeAll={() => console.log('See all students')}
      />
    </>
  );
}

