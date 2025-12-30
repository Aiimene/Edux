'use client';

import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './Chart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type BarChartData = {
  labels: string[];
  datasets: { label: string; data: number[]; borderDash?: number[]; }[];
};

type ChartType = 'bar' | 'line' | 'mixed';

type ChartProps = {
  type: ChartType;
  data: BarChartData;
  title: string;
  seeDetailsUrl?: string;
};

const Chart: React.FC<ChartProps> = ({ type, data, title, seeDetailsUrl }) => {
  // Static colors for bar chart
  const barChartBackgroundColor = '#D3EAFF';
  
  // Static colors for line chart
  const lineChartColors = [
    {
      borderColor: '#7AB2F9',
      backgroundColor: '#7AB2F980',
    },
    {
      borderColor: '#222',
      backgroundColor: '#222',
    },
  ];

  // Defensive: If data or datasets are missing, show fallback
  const showChart = data && Array.isArray(data.labels) && Array.isArray(data.datasets) && data.labels.length > 0 && data.datasets.length > 0;

  // Transform data to add static colors and properties
  const chartData = {
    labels: data && Array.isArray(data.labels) ? data.labels : [],
    datasets: Array.isArray(data?.datasets)
      ? data.datasets.map((dataset, index) => {
          if (type === 'bar') {
            return {
              label: dataset.label,
              data: dataset.data,
              backgroundColor: barChartBackgroundColor,
              borderRadius: 11,
            };
          }
          if (type === 'line') {
            const colors = lineChartColors[index] || lineChartColors[0];
            return {
              label: dataset.label,
              data: dataset.data,
              borderColor: colors.borderColor,
              backgroundColor: colors.backgroundColor,
              fill: false,
              tension: 0.1, // Creates smooth curves (0 = straight lines, 1 = very curved)
              ...(dataset.borderDash && { borderDash: dataset.borderDash }),
            };
          }
          return dataset;
        })
      : [],
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src="/icons/classes_ranking.svg" alt="icon" width={18} height={18} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.chart}>
        {showChart ? (
          type === 'bar' ? (
            <Bar 
              data={chartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
                plugins: { legend: { display: false }, title: { display: true, text: title } },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { display: true, color: 'rgba(0, 0, 0, 0.05)' },
                    title: { display: true, text: 'Y Axis' },
                    ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6 }
                  },
                  x: {
                    grid: { display: false },
                    title: { display: true, text: 'X Axis' },
                    ticks: { maxRotation: 45, minRotation: 0, autoSkip: true, maxTicksLimit: 8 }
                  }
                }
              }} 
            />
          ) : type === 'line' ? (
            <Line 
              data={chartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
                plugins: { legend: { display: false }, title: { display: true, text: title } },
                elements: { line: { tension: 0 } },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { display: true, color: 'rgba(0, 0, 0, 0.05)' },
                    title: { display: true, text: 'Y Axis' },
                    ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6 }
                  },
                  x: {
                    grid: { display: false },
                    title: { display: true, text: 'X Axis' },
                    ticks: { maxRotation: 45, minRotation: 0, autoSkip: true, maxTicksLimit: 8 }
                  }
                }
              }} 
            />
          ) : null
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Only show the title and card, no axes or axis labels */}
            <div style={{ position: 'absolute', top: 16, left: 16, fontWeight: 500 }}>{title}</div>
            <div style={{ position: 'absolute', top: 48, left: 16 }}>Chart data unavailable</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;