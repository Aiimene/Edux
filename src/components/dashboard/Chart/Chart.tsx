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
  datasets: { label: string; data: number[]; backgroundColor?: string; borderColor?: string; type?: string; fill?: boolean; borderDash?: number[]; }[];
};

type ChartType = 'bar' | 'line' | 'mixed';

type ChartProps = {
  type: ChartType;
  data: BarChartData;
  title: string;
  seeDetailsUrl?: string;
};

const Chart: React.FC<ChartProps> = ({ type, data, title, seeDetailsUrl }) => {
  // Transform data to remove 'type' property from datasets for Chart.js compatibility
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(({ type: _, ...dataset }) => {
      if (type === 'bar') {
        return {
          ...dataset,
          borderRadius: 11,
        };
      }
      if (type === 'line') {
        return {
          ...dataset,
          tension: 0.1, // Creates smooth curves (0 = straight lines, 1 = very curved)
        };
      }
      return dataset;
    }),
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src="/icons/classes_ranking.svg" alt="icon" width={18} height={18} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.chart}>
        {
          type === 'bar' ? (
            <Bar 
              data={chartData} 
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
                      maxTicksLimit: 6
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      maxRotation: 45,
                      minRotation: 0,
                      autoSkip: true,
                      maxTicksLimit: 8
                    }
                  }
                }
              }} 
            />
          )
          : type === 'line' ? (
            <Line 
              data={chartData} 
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
                      maxTicksLimit: 6
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      maxRotation: 45,
                      minRotation: 0,
                      autoSkip: true,
                      maxTicksLimit: 8
                    }
                  }
                }
              }} 
            />
          )
          : null
        }
      </div>
      <a href={seeDetailsUrl} className={styles.details}>
        See Details&nbsp; <img src="/icons/arrow-right.svg" alt="arrow" width={16} height={16} />
      </a>
    </div>
  );
};

export default Chart;

