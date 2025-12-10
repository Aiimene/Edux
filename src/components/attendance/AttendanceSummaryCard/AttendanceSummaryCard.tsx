'use client';

import React from 'react';
import Image from 'next/image';
import styles from './AttendanceSummaryCard.module.css';

type AttendanceSummaryCardProps = {
  title: string;
  percentage: string;
  trend: string;
  trendDirection: 'up' | 'down';
};

const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
  title,
  percentage,
  trend,
  trendDirection,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M7 12l4-4 4 4 6-6" />
        </svg>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.percentage}>{percentage}</div>
        <div className={`${styles.trend} ${styles[trendDirection]}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {trendDirection === 'up' ? (
              <polyline points="18 15 12 9 6 15"></polyline>
            ) : (
              <polyline points="6 9 12 15 18 9"></polyline>
            )}
          </svg>
          <span>{trend}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryCard;

