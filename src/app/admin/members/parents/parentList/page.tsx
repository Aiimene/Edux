'use client';

import { useState, useRef, useEffect } from 'react';
import MembersTable, { Column } from '@/components/members/MembersTable/MembersTable';
import AddParentModal from '@/components/parents/AddParentModal/AddParentModal';
import EditParentModal from '@/components/parents/EditParentModal/EditParentModal';
import ParentProfileModal from '@/components/parents/ParentProfileModal/ParentProfileModal';
import ConfirmModal from '@/components/UI/ConfirmModal/ConfirmModal';
import { getParents, getParentById, createParent, updateParent, deleteParent } from '@/api/parents';
import styles from './page.module.css';
import Image from 'next/image';
import DashboardCard from '@/components/dashboard/DashboardCard/DashboardCard';

type Parent = {
  id: number | string;
  parentName: string;
  email: string;
  phoneNumber?: string;
  childrenCount?: number;
};

export default function ParentListPage() {
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<string>('');
  const [parents, setParents] = useState<Parent[]>([]);
  const [selectedParentData, setSelectedParentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isMonthPopupOpen, setIsMonthPopupOpen] = useState(false);
  const [isSelectByPopupOpen, setIsSelectByPopupOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedFilterFeature, setSelectedFilterFeature] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const monthPopupRef = useRef<HTMLDivElement>(null);
  const selectByPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getParents();
      const apiData = Array.isArray(response) ? response : response?.results || [];
      const normalized: Parent[] = apiData.map((p: any) => ({
        id: p.id,
        parentName: p.name ?? '',
        email: p.user?.email ?? '',
        phoneNumber: p.user?.phone_number ?? '',
        childrenCount: p.children_count ?? 0,
      }));
      setParents(normalized);
    } catch (err) {
      console.error('Error fetching parents:', err);
      setError('Failed to load parents. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleAddClick = () => {
    setSelectedParentData(null);
    setIsAddModalOpen(true);
  };

  const loadParentDetails = async (parentId: string, open: 'edit' | 'profile') => {
    try {
      setSelectedParentId(parentId);
      const detail = await getParentById(parentId);
      const mapped = {
        studentName: detail.name ?? '',
        email: detail.user?.email ?? '',
        phoneNumber: detail.user?.phone_number ?? '',
      };
      setSelectedParentData(mapped);
      if (open === 'edit') setIsEditModalOpen(true);
      else setIsProfileModalOpen(true);
    } catch (err) {
      console.error('Error loading parent details:', err);
      setSelectedParentData(null);
    }
  };

  const handleEditClick = (parentId: string) => {
    loadParentDetails(parentId, 'edit');
  };

  const handleProfileClick = (parentId: string) => {
    loadParentDetails(parentId, 'profile');
  };

  const handleDeleteClick = (parentId: string) => {
    setParentToDelete(parentId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteError(null);
    try {
      await deleteParent(parentToDelete);
      await fetchParents();
      setIsDeleteModalOpen(false);
      setParentToDelete('');
    } catch (err: any) {
      console.error('Error deleting parent:', err);
      
      let errorMsg = 'Failed to delete parent.';
      if (err?.response?.data?.error) {
        errorMsg = err.response.data.error;
        if (err.response.data.children_count) {
          errorMsg += ` Children count: ${err.response.data.children_count}`;
        }
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      setDeleteError(errorMsg);
      setIsDeleteModalOpen(false);
      setParentToDelete('');
    }
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

  const handleSaveParent = async (data: any) => {
    console.log('=== ADD PARENT STARTED ===');
    console.log('Form data received:', data);
    try {
      const payload = {
        name: data.studentName,
        username: data.email ? data.email.split('@')[0] : data.studentName.replace(/\s+/g, '').toLowerCase(),
        password: data.password,
        email: data.email || undefined,
        phone_number: data.phoneNumber || undefined,
      };
      console.log('Payload to send:', payload);
      const response = await createParent(payload);
      console.log('Parent created successfully:', response);
      await fetchParents();
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error('=== ADD PARENT ERROR ===');
      console.error('Full error:', err);
      console.error('Response data:', err?.response?.data);
      
      // Parse detailed error messages from backend
      let errorMsg = 'Failed to create parent';
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          // Extract field-specific errors
          const fieldErrors = Object.entries(data)
            .filter(([key]) => key !== 'error' && key !== 'detail')
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
          
          if (fieldErrors) {
            errorMsg = fieldErrors;
          } else if (data.error || data.detail) {
            errorMsg = data.error || data.detail;
          }
        } else {
          errorMsg = String(data);
        }
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      alert('Error creating parent:\n' + errorMsg);
    }
  };

  const handleUpdateParent = async (data: any) => {
    try {
      const payload: any = {
        name: data.studentName,
        email: data.email || undefined,
        phone_number: data.phoneNumber || undefined,
      };
      if (data.password) payload.password = data.password;
      await updateParent(selectedParentId, payload);
      await fetchParents();
      setIsEditModalOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.detail || err?.message || 'Failed to update parent';
      alert(msg);
    }
  };

  // Define table columns for parents (align with backend list serializer)
  const columns: Column<Parent>[] = [
    { key: 'id', label: 'ID' },
    { key: 'parentName', label: 'Parent Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'childrenCount', label: 'Children' },
  ];


  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const parentStats = [
    {
      icon: 'total_parents',
      label: 'Total Parents',
      value: parents.length,
      percentage: '0%',
    },
    {
      icon: 'attendance',
      label: 'Attendance Rate',
      value: 'N/A',
      percentage: '0%',
    },
    {
      icon: 'total_students',
      label: 'Children Linked',
      value: parents.reduce((sum, p) => sum + (p.childrenCount || 0), 0),
      percentage: '0%',
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
        {loading && <div style={{padding: '20px', textAlign: 'center'}}>Loading parents...</div>}
        {error && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '16px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            color: '#c33',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#c33',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >×</button>
          </div>
        )}
        {deleteError && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '16px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            color: '#856404',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{deleteError}</span>
            <button
              onClick={() => setDeleteError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#856404',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >×</button>
          </div>
        )}
        

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

        {loading && <div className={styles.loading}>Loading parents...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && (
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
        )}

        <div className={styles.addButtonContainer}>
          <button className={styles.addButton} onClick={handleAddClick}>Add Parent</button>
        </div>
      </div>

      {/* Modals */}
      <AddParentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveParent}
      />
      <EditParentModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedParentData}
        onSave={handleUpdateParent}
        onDelete={handleDeleteFromModal}
      />
      <ParentProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        parentData={selectedParentData}
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

