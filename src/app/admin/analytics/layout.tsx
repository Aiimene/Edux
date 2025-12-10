'use client';

import React, { createContext, useContext, useState } from "react";
import Image from "next/image";
import enterpriseData from "../../../data/enterprise.json";
import DashboardTop from "../../../components/dashboard/DashboardTop/DashboardTop";
import FilterBy from "../../../components/analytics/filters/FilterBy/FilterBy";
import DatePicker from "../../../components/analytics/filters/DatePicker/DatePicker";
import CurrentFilter from "../../../components/analytics/filters/CurrentFilter/CurrentFilter";
import analyticsData from "../../../data/analytics.json";
import { useSidebar } from "../../../hooks/useSidebar";
import styles from "./layout.module.css";

type FilterState = {
  level: string;
  dateRange: string;
  selectedDate?: string;
};

type FilterContextType = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within AnalyticsLayout');
  }
  return context;
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggle } = useSidebar();
  const [filters, setFilters] = useState<FilterState>({
    level: 'All Levels',
    dateRange: 'This Week',
  });

  const handleLevelChange = (level: string) => {
    setFilters((prev) => ({ ...prev, level }));
  };

  const handleDateSelect = (date: string) => {
    setFilters((prev) => ({ ...prev, selectedDate: date, dateRange: 'Custom' }));
  };

  const getCurrentFilterText = () => {
    const parts = [];
    if (filters.level !== 'All Levels') {
      parts.push(filters.level);
    }
    if (filters.dateRange === 'Custom' && filters.selectedDate) {
      const date = new Date(filters.selectedDate);
      parts.push(date.toLocaleDateString());
    } else if (filters.dateRange !== 'This Week') {
      parts.push(filters.dateRange);
    }
    return parts.length > 0 ? parts.join(' • ') : 'This Week';
  };

  const clearFilters = () => {
    setFilters({
      level: 'All Levels',
      dateRange: 'This Week',
      selectedDate: undefined,
    });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <DashboardTop onMenuClick={toggle} />
      <div className={styles.container}>
        {/* Filters Section - Before Welcome */}
        <div className={styles.filtersSection}>
          <FilterBy
            options={analyticsData.filters.levels}
            selectedOption={filters.level}
            onSelect={handleLevelChange}
            label="Filter By"
          />
          <DatePicker
            onDateSelect={handleDateSelect}
            selectedDate={filters.selectedDate}
          />
          <CurrentFilter
            filterText={getCurrentFilterText()}
            onClear={clearFilters}
          />
        </div>

        {/* Greeting Section */}
        <div className={styles.greetingSection}>
          <p className={styles.greetingText}>Hello</p>
          <Image src="/icons/hello.svg" alt="hello" width={45} height={45} className={styles.greetingIcon} />
          <p className={styles.enterpriseName}>{enterpriseData.name}</p>
        </div>
        <p className={styles.subtitle}>Track everything from one place</p>
        {children}
      </div>
    </FilterContext.Provider>
  );
}

