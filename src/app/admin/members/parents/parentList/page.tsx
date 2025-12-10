'use client';

import { useState, useRef, useEffect } from 'react';
import MembersTable, { Column } from '@/components/members/MembersTable/MembersTable';
import AddParentModal from '@/components/parents/AddParentModal/AddParentModal';
import EditParentModal from '@/components/parents/EditParentModal/EditParentModal';
import ParentProfileModal from '@/components/parents/ParentProfileModal/ParentProfileModal';
import ConfirmModal from '@/components/UI/ConfirmModal/ConfirmModal';
import enterpriseData from '@/data/enterprise.json';
import styles from './page.module.css';
import Image from 'next/image';
import DashboardCard from '@/components/dashboard/DashboardCard/DashboardCard';

type Parent = {
  id: number | string;
  parentName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  childName?: string;
  academicYear?: string;
  feesPayment?: number;
};

export default function ParentListPage() {
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<string>('');

  // parents will be derived and normalized from enterprise.json below

  const [isMonthPopupOpen, setIsMonthPopupOpen] = useState(false);
  const [isSelectByPopupOpen, setIsSelectByPopupOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedFilterFeature, setSelectedFilterFeature] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const monthPopupRef = useRef<HTMLDivElement>(null);
  const selectByPopupRef = useRef<HTMLDivElement>(null);

  const rawParents = ((enterpriseData as any).parents || []) as any[];

  const parents = rawParents.map((p: any) => ({
    id: p.id ?? String(p.parentName).toLowerCase().replace(/\s+/g, '-'),
    parentName: p.parentName ?? p.name ?? '',
    email: p.email ?? '',
    phoneNumber: p.phoneNumber ? String(p.phoneNumber) : '',
    childName: p.childName ?? '',
    academicYear: p.academicYear ?? '',
    feesPayment: p.feesPayment ?? p.feePayment ?? 0,
  })) as Parent[];
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (parentId: string) => {
    setSelectedParentId(parentId);
    setIsEditModalOpen(true);
  };

  const handleProfileClick = (parentId: string) => {
    setSelectedParentId(parentId);
    setIsProfileModalOpen(true);
  };

  const handleDeleteClick = (parentId: string) => {
    setParentToDelete(parentId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting parent:', parentToDelete);
    // TODO: Implement actual delete logic here
    // This would typically call an API to delete the parent
    setIsDeleteModalOpen(false);
    setParentToDelete('');
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setParentToDelete('');
  };

  const handleDeleteFromModal = () => {
    handleDeleteClick(selectedParentId);
    setIsEditModalOpen(false);
    setIsProfileModalOpen(false);
  };

  // Define table columns for parents
  // Columns match the keys in enterprise.json parents entries
  const columns: Column<Parent>[] = [
    { key: 'id', label: 'ID' },
    { key: 'parentName', label: 'Parent Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'childName', label: 'Child Name' },
    { key: 'academicYear', label: 'Academic Year' },
    { key: 'feesPayment', label: 'Fees Payment' },
  ];


  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const parentStats = [
    {
      icon: 'attendance',
      label: 'Attendance Rate',
      value: `${enterpriseData['attendance rate']}%`,
      percentage: `${enterpriseData['attendance rate']}%`,
    },
    {
      icon: 'total_parents',
      label: 'Total Parents',
      value: enterpriseData['number of parents'],
      percentage: `${enterpriseData['parents percentage']}%`,
    },
    {
      icon: 'total_students',
      label: 'Total Students',
      value: enterpriseData['number of students'],
      percentage: `${enterpriseData['students percentage']}%`,
    },
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
          {parentStats.map((stat) => (
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
              placeholder="Enter parent name"
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
                      // Only parent-related columns
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
        </div>

        <div className={styles.listContainer}>
          <MembersTable
            data={parents}
            columns={columns}
            onEdit={handleEditClick}
            onViewProfile={handleProfileClick}
            onDelete={handleDeleteClick}
            getId={(row) => String((row as any).id ?? row.parentName)}
            emptyMessage="No parents found"
          />
        </div>

        <div className={styles.addButtonContainer}>
          <button className={styles.addButton} onClick={handleAddClick}>Add Parent</button>
        </div>
      </div>

      {/* Modals */}
      <AddParentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      <EditParentModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        parentId={selectedParentId}
        onDelete={handleDeleteFromModal}
      />
      <ParentProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        parentId={selectedParentId}
        onDelete={handleDeleteFromModal}
      />
      <ConfirmModal
        open={isDeleteModalOpen}
        title="Delete Parent"
        message="Are you sure you want to delete this parent? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

