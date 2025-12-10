import React from 'react';
import Image from 'next/image';
import styles from './SessionsTable.module.css';

type SessionRow = {
  sessionId: string;
  teacher: string;
  counts: string;
  attendanceRate: string;
  revenue: string;
};

type SessionsTableProps = {
  columns: string[];
  rows: SessionRow[];
};

const SessionsTable: React.FC<SessionsTableProps> = ({ columns, rows }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src="/icons/sessions.svg" alt="Sessions" width={22} height={22} />
        <h3 className={styles.title}>Sessions</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={styles.th}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className={styles.tr}>
                <td className={styles.td}>{row.sessionId}</td>
                <td className={styles.td}>
                  <div className={styles.teacherCell}>
                    <Image src="/icons/profile.svg" alt="Teacher" width={24} height={24} className={styles.avatar} />
                    <span>{row.teacher}</span>
                  </div>
                </td>
                <td className={styles.td}>{row.counts}</td>
                <td className={styles.td}>{row.attendanceRate}</td>
                <td className={styles.td}>{row.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a href="#" className={styles.seeMore}>
        See more... <img src="/icons/refresh.svg" alt="Refresh" width={16} height={16} />
      </a>
    </div>
  );
};

export default SessionsTable;

