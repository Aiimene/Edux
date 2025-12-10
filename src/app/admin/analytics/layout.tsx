'use client';

import React, { createContext, useContext, useState } from "react";
import Image from "next/image";
import enterpriseData from "../../../data/enterprise.json";
import DashboardTop from "../../../components/dashboard/DashboardTop/DashboardTop";
import FilterBy from "../../../components/analytics/filters/FilterBy/FilterBy";
import DateRangePicker from "../../../components/analytics/filters/DateRangePicker/DateRangePicker";
import CurrentFilter from "../../../components/analytics/filters/CurrentFilter/CurrentFilter";
import analyticsData from "../../../data/analytics.json";
import { useSidebar } from "../../../contexts/SidebarContext";
import styles from "./layout.module.css";

type FilterState = {
  level: string;
  module: string;
  subject: string;
  teacher: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
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
    module: 'All Modules',
    subject: 'All Subjects',
    teacher: 'All Teachers',
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

  const handleTeacherChange = (teacher: string) => {
    setFilters((prev) => ({ ...prev, teacher }));
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
    if (filters.teacher !== 'All Teachers') {
      parts.push(filters.teacher);
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
      teacher: 'All Teachers',
      dateRange: 'This Week',
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <DashboardTop onMenuClick={toggle} />
      <div className={styles.container}>
        {/* Greeting Section with Filters on the right */}
        <div className={styles.greetingAndFiltersContainer}>
          <div className={styles.greetingSection}>
            <p className={styles.greetingText}>Hello</p>
            <Image src="/icons/hello.svg" alt="hello" width={45} height={45} className={styles.greetingIcon} />
            <p className={styles.enterpriseName}>{enterpriseData.name}</p>
          </div>
          
          {/* Filters Section - Right of Welcome */}
          <div className={styles.filtersSection}>
            <FilterBy
              options={analyticsData.filters.levels}
              selectedOption={filters.level}
              onSelect={handleLevelChange}
              label="Level"
            />
            <FilterBy
              options={analyticsData.filters.modules}
              selectedOption={filters.module}
              onSelect={handleModuleChange}
              label="Module"
            />
            <FilterBy
              options={analyticsData.filters.subjects}
              selectedOption={filters.subject}
              onSelect={handleSubjectChange}
              label="Subject"
            />
            <FilterBy
              options={analyticsData.filters.teachers}
              selectedOption={filters.teacher}
              onSelect={handleTeacherChange}
              label="Teacher"
            />
            <DateRangePicker
              onDateRangeSelect={handleDateRangeSelect}
              startDate={filters.startDate}
              endDate={filters.endDate}
            />
            <CurrentFilter
              filterText={getCurrentFilterText()}
              onClear={clearFilters}
            />
          </div>
        </div>
        <p className={styles.subtitle}>Track everything from one place</p>
        {children}
      </div>
    </FilterContext.Provider>
  );
}

