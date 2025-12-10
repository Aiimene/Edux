'use client';

import React from 'react';
import Image from 'next/image';
import styles from './AttendanceTable.module.css';

type TableRow = {
  id: string;
  name: string;
  level: string;
  module: string;
  sessions: string;
  working: string;
  attendanceRate: string;
};

type AttendanceTableProps = {
  title: string;
  icon: string;
  columns: string[];
  rows: TableRow[];
  onSeeAll?: () => void;
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  title,
  icon,
  columns,
  rows,
  onSeeAll,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Image src={icon} alt={title} width={20} height={20} />
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.actions}>
          <button className={styles.sortButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M7 12h10M11 18h2" />
            </svg>
            <span>Sort By</span>
          </button>
          <button className={styles.filterButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={styles.th}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.nameCell}>
                    <div className={styles.avatar}>
                      <Image src="/icons/members.svg" alt="Member" width={16} height={16} />
                    </div>
                    <span>{row.name}</span>
                  </div>
                </td>
                <td className={styles.td}>{row.level}</td>
                <td className={styles.td}>{row.module}</td>
                <td className={styles.td}>{row.sessions}</td>
                <td className={styles.td}>{row.working}</td>
                <td className={styles.td}>
                  <span className={styles.attendanceRate}>{row.attendanceRate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onSeeAll && (
        <div className={styles.footer}>
          <button className={styles.seeAllButton} onClick={onSeeAll}>
            See all →
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;

