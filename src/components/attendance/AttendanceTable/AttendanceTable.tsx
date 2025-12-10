'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  levels?: string[];
  modules?: string[];
  memberId?: string;
};

type SortField = 'name' | 'level' | 'module' | 'sessions' | 'working' | 'attendanceRate';
type SortDirection = 'asc' | 'desc';

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
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [showDetails, setShowDetails] = useState<{ name: string; type: 'level' | 'module'; items: string[]; position: { x: number; y: number } } | null>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Close sort menu and details when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setShowDetails(null);
      }
    };

    if (showSortMenu || showDetails) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortMenu, showDetails]);

  const sortOptions: { field: SortField; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'level', label: 'Level' },
    { field: 'module', label: 'Module' },
    { field: 'sessions', label: 'Sessions' },
    { field: 'working', label: 'Working' },
    { field: 'attendanceRate', label: 'Attendance Rate' },
  ];

  const sortedRows = useMemo(() => {
    if (!sortField) return rows;

    const sorted = [...rows].sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      // Convert numeric strings to numbers for proper sorting
      if (sortField === 'sessions' || sortField === 'working') {
        aValue = parseInt(aValue as string) || 0;
        bValue = parseInt(bValue as string) || 0;
      } else if (sortField === 'attendanceRate') {
        aValue = parseFloat((aValue as string).replace('%', '')) || 0;
        bValue = parseFloat((bValue as string).replace('%', '')) || 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [rows, sortField, sortDirection]);

  // Clean function: Group by member name and calculate averages
  const cleanedRows = useMemo(() => {
    if (!isCleaned) return sortedRows;

    const grouped = new Map<string, TableRow[]>();
    
    // Group rows by member name
    sortedRows.forEach((row) => {
      if (!grouped.has(row.name)) {
        grouped.set(row.name, []);
      }
      grouped.get(row.name)!.push(row);
    });

    // Process each group
    const cleaned: TableRow[] = [];
    grouped.forEach((memberRows, name) => {
      if (memberRows.length === 1) {
        cleaned.push(memberRows[0]);
      } else {
        // Calculate average attendance rate
        const avgRate = Math.round(
          memberRows.reduce((sum, row) => {
            const rate = parseFloat(row.attendanceRate.replace('%', ''));
            return sum + rate;
          }, 0) / memberRows.length
        );

        // Collect all unique levels and modules
        const levels = [...new Set(memberRows.map(row => row.level))];
        const modules = [...new Set(memberRows.map(row => row.module))];

        // Sum sessions and working
        const totalSessions = memberRows.reduce((sum, row) => sum + parseInt(row.sessions), 0);
        const totalWorking = memberRows.reduce((sum, row) => sum + parseInt(row.working), 0);

        // Use first row as base and update with aggregated data
        cleaned.push({
          ...memberRows[0],
          level: levels[0],
          module: modules[0],
          sessions: totalSessions.toString(),
          working: totalWorking.toString(),
          attendanceRate: `${avgRate}%`,
          levels,
          modules,
        });
      }
    });

    return cleaned;
  }, [sortedRows, isCleaned]);

  const displayRows = isCleaned ? cleanedRows : sortedRows;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setShowSortMenu(false);
  };

  const handleCleanClick = () => {
    setIsCleaned(!isCleaned);
    setShowDetails(null);
  };

  const handleEyeClick = (e: React.MouseEvent, row: TableRow, type: 'level' | 'module') => {
    e.stopPropagation();
    const items = type === 'level' ? row.levels || [] : row.modules || [];
    if (items.length > 1) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setShowDetails({ 
        name: row.name, 
        type, 
        items,
        position: { x: rect.left, y: rect.bottom + 8 }
      });
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
        <div className={styles.titleSection}>
          <Image src={icon} alt={title} width={20} height={20} />
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.actions}>
          <div className={styles.sortContainer} ref={sortMenuRef}>
            <button 
              className={styles.sortButton}
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M7 12h10M11 18h2" />
              </svg>
              <span>Sort By</span>
              {sortField && (
                <span className={styles.sortIndicator}>
                  ({sortOptions.find(opt => opt.field === sortField)?.label} {sortDirection === 'asc' ? '↑' : '↓'})
                </span>
              )}
            </button>
            {showSortMenu && (
              <div className={styles.sortMenu}>
                {sortOptions.map((option) => (
                  <button
                    key={option.field}
                    className={`${styles.sortOption} ${sortField === option.field ? styles.active : ''}`}
                    onClick={() => handleSort(option.field)}
                  >
                    {option.label}
                    {sortField === option.field && (
                      <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            className={`${styles.cleanButton} ${isCleaned ? styles.active : ''}`}
            onClick={handleCleanClick}
            title="Clean duplicate members"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
              <circle cx="7" cy="7" r="1" fill="currentColor" />
              <circle cx="9" cy="5" r="0.5" fill="currentColor" />
              <circle cx="11" cy="3" r="0.5" fill="currentColor" />
            </svg>
            <span>Clean</span>
          </button>
        </div>
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
            {displayRows.map((row) => (
              <tr key={row.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.nameCell}>
                    <div className={styles.avatar}>
                      <Image src="/icons/members.svg" alt="Member" width={16} height={16} />
                    </div>
                    <span>{row.name}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.levelModuleCell}>
                    {isCleaned && row.levels && row.levels.length > 1 ? (
                      <button
                        className={styles.eyeButton}
                        onClick={(e) => handleEyeClick(e, row, 'level')}
                        title={`View all levels: ${row.levels.join(', ')}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    ) : (
                      <span>{row.level}</span>
                    )}
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.levelModuleCell}>
                    {isCleaned && row.modules && row.modules.length > 1 ? (
                      <button
                        className={styles.eyeButton}
                        onClick={(e) => handleEyeClick(e, row, 'module')}
                        title={`View all modules: ${row.modules.join(', ')}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    ) : (
                      <span>{row.module}</span>
                    )}
                  </div>
                </td>
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

      {/* Details Tooltip */}
      {showDetails && (
        <div 
          className={styles.detailsTooltip} 
          ref={detailsRef}
          style={{
            top: `${showDetails.position.y}px`,
            left: `${showDetails.position.x}px`,
          }}
        >
          <div className={styles.detailsHeader}>
            <span className={styles.detailsTitle}>
              {showDetails.name} - All {showDetails.type === 'level' ? 'Levels' : 'Modules'}
            </span>
            <button
              className={styles.closeButton}
              onClick={() => setShowDetails(null)}
            >
              ×
            </button>
          </div>
          <div className={styles.detailsContent}>
            {showDetails.items.map((item, index) => (
              <span key={index} className={styles.detailsItem}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

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

