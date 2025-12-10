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
    let revenue = analyticsData.revenue;
    let summaryCards = analyticsData.summaryCards;
    let sessionsRows = analyticsData.sessionsTable.rows;

    // Filter by level
    if (filters.level !== 'All Levels') {
      if (revenue.dataByLevel && revenue.dataByLevel[filters.level as keyof typeof revenue.dataByLevel]) {
        revenue = {
          ...revenue,
          ...revenue.dataByLevel[filters.level as keyof typeof revenue.dataByLevel],
        };
      }

      summaryCards = summaryCards.map((card) => ({
        ...card,
        value: card.dataByLevel?.[filters.level as keyof typeof card.dataByLevel] || card.value,
      }));

      sessionsRows = sessionsRows.filter((row) => row.level === filters.level);
    }

    // Filter by date (if date is selected)
    if (filters.selectedDate) {
      sessionsRows = sessionsRows.filter((row) => row.date === filters.selectedDate);
    }

    return {
      revenue,
      summaryCards,
      smallCharts: analyticsData.smallCharts,
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
