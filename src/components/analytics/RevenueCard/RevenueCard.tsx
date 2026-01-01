'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './RevenueCard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type RevenueCardProps = {
  value: string;
  chartData: {
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; borderDash?: number[]; }[];
  };
};

const RevenueCard: React.FC<RevenueCardProps> = ({ value, chartData }) => {
  // Validate chartData is provided and has required structure
  if (!chartData || !chartData.labels || !chartData.datasets || !Array.isArray(chartData.datasets)) {
    console.error('RevenueCard: Invalid chartData prop:', chartData);
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title}>Revenue</span>
          <span className={styles.value}>{value || 'N/A'}</span>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          No chart data available
        </div>
      </div>
    );
  }

  const chartDataFormatted = {
    labels: chartData.labels || [],
    datasets: chartData.datasets.map((dataset) => ({
      label: dataset.label || '',
      data: Array.isArray(dataset.data) ? dataset.data : [],
      borderColor: dataset.borderColor || '#222',
      backgroundColor: dataset.borderColor === '#222' ? '#222' : '#7AB2F980',
      fill: false,
      tension: 0.1,
      ...(dataset.borderDash && { borderDash: dataset.borderDash }),
    })),
  };

  console.log('RevenueCard: Rendering chart with data:', {
    labels: chartDataFormatted.labels,
    datasets: chartDataFormatted.datasets.map(d => ({ label: d.label, dataLength: d.data.length, data: d.data }))
  });

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Revenue</span>
        <span className={styles.value}>{value}</span>
      </div>
      <div className={styles.chart}>
        <Line
          data={chartDataFormatted}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            },
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                  maxRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 6,
                  callback: function(value) {
                    return value + ' K DZD';
                  }
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  maxRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 8
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default RevenueCard;

