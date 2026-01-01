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
        
        // Convert date range to startDate/endDate if needed
        let startDate = filters.startDate;
        let endDate = filters.endDate;
        
        if (!startDate || !endDate) {
          const now = new Date();
          if (filters.dateRange === 'This Week') {
            const start = new Date(now);
            start.setDate(now.getDate() - now.getDay());
            startDate = start.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          } else if (filters.dateRange === 'This Month') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate = start.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          } else if (filters.dateRange === 'This Year') {
            const start = new Date(now.getFullYear(), 0, 1);
            startDate = start.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          }
        }

        const filterParams = {
          level: filters.level !== 'All Levels' ? filters.level : undefined,
          module: filters.module !== 'All Modules' ? filters.module : undefined,
          subject: filters.subject !== 'All Subjects' ? filters.subject : undefined,
          startDate: startDate,
          endDate: endDate,
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
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading attendance data...</p>
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

