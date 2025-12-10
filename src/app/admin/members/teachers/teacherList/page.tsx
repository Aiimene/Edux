'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import MembersTable, { Column } from '../../../../../components/members/MembersTable/MembersTable';
import DashboardCard from '../../../../../components/dashboard/DashboardCard/DashboardCard';
import AddTeacherModal from '../../../../../components/teachers/AddTeacherModal/AddTeacherModal';
import EditTeacherModal from '../../../../../components/teachers/EditTeacherModal/EditTeacherModal';
import TeacherProfileModal from '../../../../../components/teachers/TeacherProfileModal/TeacherProfileModal';
import ConfirmModal from '../../../../../components/UI/ConfirmModal/ConfirmModal';
import enterpriseData from '../../../../../data/enterprise.json';
import styles from './page.module.css';

type Teacher = {
  name: string;
  sessions: number;
  percentage: number;
};

export default function TeacherListPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedTeacherRow, setSelectedTeacherRow] = useState<any>(null);
  const [isMonthPopupOpen, setIsMonthPopupOpen] = useState(false);
  const [isSelectByPopupOpen, setIsSelectByPopupOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedFilterFeature, setSelectedFilterFeature] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string>('');
  const monthPopupRef = useRef<HTMLDivElement>(null);
  const selectByPopupRef = useRef<HTMLDivElement>(null);

  // Get teachers data from enterprise.json and normalize
  const rawTeachers = (enterpriseData as any).teachers || [];

  const teachers = rawTeachers.map((t: any) => ({
    id: t.id ?? String(t.teacherName).toLowerCase().replace(/\s+/g, '-'),
    teacherName: t.teacherName ?? '',
    level: t.level ?? '',
    modules: Array.isArray(t.modules) ? t.modules.join(', ') : (t.modules || ''),
    sessions: Array.isArray(t.sessions) ? t.sessions.length : Number(t.sessions ?? 0),
    email: t.email ?? '',
    paymentMethod: t.paymentMethod ?? '',
    paymentStatus: t.paymentStatus ?? '',
  })) as any[];

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  // Helper: map a raw teacher object from enterprise.json to the modal's `initialData` shape
  const mapTeacherToInitial = (t: any) => {
    if (!t) return null;
    return {
      studentName: t.teacherName ?? t.name ?? '',
      email: t.email ?? '',
      password: t.password ?? '',
      dateOfBirth: t.dateOfBirth ?? '',
      phoneNumber: t.phoneNumber ? String(t.phoneNumber) : '',
      level: t.level ?? '',
      sessions: Array.isArray(t.sessions) ? t.sessions.map(String) : (t.sessions ? [String(t.sessions)] : []),
      feePayment: t.feePayment ? String(t.feePayment) : '',
      enrollmentDate: t.enrollmentDate ?? t.enrollment_date ?? '',
      paymentMethod: t.paymentMethod ? String(t.paymentMethod).toLowerCase() : '',
      paymentStatus: t.paymentStatus ? String(t.paymentStatus).toLowerCase() : '',
      gender: t.gender ?? '',
      parentName: t.parentName ?? '',
      modules: Array.isArray(t.modules) ? t.modules : (typeof t.modules === 'string' ? t.modules.split(',').map((s: string) => s.trim()) : []),
      academicYear: t.academicYear ?? t['academic year'] ?? '',
      id: t.id ?? '',
    };
  };

  const handleEditClick = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setIsEditModalOpen(true);
  };

  const handleProfileClick = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setIsProfileModalOpen(true);
  };

  const handleDeleteClick = (teacherId: string) => {
    setTeacherToDelete(teacherId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting teacher:', teacherToDelete);
    // TODO: Implement actual delete logic here
    // This would typically call an API to delete the teacher
    setIsDeleteModalOpen(false);
    setTeacherToDelete('');
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTeacherToDelete('');
  };

  const handleDeleteFromModal = () => {
    handleDeleteClick(selectedTeacherId);
    setIsEditModalOpen(false);
    setIsProfileModalOpen(false);
  };

  // Define table columns for teachers
  const columns: Column<any>[] = [
    { key: 'id', label: 'ID' },
    { key: 'teacherName', label: 'Teacher Name' },
    { key: 'level', label: 'Level' },
    { key: 'modules', label: 'Modules' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'email', label: 'Email' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'paymentStatus', label: 'Payment Status' },
  ];

  const teacherStats = [
    {
      icon: 'attendance',
      label: 'Attendance Rate',
      value: `${enterpriseData['attendance rate']}%`,
      percentage: `${enterpriseData['attendance rate']}%`,
    },
    {
      icon: 'total_teachers',
      label: 'Total Teachers',
      value: enterpriseData['number of teachers'],
      percentage: `${enterpriseData['teachers percentage']}%`,
    },
    {
      icon: 'total_students',
      label: 'Total Students',
      value: enterpriseData['number of students'],
      percentage: `${enterpriseData['students percentage']}%`,
    },
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setIsMonthPopupOpen(false);
  };

  const handleFilterFeatureSelect = (feature: string) => {
    setSelectedFilterFeature(feature);
    setFilterValue('');
  };

  const handleFilterApply = () => {
    // Apply filter logic here (placeholder)
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
          {teacherStats.map((stat) => (
            <DashboardCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchInputWrapper}>
            <Image
              src="/icons/enter-name.svg"
              alt="Search"
              width={20}
              height={20}
              className={styles.searchIcon}
            />
            <input type="text" placeholder="Enter teacher name" className={styles.searchInput} />
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
                <Image src="/icons/select-month.svg" alt="Select Month" width={20} height={20} />
                <span>{selectedMonth || 'Select Month'}</span>
              </button>
              {isMonthPopupOpen && (
                <div className={styles.popup}>
                  <div className={styles.popupContent}>
                    {months.map((m) => (
                      <button key={m} className={styles.popupItem} onClick={() => handleMonthSelect(m)}>
                        {m}
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
                <Image src="/icons/select-by.svg" alt="Select By" width={20} height={20} />
                <span>Select By</span>
              </button>
              {isSelectByPopupOpen && (
                <div className={styles.popup}>
                  <div className={styles.popupContent}>
                    {!selectedFilterFeature ? (
                      columns.map((column) => (
                        <button key={column.key} className={styles.popupItem} onClick={() => handleFilterFeatureSelect(column.key)}>
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
                          <button className={styles.filterActionButton} onClick={handleFilterApply}>Apply</button>
                          <button className={`${styles.filterActionButton} ${styles.cancelButton}`} onClick={handleFilterCancel}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add button moved below the table to match your request */}
        </div>

        <div className={styles.listContainer}>
          <MembersTable
            data={teachers}
            columns={columns}
            onEdit={(id: string, row?: any) => {
              setSelectedTeacherId(id);
              // find the full raw teacher object from enterprise data so modal gets complete fields
              const full = rawTeachers.find((t: any) => String(t.id ?? String(t.teacherName).toLowerCase().replace(/\s+/g, '-')) === String(id));
              const initial = mapTeacherToInitial(full ?? row ?? null);
              setSelectedTeacherRow(initial);
              setIsEditModalOpen(true);
            }}
            onViewProfile={(id: string, row?: any) => {
              setSelectedTeacherId(id);
              const full = rawTeachers.find((t: any) => String(t.id ?? String(t.teacherName).toLowerCase().replace(/\s+/g, '-')) === String(id));
              const initial = mapTeacherToInitial(full ?? row ?? null);
              setSelectedTeacherRow(initial);
              setIsProfileModalOpen(true);
            }}
            onDelete={handleDeleteClick}
            getId={(row) => (row as any).id}
            emptyMessage="No teachers found"
          />
        </div>
        <div className={styles.addButtonContainer}>
          <button className={styles.addButton} onClick={handleAddClick}>Add Teacher</button>
        </div>
      </div>

      {/* Modals */}
      <AddTeacherModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedTeacherRow}
        onDelete={handleDeleteFromModal}
      />
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialData={selectedTeacherRow}
        onDelete={handleDeleteFromModal}
      />
      <ConfirmModal
        open={isDeleteModalOpen}
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

