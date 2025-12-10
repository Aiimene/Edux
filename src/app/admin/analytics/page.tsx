'use client';

import React, { useMemo } from 'react';
import DashboardCard from '../../../components/dashboard/DashboardCard/DashboardCard';
import RevenueCard from '../../../components/analytics/RevenueCard/RevenueCard';
import SmallChartCard from '../../../components/analytics/SmallChartCard/SmallChartCard';
import SessionsTable from '../../../components/analytics/SessionsTable/SessionsTable';
import { useFilters } from './layout';
import analyticsData from '../../../data/analytics.json';
import styles from './page.module.css';

export default function AnalyticsPage() {
  const { filters } = useFilters();

  // Get filtered data based on current filters
  const filteredData = useMemo(() => {
    let sessionsRows = [...analyticsData.sessionsTable.rows];

    // Apply all filters to sessions
    if (filters.level !== 'All Levels') {
      sessionsRows = sessionsRows.filter((row) => row.level === filters.level);
    }

    if (filters.module !== 'All Modules') {
      sessionsRows = sessionsRows.filter((row) => row.module === filters.module);
    }

    if (filters.subject !== 'All Subjects') {
      sessionsRows = sessionsRows.filter((row) => row.subject === filters.subject);
    }

    if (filters.teacher !== 'All Teachers') {
      sessionsRows = sessionsRows.filter((row) => row.teacher === filters.teacher);
    }

    if (filters.startDate && filters.endDate) {
      sessionsRows = sessionsRows.filter((row) => {
        const rowDate = new Date(row.date);
        const startDate = new Date(filters.startDate!);
        const endDate = new Date(filters.endDate!);
        return rowDate >= startDate && rowDate <= endDate;
      });
    }

    // Calculate revenue from filtered sessions
    const totalRevenue = sessionsRows.reduce((sum, row) => {
      const revenueValue = parseInt(row.revenue.replace(/[^0-9]/g, ''));
      return sum + revenueValue;
    }, 0);
    const revenueValue = totalRevenue > 0 ? `${totalRevenue.toLocaleString()} DZD` : analyticsData.revenue.value;

    // Calculate summary cards from filtered sessions
    const totalSessions = sessionsRows.length;
    const uniqueTeachers = new Set(sessionsRows.map(row => row.teacher)).size;
    const totalStudents = sessionsRows.reduce((sum, row) => {
      const counts = parseInt(row.counts.replace(/[^0-9]/g, ''));
      return sum + (counts || 0);
    }, 0);

    // Use level-specific data if level filter is applied, otherwise use calculated values
    let revenue = analyticsData.revenue;
    if (filters.level !== 'All Levels' && revenue.dataByLevel && revenue.dataByLevel[filters.level as keyof typeof revenue.dataByLevel]) {
      revenue = {
        ...revenue,
        ...revenue.dataByLevel[filters.level as keyof typeof revenue.dataByLevel],
      };
    } else if (totalRevenue > 0) {
      revenue = {
        ...revenue,
        value: revenueValue,
      };
    }

    const summaryCards = analyticsData.summaryCards.map((card, index) => {
      let value = card.value;
      if (filters.level !== 'All Levels' && card.dataByLevel) {
        value = card.dataByLevel[filters.level as keyof typeof card.dataByLevel] || card.value;
      } else {
        // Calculate from filtered sessions
        if (index === 0) { // Total Sessions
          value = totalSessions.toString();
        } else if (index === 1) { // Working Teachers
          value = uniqueTeachers.toString();
        } else if (index === 2) { // Students
          value = totalStudents > 0 ? totalStudents.toString() : card.value;
        }
      }
      return {
        ...card,
        value,
      };
    });

    // Update small charts based on filtered sessions
    const smallCharts = analyticsData.smallCharts.map((chart, index) => {
      let value = chart.value;
      if (index === 0) { // Sessions
        value = totalSessions.toString();
      } else if (index === 1) { // Attendance
        const avgAttendance = sessionsRows.length > 0
          ? Math.round(sessionsRows.reduce((sum, row) => {
              const rate = parseInt(row.attendanceRate.replace('%', ''));
              return sum + rate;
            }, 0) / sessionsRows.length)
          : 0;
        value = avgAttendance > 0 ? avgAttendance.toString() : chart.value;
      } else if (index === 2) { // Rate
        const avgRate = sessionsRows.length > 0
          ? Math.round(sessionsRows.reduce((sum, row) => {
              const rate = parseInt(row.attendanceRate.replace('%', ''));
              return sum + rate;
            }, 0) / sessionsRows.length)
          : 0;
        value = avgRate > 0 ? avgRate.toString() : chart.value;
      }
      return {
        ...chart,
        value,
      };
    });

    return {
      revenue,
      summaryCards,
      smallCharts,
      sessionsTable: {
        ...analyticsData.sessionsTable,
        rows: sessionsRows,
      },
    };
  }, [filters]);


  return (
    <>

      {/* Revenue Card and Summary Cards */}
      <div className={styles.revenueAndSummaryContainer}>
        <div className={styles.revenueContainer}>
          <RevenueCard
            value={filteredData.revenue.value}
            chartData={filteredData.revenue.chart}
          />
        </div>

        {/* Summary Cards */}
        <div className={styles.summaryContainer}>
          {filteredData.summaryCards.map((card) => (
            <DashboardCard
              key={card.icon}
              icon={card.icon}
              label={card.label}
              value={card.value}
              percentage=""
            />
          ))}
        </div>
      </div>

      {/* Small Chart Cards */}
      <div className={styles.chartsContainer}>
        {filteredData.smallCharts.map((chart) => (
          <SmallChartCard
            key={chart.icon}
            icon={chart.icon}
            label={chart.label}
            value={chart.value}
            chartData={chart.chart}
          />
        ))}
      </div>

      {/* Sessions Table */}
      <div className={styles.tableContainer}>
        <SessionsTable
          columns={analyticsData.sessionsTable.columns}
          rows={filteredData.sessionsTable.rows}
        />
      </div>
    </>
  );
}
