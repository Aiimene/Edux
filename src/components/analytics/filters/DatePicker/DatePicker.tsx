'use client';

import React, { useState } from 'react';
import styles from './DatePicker.module.css';

type DatePickerProps = {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
};

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect, selectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    onDateSelect(newDate);
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select date"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <text x="12" y="18" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">31</text>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.picker}>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className={styles.input}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;

