'use client';

import { useState, useRef, useEffect } from 'react';
import MembersTable, { Column } from '@/components/members/MembersTable/MembersTable';
import AddParentModal from '@/components/parents/AddParentModal/AddParentModal';
import ParentProfileModal from '@/components/parents/ParentProfileModal/ParentProfileModal';
import ConfirmModal from '@/components/UI/ConfirmModal/ConfirmModal';
import { getParents, getParentById, createParent, updateParent, deleteParent } from '@/lib/api/parents';
import styles from './page.module.css';
import Image from 'next/image';
import DashboardCard from '@/components/dashboard/DashboardCard/DashboardCard';

type Parent = {
  id: number | string;
  parentName: string;
  email: string;
  phoneNumber?: string;
  childrenCount?: number;
  childName?: string;
  children?: string[];
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
  const [parentOverrides, setParentOverrides] = useState<Record<string, Partial<Parent>>>({});

  const [isSelectByPopupOpen, setIsSelectByPopupOpen] = useState(false);
  const [selectedFilterFeature, setSelectedFilterFeature] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<{ feature: string; value: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const selectByPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('parent_overrides');
      if (raw) setParentOverrides(JSON.parse(raw));
    } catch (_) {}
  }, []);

  const persistOverrides = (ov: Record<string, Partial<Parent>>) => {
    setParentOverrides(ov);
    try { localStorage.setItem('parent_overrides', JSON.stringify(ov)); } catch (_) {}
  };

  useEffect(() => {
    fetchParents();
  }, [parentOverrides]);

  const fetchParents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getParents();
      const apiData = Array.isArray(response) ? response : response?.results || [];
      const normalized: Parent[] = apiData.map((p: any) => {
        // Always extract from backend structure
        const user = p.user || {};
        const childrenArr = Array.isArray(p.children)
          ? p.children.map((c: any) => c?.name || c?.student_name || c).filter(Boolean)
          : p.children_names || [];
        const childrenNames = childrenArr.join(', ');
        const base: Parent = {
          id: p.id,
          parentName: p.name ?? '',
          email: user.email ?? '',
          phoneNumber: user.phone_number ?? '',
          childrenCount: p.children_count ?? 0,
          childName: childrenNames || '',
          children: childrenArr,
        };
        const ov = parentOverrides[String(base.id)];
        // Only override if the value is not undefined or empty string/null
        return {
          ...base,
          ...(ov && Object.keys(ov).reduce((acc, key) => {
            const v = (ov as any)[key];
            if (v !== undefined && v !== null && v !== '') (acc as any)[key] = v;
            return acc;
          }, {} as Partial<Parent>)),
        } as Parent;
      });
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
      const childrenArray = Array.isArray(detail.children)
        ? detail.children.map((c: any) => c?.name || c?.student_name || c).filter(Boolean)
        : detail.children_names || [];
      // Aggregate feePayment and academicYear from children if not present, and merge with localStorage
      let feePayment = '';
      let academicYear = '';
      let password = '';
      let localChildren = childrenArray;
      try {
        const local = JSON.parse(localStorage.getItem('parent_extra_fields') || '{}');
        const localFields = local[parentId] || {};
        if (localFields.feePayment) feePayment = localFields.feePayment;
        if (localFields.academicYear) academicYear = localFields.academicYear;
        if (localFields.password) password = localFields.password;
        if (Array.isArray(localFields.children) && localFields.children.length > 0) localChildren = localFields.children;
      } catch (e) { console.error('Failed to load extra parent fields', e); }
      if (!feePayment && Array.isArray(detail.children) && detail.children.length > 0) {
        // Sum total_owed for all children for feePayment
        const totalOwed = detail.children.reduce((sum: number, child: any) => sum + (parseFloat(child.total_owed || '0') || 0), 0);
        feePayment = totalOwed ? String(totalOwed) : '';
      }
      if (!academicYear && Array.isArray(detail.children) && detail.children.length > 0) {
        // Find the most common academicYear among children
        const yearCounts: Record<string, number> = {};
        detail.children.forEach((child: any) => {
          const year = child.academicYear || child.academic_year;
          if (year) yearCounts[year] = (yearCounts[year] || 0) + 1;
        });
        academicYear = Object.entries(yearCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || '';
      }
      const mapped = {
        studentName: detail.name ?? '',
        parentName: detail.name ?? '',
        email: detail.user?.email ?? '',
        password,
        phoneNumber: detail.user?.phone_number ?? '',
        children: localChildren,
        academicYear,
        feePayment,
        dateOfBirth: detail.date_of_birth ?? '',
        level: detail.level ?? '',
        levels: Array.isArray(detail.levels) ? detail.levels : [],
        sessions: Array.isArray(detail.sessions) ? detail.sessions : [],
        enrollmentDate: detail.enrollment_date ?? '',
        paymentMethod: detail.payment_method ? String(detail.payment_method).toLowerCase() : '',
        paymentStatus: detail.payment_status ? String(detail.payment_status).toLowerCase() : '',
        gender: detail.gender ?? '',
        modules: Array.isArray(detail.modules) ? detail.modules : [],
        days: Array.isArray(detail.days) ? detail.days : [],
      };
      setSelectedParentData(mapped);
      if (open === 'edit') setIsEditModalOpen(true);
      else setIsProfileModalOpen(true);
    } catch (err) {
      console.error('Error loading parent details:', err);
      setSelectedParentData(null);
    }
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
      const msg = err?.response?.data?.error || err?.message || 'Failed to delete parent';
      setDeleteError(msg);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setParentToDelete('');
    setDeleteError(null);
  };

  const handleDeleteFromModal = (parentId: string) => {
    setIsEditModalOpen(false);
    setIsProfileModalOpen(false);
    handleDeleteClick(parentId);
  };

  const handleSaveParent = async (data: any) => {
    try {
      const payload: any = {
        name: data.studentName,
        email: data.email || undefined,
        phone_number: data.phoneNumber || undefined,
      };
      if (data.password) payload.password = data.password;

      const response = await createParent(payload);
      const newId = String(response?.id || response?.data?.id || Date.now());

      // Store extra fields in localStorage
      try {
        const local = JSON.parse(localStorage.getItem('parent_extra_fields') || '{}');
        local[newId] = {
          feePayment: data.feePayment || '',
          password: data.password || '',
          academicYear: data.academicYear || '',
          children: data.children || [],
        };
        localStorage.setItem('parent_extra_fields', JSON.stringify(local));
      } catch (e) {
        console.error('Failed to store extra parent fields', e);
      }

      const override = {
        parentName: data.studentName,
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        childName: (data.children || []).join(', ') || '',
        children: data.children || [],
      };
      const nextOverrides = { ...parentOverrides, [newId]: { ...parentOverrides[newId], ...override } };
      persistOverrides(nextOverrides);

      setParents((prev) => [...prev, {
        id: newId,
        parentName: data.studentName,
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        childrenCount: (data.children || []).length,
        childName: (data.children || []).join(', ') || '',
        children: data.children || [],
      }]);

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



  // Define table columns for parents (align with backend list serializer)
  const columns: Column<Parent>[] = [
    { key: 'id', label: 'ID' },
    { key: 'parentName', label: 'Parent Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'childName', label: 'Children' },
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
      if (selectByPopupRef.current && !selectByPopupRef.current.contains(event.target as Node)) {
        setIsSelectByPopupOpen(false);
        setSelectedFilterFeature('');
        setFilterValue('');
      }
    };

    if (isSelectByPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectByPopupOpen]);

  const handleFilterFeatureSelect = (feature: string) => {
    setSelectedFilterFeature(feature);
    setFilterValue('');
  };

  const handleFilterApply = () => {
    const trimmed = filterValue.trim();
    if (selectedFilterFeature && trimmed) {
      setActiveFilter({ feature: selectedFilterFeature, value: trimmed.toLowerCase() });
    } else {
      setActiveFilter(null);
    }
    setIsSelectByPopupOpen(false);
    setSelectedFilterFeature('');
    setFilterValue('');
  };

  const handleFilterCancel = () => {
    setIsSelectByPopupOpen(false);
    setSelectedFilterFeature('');
    setFilterValue('');
  };

  const visibleParents = parents
    .filter((p) => {
      const q = (searchQuery || '').trim().toLowerCase();
      if (!q) return true;
      return (p.parentName || '').toLowerCase().includes(q);
    })
    .filter((p) => {
      if (!activeFilter || !activeFilter.value.trim()) return true;
      const raw = (p as any)[activeFilter.feature];
      if (raw === undefined || raw === null) return false;
      return raw.toString().toLowerCase().includes(activeFilter.value);
    });

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
            >
              ×
            </button>
          </div>
        )}

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterButtons}>
            <div className={styles.filterButtonWrapper} ref={selectByPopupRef}>
              <button
                className={styles.filterButton}
                onClick={() => {
                  setIsSelectByPopupOpen(!isSelectByPopupOpen);
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
        </div>

        {!loading && (
          <div className={styles.listContainer}>
            <MembersTable
              data={visibleParents}
              columns={columns}
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
      <ParentProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        parentData={selectedParentData}
        onDelete={selectedParentData?.id ? () => handleDeleteFromModal(String(selectedParentData.id)) : undefined}
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