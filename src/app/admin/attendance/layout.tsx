'use client';

import React, { createContext, useContext, useState } from "react";
import Image from "next/image";
import enterpriseData from "../../../data/enterprise.json";
import FilterBy from "../../../components/analytics/filters/FilterBy/FilterBy";
import DateRangePicker from "../../../components/analytics/filters/DateRangePicker/DateRangePicker";
import CurrentFilter from "../../../components/analytics/filters/CurrentFilter/CurrentFilter";
import attendanceData from "../../../data/attendance.json";
import styles from "./layout.module.css";

type FilterState = {
  level: string;
  module: string;
  subject: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
};

type FilterContextType = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useAttendanceFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useAttendanceFilters must be used within AttendanceLayout');
  }
  return context;
};

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<FilterState>({
    level: 'All Levels',
    module: 'All Modules',
    subject: 'All Subjects',
    dateRange: 'This Week',
  });

  const handleLevelChange = (level: string) => {
    setFilters((prev) => ({ ...prev, level }));
  };

  const handleModuleChange = (module: string) => {
    setFilters((prev) => ({ ...prev, module }));
  };

  const handleSubjectChange = (subject: string) => {
    setFilters((prev) => ({ ...prev, subject }));
  };

  const handleDateRangeSelect = (startDate: string, endDate: string) => {
    setFilters((prev) => ({ ...prev, startDate, endDate, dateRange: 'Custom' }));
  };

  const getCurrentFilterText = () => {
    const parts = [];
    if (filters.level !== 'All Levels') {
      parts.push(filters.level);
    }
    if (filters.module !== 'All Modules') {
      parts.push(filters.module);
    }
    if (filters.subject !== 'All Subjects') {
      parts.push(filters.subject);
    }
    if (filters.dateRange === 'Custom' && filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      parts.push(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
    } else if (filters.dateRange !== 'This Week') {
      parts.push(filters.dateRange);
    }
    return parts.length > 0 ? parts.join(' • ') : 'This Week';
  };

  const clearFilters = () => {
    setFilters({
      level: 'All Levels',
      module: 'All Modules',
      subject: 'All Subjects',
      dateRange: 'This Week',
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <div className={styles.container}>
        {/* Current Filter Section */}
        <div className={styles.currentFilterSection}>
          <div className={styles.currentFilterText}>
            <span>Current Filter: </span>
            <span className={styles.filterValue}>{getCurrentFilterText()}</span>
          </div>
          <div className={styles.filterControls}>
            <FilterBy
              options={attendanceData.filters.levels}
              selectedOption={filters.level}
              onSelect={handleLevelChange}
              label="Filter By"
            />
            <FilterBy
              options={attendanceData.filters.subjects}
              selectedOption={filters.subject}
              onSelect={handleSubjectChange}
              label="Subject"
            />
            <DateRangePicker
              onDateRangeSelect={handleDateRangeSelect}
              startDate={filters.startDate}
              endDate={filters.endDate}
            />
            <CurrentFilter
              filterText={filters.dateRange}
              onClear={clearFilters}
            />
          </div>
        </div>
        {children}
      </div>
    </FilterContext.Provider>
  );
}

