import React from 'react';
import styles from './Dashboard.module.css';

type DashboardCardProps = {
  icon: string; // Expected SVG file name without .svg (e.g., 'attendance_rate')
  label: string;
  value: string | number;
  percentage: string;
  iconAlt?: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  label,
  value,
  percentage,
  iconAlt = '',
}) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <img
        src={`/icons/${icon}.svg`}
        alt={iconAlt || label}
        width={32}
        height={32}
      />
      <span className={styles.label}>{label}</span>
    </div>
    <div className={styles.value}>{value}</div>
    <div className={styles.percentWrapper}>
      {percentage}
      <img src="/icons/up.svg" alt="Arrow Up" width={18} height={18} />
    </div>
  </div>
);

export default DashboardCard;

