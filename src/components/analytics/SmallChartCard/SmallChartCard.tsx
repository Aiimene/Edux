'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './SmallChartCard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type SmallChartCardProps = {
  icon: string;
  label: string;
  value: string;
  chartData: {
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; borderDash?: number[]; }[];
  };
};

const SmallChartCard: React.FC<SmallChartCardProps> = ({ icon, label, value, chartData }) => {
  const chartDataFormatted = {
    labels: chartData.labels,
    datasets: chartData.datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor,
      backgroundColor: dataset.borderColor === '#222' ? '#222' : '#7AB2F980',
      fill: false,
      tension: 0.1,
      ...(dataset.borderDash && { borderDash: dataset.borderDash }),
    })),
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={`/icons/${icon}.svg`} alt={label} width={20} height={20} />
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>{value}</div>
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
                  maxTicksLimit: 4,
                  callback: function(value) {
                    return value + ' Hours';
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
                  maxTicksLimit: 5
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default SmallChartCard;

