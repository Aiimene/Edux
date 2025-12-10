'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MembersTable, { Column } from '../../../../../components/members/MembersTable/MembersTable';
import DashboardCard from '../../../../../components/dashboard/DashboardCard/DashboardCard';
import AddStudentModal from '../../../../../components/students/AddStudentModal/AddStudentModal';
import EditStudentModal from '../../../../../components/students/EditStudentModal/EditStudentModal';
import StudentProfileModal from '../../../../../components/students/StudentProfileModal/StudentProfileModal';
import ConfirmModal from '../../../../../components/UI/ConfirmModal/ConfirmModal';
import enterpriseData from '../../../../../data/enterprise.json';
import styles from './page.module.css';

type Student = {
  id: string;
  studentName: string;
  level: string;
  module: string;
  sessions: number;
  email: string;
  parentName: string;
  feePayment: number;
};

export default function StudentListPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedStudentRow, setSelectedStudentRow] = useState<any>(null);
  const [isMonthPopupOpen, setIsMonthPopupOpen] = useState(false);
  const [isSelectByPopupOpen, setIsSelectByPopupOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedFilterFeature, setSelectedFilterFeature] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string>('');
  const monthPopupRef = useRef<HTMLDivElement>(null);
  const selectByPopupRef = useRef<HTMLDivElement>(null);

  // Get students data from enterprise.json and normalize to `Student` shape
  const rawStudents = (enterpriseData as any).studentsOfThisMonth || [];
  const students: Student[] = rawStudents.map((s: any, i: number) => ({
    id: s.id ?? `stu-${i + 1}`,
    studentName: s.student ?? s['student name '] ?? s.studentName ?? '',
    level: s.level ?? '',
    module: s.module ?? '',
    sessions: Number(s.sessions ?? 0),
    email: s.email ?? '',
    parentName: s.parent ?? s.parentName ?? '',
    feePayment: Number(s.feesPayment ?? s.feesPayment ?? 0),
  }));

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthPopupRef.current && !monthPopupRef.current.contains(event.target as Node)) {
        setIsMonthPopupOpen(false);
      }
      if (selectByPopupRef.current && !selectByPopupRef.current.contains(event.target as Node)) {
        setIsSelectByPopupOpen(false);
        setSelectedFilterFeature('');
        setFilterValue('');
      }
    };

    if (isMonthPopupOpen || isSelectByPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMonthPopupOpen, isSelectByPopupOpen]);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (studentId: string, row?: any) => {
    setSelectedStudentId(studentId);
    setSelectedStudentRow(row ?? null);
    setIsEditModalOpen(true);
  };

  const handleProfileClick = (studentId: string, row?: any) => {
    setSelectedStudentId(studentId);
    setSelectedStudentRow(row ?? null);
    setIsProfileModalOpen(true);
  };

  const handleDeleteClick = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting student:', studentToDelete);
    // TODO: Implement actual delete logic here
    // This would typically call an API to delete the student
    setIsDeleteModalOpen(false);
    setStudentToDelete('');
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete('');
  };

  const handleDeleteFromModal = () => {
    handleDeleteClick(selectedStudentId);
    setIsEditModalOpen(false);
    setIsProfileModalOpen(false);
  };

  // Define table columns for students
  const columns: Column<Student>[] = [
    { key: 'id', label: 'ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'level', label: 'Level' },
    { key: 'module', label: 'Module' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'email', label: 'Email' },
    { key: 'parentName', label: 'Parent' },
    {
      key: 'feePayment',
      label: 'Fees Payment',
      render: (value: number) => `${value}DZD`,
    },
  ];

  const studentStats = [
    {
      icon: 'total_students',
      label: 'Total Students',
      value: enterpriseData['number of students'],
      percentage: `${enterpriseData['students percentage']}%`,
    },
    {
      icon: 'attendance',
      label: 'Absent Students',
      value: enterpriseData['absent students'],
      percentage: `${((enterpriseData['absent students'] / enterpriseData['number of students']) * 100).toFixed(1)}%`,
    },
    {
      icon: 'attendance_rate',
      label: 'Attendance Rate',
      value: `${enterpriseData['attendance rate']}%`,
      percentage: `${enterpriseData['attendance rate']}%`,
    },
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setIsMonthPopupOpen(false);
  };

  const handleFilterFeatureSelect = (feature: string) => {
    setSelectedFilterFeature(feature);
    setFilterValue('');
  };

  const handleFilterApply = () => {
    // Apply filter logic here
    setIsSelectByPopupOpen(false);
    setFilterValue('');
  };

  const handleFilterCancel = () => {
    setIsSelectByPopupOpen(false);
    setSelectedFilterFeature('');
    setFilterValue('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
      <div className={styles.cardsRow}>
          {studentStats.map((stat) => (
            <DashboardCard key={stat.label} {...stat} />
          ))}
        </div>
     
        
        {/* Search and Filter Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchInputWrapper}>
            <Image
              src="/icons/enter-name.svg"
              alt="Search"
              width={20}
              height={20}
              className={styles.searchIcon}
            />
            <input
              type="text"
              placeholder="Enter student name"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterButtons}>
            <div className={styles.filterButtonWrapper} ref={monthPopupRef}>
              <button 
                className={styles.filterButton}
                onClick={() => {
                  setIsMonthPopupOpen(!isMonthPopupOpen);
                  setIsSelectByPopupOpen(false);
                }}
              >
                <Image
                  src="/icons/select-month.svg"
                  alt="Select Month"
                  width={20}
                  height={20}
                />
                <span>{selectedMonth || 'Select Month'}</span>
              </button>
              {isMonthPopupOpen && (
                <div className={styles.popup}>
                  <div className={styles.popupContent}>
                    {months.map((month) => (
                      <button
                        key={month}
                        className={styles.popupItem}
                        onClick={() => handleMonthSelect(month)}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.filterButtonWrapper} ref={selectByPopupRef}>
              <button 
                className={styles.filterButton}
                onClick={() => {
                  setIsSelectByPopupOpen(!isSelectByPopupOpen);
                  setIsMonthPopupOpen(false);
                }}
              >
                <Image
                  src="/icons/select-by.svg"
                  alt="Select By"
                  width={20}
                  height={20}
                />
                <span>Select By</span>
              </button>
              {isSelectByPopupOpen && (
                <div className={styles.popup}>
                  <div className={styles.popupContent}>
                    {!selectedFilterFeature ? (
                      columns.map((column) => (
                        <button
                          key={column.key}
                          className={styles.popupItem}
                          onClick={() => handleFilterFeatureSelect(column.key)}
                        >
                          {column.label}
                        </button>
                      ))
                    ) : (
                      <div className={styles.filterInputSection}>
                        <label className={styles.filterLabel}>
                          Filter by {columns.find(c => c.key === selectedFilterFeature)?.label}
                        </label>
                        <input
                          type="text"
                          placeholder="Enter value"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className={styles.filterValueInput}
                          autoFocus
                        />
                        <div className={styles.filterActions}>
                          <button
                            className={styles.filterActionButton}
                            onClick={handleFilterApply}
                          >
                            Apply
                          </button>
                          <button
                            className={`${styles.filterActionButton} ${styles.cancelButton}`}
                            onClick={handleFilterCancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className={styles.listContainer}>
          <MembersTable
            data={students}
            columns={columns}
            onEdit={handleEditClick}
            onViewProfile={handleProfileClick}
            onDelete={handleDeleteClick}
            getId={(row) => (row as any).id}
            emptyMessage="No students found"
          />
        </div>
      </div>

      {/* Modals */}
      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentId={selectedStudentId}
        studentData={selectedStudentRow}
        onDelete={handleDeleteFromModal}
      />
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        studentId={selectedStudentId}
        studentData={selectedStudentRow}
        onDelete={handleDeleteFromModal}
      />
      <ConfirmModal
        open={isDeleteModalOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      {/* Edit and Profile handled via modals */}
     <div className={styles.header}>
         
         <button className={styles.addButton} onClick={handleAddClick}>
           Add Student
         </button>
       </div>
     
    </div>
  );
}

