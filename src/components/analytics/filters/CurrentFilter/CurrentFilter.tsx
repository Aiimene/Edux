'use client';

import React from 'react';
import styles from './CurrentFilter.module.css';

type CurrentFilterProps = {
  filterText: string;
  onClear?: () => void;
};

const CurrentFilter: React.FC<CurrentFilterProps> = ({ filterText, onClear }) => {
  return (
    <div className={styles.container}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
      </svg>
      <span className={styles.text}>{filterText}</span>
      {onClear && (
        <button
          className={styles.clearButton}
          onClick={onClear}
          aria-label="Clear filter"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default CurrentFilter;

