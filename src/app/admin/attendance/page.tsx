'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DashboardCard from '../../../components/dashboard/DashboardCard/DashboardCard';
import AttendanceTable from '../../../components/attendance/AttendanceTable/AttendanceTable';
import { useAttendanceFilters } from './layout';
import { getAttendanceSummary, getTeachersAttendance, getStudentsAttendance } from '../../../lib/api/attendance';
import styles from './page.module.css';

export default function AttendancePage() {
  const { filters } = useAttendanceFilters();
  const [summary, setSummary] = useState<any>(null);
  const [teachersData, setTeachersData] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance data when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filterParams = {
          level: filters.level !== 'All Levels' ? filters.level : undefined,
          module: filters.module !== 'All Modules' ? filters.module : undefined,
          subject: filters.subject !== 'All Subjects' ? filters.subject : undefined,
          startDate: filters.startDate,
          endDate: filters.endDate,
        };

        const [summaryRes, teachersRes, studentsRes] = await Promise.all([
          getAttendanceSummary(filterParams),
          getTeachersAttendance(filterParams),
          getStudentsAttendance(filterParams),
        ]);

        setSummary(summaryRes);
        setTeachersData(teachersRes);
        setStudentsData(studentsRes);
      } catch (err: any) {
        console.error('Failed to fetch attendance data:', err);
        setError(err.message || 'Failed to load attendance data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Summary Cards */}
      {summary && (
        <div className={styles.summaryCards}>
          <DashboardCard
            icon="teachers"
            label="Teachers"
            value={summary.teachers?.percentage || '0%'}
            percentage={summary.teachers?.trend || '0%'}
          />
          <DashboardCard
            icon="students"
            label="Students"
            value={summary.students?.percentage || '0%'}
            percentage={summary.students?.trend || '0%'}
          />
        </div>
      )}

      {/* Teachers Table */}
      {teachersData && (
        <AttendanceTable
          title="Teachers"
          icon="/icons/teachers.svg"
          columns={teachersData.columns || []}
          rows={teachersData.rows || []}
          onSeeAll={() => console.log('See all teachers')}
        />
      )}

      {/* Students Table */}
      {studentsData && (
        <AttendanceTable
          title="Students"
          icon="/icons/students.svg"
          columns={studentsData.columns || []}
          rows={studentsData.rows || []}
          onSeeAll={() => console.log('See all students')}
        />
      )}
    </>
  );
}

