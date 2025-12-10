import DashboardCard from '../../../components/dashboard/DashboardCard/DashboardCard';
import RevenueCard from '../../../components/analytics/RevenueCard/RevenueCard';
import SmallChartCard from '../../../components/analytics/SmallChartCard/SmallChartCard';
import SessionsTable from '../../../components/analytics/SessionsTable/SessionsTable';
import analyticsData from '../../../data/analytics.json';
import styles from './page.module.css';

export default function AnalyticsPage() {
  return (
    <>
      {/* Revenue Card and Summary Cards */}
      <div className={styles.revenueAndSummaryContainer}>
        <div className={styles.revenueContainer}>
          <RevenueCard
            value={analyticsData.revenue.value}
            chartData={analyticsData.revenue.chart}
          />
        </div>

        {/* Summary Cards */}
        <div className={styles.summaryContainer}>
          {analyticsData.summaryCards.map((card) => (
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
        {analyticsData.smallCharts.map((chart) => (
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
          rows={analyticsData.sessionsTable.rows}
        />
      </div>
    </>
  );
}

