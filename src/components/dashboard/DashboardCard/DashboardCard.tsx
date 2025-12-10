import React from 'react';
import styles from './Dashboard.module.css';

type DashboardCardProps = {
  icon: string; // Expected SVG file name without .svg (e.g., 'attendance_rate')
  label: string;
  value: string | number;
  percentage?: string;
  iconAlt?: string;
  iconSize?: number;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  label,
  value,
  percentage,
  iconAlt = '',
  iconSize,
}) => (
  <div className={styles.card}>
    <div className={styles.topRow}>
      <img
        src={`/icons/${icon}.svg`}
        alt={iconAlt || label}
        width={iconSize ?? 24}
        height={iconSize ?? 24}
        className={styles.icon}
      />
      <div className={styles.labelTop}>{label}</div>
    </div>
    <div className={styles.value}>{value}</div>
    {percentage !== undefined && (
      <div className={styles.percentWrapper}>
        {percentage}
        <img src="/icons/up.svg" alt="Arrow Up" width={18} height={18} />
      </div>
    )}
  </div>
);

export default DashboardCard;

