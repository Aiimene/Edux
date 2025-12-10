'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './FilterBy.module.css';

type FilterByProps = {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  label?: string;
};

const FilterBy: React.FC<FilterByProps> = ({ options, selectedOption, onSelect, label = 'Filter By' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={label}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span>{label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <button
              key={option}
              className={`${styles.option} ${selectedOption === option ? styles.selected : ''}`}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBy;

