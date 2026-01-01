'use client';

import React, { useEffect, useState, useMemo } from 'react';
import DashboardCard from '../../../components/dashboard/DashboardCard/DashboardCard';
import RevenueCard from '../../../components/analytics/RevenueCard/RevenueCard';
import SmallChartCard from '../../../components/analytics/SmallChartCard/SmallChartCard';
import SessionsTable from '../../../components/analytics/SessionsTable/SessionsTable';
import { useFilters } from './layout';
import { getAnalytics } from '../../../lib/api/dashboard';
import styles from './page.module.css';

interface AnalyticsData {
  revenue: {
    value: string;
    chart: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        borderColor: string;
        borderDash?: number[];
      }>;
    };
  };
  summaryCards: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  smallCharts: Array<{
    icon: string;
    label: string;
    value: string;
    chart: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        borderColor: string;
        borderDash?: number[];
      }>;
    };
  }>;
  sessionsTable: {
    columns: string[];
    rows: Array<{
      sessionId: string;
      teacher: string;
      counts: string;
      attendanceRate: string;
      revenue: string;
      date: string;
      level: string;
      module: string;
      subject: string;
    }>;
  };
}

export default function AnalyticsPage() {
  const { filters } = useFilters();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert date range filter to startDate/endDate if needed
  const getDateRange = useMemo(() => {
    if (filters.startDate && filters.endDate) {
      return {
        startDate: filters.startDate,
        endDate: filters.endDate,
      };
    }
    
    // Handle predefined date ranges
    const now = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (filters.dateRange === 'This Week') {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
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

    return { startDate, endDate };
  }, [filters.dateRange, filters.startDate, filters.endDate]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const analyticsFilters = {
          level: filters.level,
          module: filters.module,
          subject: filters.subject,
          teacher: filters.teacher,
          ...getDateRange,
        };

        const response = await getAnalytics(analyticsFilters);
        
        // Debug: Log the response to verify it's coming from backend
        console.log('Analytics API Response:', JSON.stringify(response, null, 2));
        console.log('Revenue Chart Data:', response?.revenue?.chart);
        console.log('Revenue Chart Datasets:', response?.revenue?.chart?.datasets);
        console.log('Small Charts Data:', response?.smallCharts);
        
        // Validate and ensure we have valid data structure from backend
        if (response && response.revenue && response.revenue.chart) {
          // Verify chart data has datasets with data arrays
          const revenueChartValid = response.revenue.chart.datasets && 
            Array.isArray(response.revenue.chart.datasets) &&
            response.revenue.chart.datasets.length > 0 &&
            response.revenue.chart.datasets[0].data &&
            Array.isArray(response.revenue.chart.datasets[0].data);
          
          const smallChartsValid = response.smallCharts &&
            Array.isArray(response.smallCharts) &&
            response.smallCharts.length > 0 &&
            response.smallCharts.every(chart => 
              chart.chart && 
              chart.chart.datasets && 
              Array.isArray(chart.chart.datasets) &&
              chart.chart.datasets.length > 0
            );
          
          if (revenueChartValid && smallChartsValid) {
            console.log('✅ Valid chart data received from backend');
            setData(response);
          } else {
            console.error('❌ Invalid chart data structure:', {
              revenueChartValid,
              smallChartsValid,
              revenueChart: response.revenue?.chart,
              smallCharts: response.smallCharts
            });
            setError('Invalid chart data structure received from server.');
          }
        } else {
          console.error('❌ Invalid response structure:', response);
          setError('Invalid data structure received from server.');
        }
      } catch (err: any) {
        console.error('Failed to fetch analytics data:', err);
        setError(err.message || 'Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [filters.level, filters.module, filters.subject, filters.teacher, getDateRange]);


  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading analytics data...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#e74c3c', fontSize: '1.1rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      {/* Revenue Card and Summary Cards */}
      <div className={styles.revenueAndSummaryContainer}>
        <div className={styles.revenueContainer}>
          <RevenueCard
            value={data.revenue.value}
            chartData={data.revenue.chart}
          />
        </div>

        {/* Summary Cards */}
        <div className={styles.summaryContainer}>
          {data.summaryCards.map((card) => (
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
        {data.smallCharts.map((chart) => (
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
          columns={data.sessionsTable.columns}
          rows={data.sessionsTable.rows}
        />
      </div>
    </>
  );
}
