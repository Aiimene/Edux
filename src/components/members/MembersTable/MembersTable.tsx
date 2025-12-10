'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './MembersTable.module.css';

export type Column<T = any> = {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
};

type MembersTableProps<T = any> = {
  data: T[];
  columns: Column<T>[];
  onEdit?: (id: string, row: T) => void;
  onViewProfile?: (id: string, row: T) => void;
  onDelete?: (id: string, row: T) => void;
  getId: (row: T) => string;
  emptyMessage?: string;
};

export default function MembersTable<T = any>({
  data,
  columns,
  onEdit,
  onViewProfile,
  onDelete,
  getId,
  emptyMessage = 'No data available',
}: MembersTableProps<T>) {
  const [showAll, setShowAll] = useState(false);
  const displayLimit = 8;
  const shouldShowSeeAll = data.length > displayLimit && !showAll;
  const shouldShowLess = data.length > displayLimit && showAll;
  const displayData = showAll ? data : data.slice(0, displayLimit);

  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={styles.headerCell}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </th>
            ))}
            {(onEdit || onViewProfile || onDelete) && (
              <th className={styles.headerCell} style={{ width: '120px' }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, index) => {
            const id = getId(row);
            const isEven = index % 2 === 0;
            return (
              <tr
                key={id}
                className={`${styles.row} ${isEven ? styles.rowEven : styles.rowOdd}`}
                onClick={() => onViewProfile ? onViewProfile(id, row) : undefined}
                style={{ cursor: onViewProfile ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <td key={column.key} className={styles.cell}>
                    {column.render
                      ? column.render((row as any)[column.key], row)
                      : (row as any)[column.key] ?? '-'}
                  </td>
                ))}
                {(onEdit || onViewProfile || onDelete) && (
                  <td className={styles.actionCell}>
                    <div className={styles.actionButtons}>
                      {onViewProfile && (
                        <button
                          className={styles.actionButton}
                          onClick={(e) => { e.stopPropagation(); onViewProfile(id, row); }}
                          title="View Profile"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                      )}
                      {onEdit && (
                        <button
                          className={styles.actionButton}
                          onClick={(e) => { e.stopPropagation(); onEdit(id, row); }}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={(e) => { e.stopPropagation(); onDelete(id, row); }}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {(shouldShowSeeAll || shouldShowLess) && (
        <div className={styles.buttonContainer}>
          {shouldShowSeeAll && (
            <button className={styles.toggleButton} onClick={() => setShowAll(true)}>
              <span>See All</span>
            
            </button>
          )}
          {shouldShowLess && (
            <button className={styles.toggleButton} onClick={() => setShowAll(false)}>
              <span>Show Less</span>
        
            </button>
          )}
        </div>
      )}
    </div>
  );
}

