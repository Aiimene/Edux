'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './DateRangePicker.module.css';

type DateRangePickerProps = {
  onDateRangeSelect: (startDate: string, endDate: string) => void;
  startDate?: string;
  endDate?: string;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeSelect, startDate, endDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setLocalStartDate(newStartDate);
    if (newStartDate && localEndDate) {
      onDateRangeSelect(newStartDate, localEndDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setLocalEndDate(newEndDate);
    if (localStartDate && newEndDate) {
      onDateRangeSelect(localStartDate, newEndDate);
    }
  };

  const handleApply = () => {
    if (localStartDate && localEndDate) {
      onDateRangeSelect(localStartDate, localEndDate);
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.container} ref={pickerRef}>
      <button
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select date range"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.picker}>
          <div className={styles.dateInputs}>
            <div className={styles.dateInputGroup}>
              <label className={styles.label}>Start Date</label>
              <input
                type="date"
                value={localStartDate}
                onChange={handleStartDateChange}
                className={styles.input}
                max={localEndDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className={styles.dateInputGroup}>
              <label className={styles.label}>End Date</label>
              <input
                type="date"
                value={localEndDate}
                onChange={handleEndDateChange}
                className={styles.input}
                min={localStartDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <button className={styles.applyButton} onClick={handleApply} disabled={!localStartDate || !localEndDate}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

