'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import MembersTable, { Column } from '../../../../../components/members/MembersTable/MembersTable';
import DashboardCard from '../../../../../components/dashboard/DashboardCard/DashboardCard';
import AddTeacherModal from '../../../../../components/teachers/AddTeacherModal/AddTeacherModal';
import EditTeacherModal from '../../../../../components/teachers/EditTeacherModal/EditTeacherModal';
import TeacherProfileModal from '../../../../../components/teachers/TeacherProfileModal/TeacherProfileModal';
import ConfirmModal from '../../../../../components/UI/ConfirmModal/ConfirmModal';
import { getTeachers, deleteTeacher, createTeacher, updateTeacher } from '../../../../../api/teachers';
import { FormData } from '../../../../../components/UI/AddForm/AddForm';
import styles from './page.module.css';

type Teacher = {
  id: string;
  teacherName: string;
  level: string;
  modules: string;
  sessions: number;
  email: string;
  paymentMethod: string;
  paymentStatus: string;
};

export default function TeacherListPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedTeacherRow, setSelectedTeacherRow] = useState<any>(null);
  const [isSelectByPopupOpen, setIsSelectByPopupOpen] = useState(false);
  const [selectedFilterFeature, setSelectedFilterFeature] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<{ feature: string; value: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string>('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [teacherOverrides, setTeacherOverrides] = useState<Record<string, Partial<Teacher>>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const selectByPopupRef = useRef<HTMLDivElement>(null);

  // Load overrides before fetching
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacher_overrides');
      if (raw) setTeacherOverrides(JSON.parse(raw));
    } catch (_) {}
  }, []);

  const persistOverrides = (ov: Record<string, Partial<Teacher>>) => {
    setTeacherOverrides(ov);
    try { localStorage.setItem('teacher_overrides', JSON.stringify(ov)); } catch (_) {}
  };

  // Fetch teachers from API
  useEffect(() => {
    fetchTeachers();
  }, [teacherOverrides]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTeachers();
      
      // Handle paginated or direct array response
      const apiData = Array.isArray(response) ? response : (response.results || []);
      
      if (apiData && apiData.length) {
        console.log('Teachers API sample:', apiData[0]);
      }

      // Transform API response to match Teacher type
      const transformedTeachers: Teacher[] = apiData.map((t: any) => {
        const levelName = t.level?.name || t.level_name || t.level || '';
        const modulesList = Array.isArray(t.modules)
          ? t.modules.map((m: any) => m?.name || m).filter(Boolean)
          : t.modules_titles?.map((m: any) => m?.name || m).filter(Boolean)
            || (Array.isArray(t.courses) ? t.courses.map((c: any) => c?.name || c).filter(Boolean) : []);

        const id = t.id?.toString() || '';
        const paymentMethod = t.payment_method || t.paymentMethod || t.payment?.method || '';
        const paymentStatus = t.payment_status || t.paymentStatus || t.payment?.status || '';

        const base: Teacher = {
          id,
          teacherName: t.name || t.teacherName || t.full_name || '',
          level: levelName,
          modules: modulesList.length ? modulesList.join(', ') : '',
          sessions: t.sessions_count ?? 0,
          email: t.email || t.user?.email || '',
          paymentMethod,
          paymentStatus,
        };

        const ov = teacherOverrides[id];
        if (!ov) return base;
        return {
          ...base,
          level: ov.level !== undefined ? ov.level : base.level,
          modules: ov.modules !== undefined ? ov.modules : base.modules,
          email: ov.email !== undefined ? ov.email : base.email,
          paymentMethod: ov.paymentMethod !== undefined ? ov.paymentMethod : base.paymentMethod,
          paymentStatus: ov.paymentStatus !== undefined ? ov.paymentStatus : base.paymentStatus,
        } as Teacher;
      });
      
      setTeachers(transformedTeachers);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (teacherId: string, row?: any) => {
    setSelectedTeacherId(teacherId);
    setSelectedTeacherRow(row ?? null);
    setIsEditModalOpen(true);
  };

  const handleProfileClick = (teacherId: string, row?: any) => {
    setSelectedTeacherId(teacherId);
    setSelectedTeacherRow(row ?? null);
    setIsProfileModalOpen(true);
  };

  const handleDeleteClick = (teacherId: string) => {
    setTeacherToDelete(teacherId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteError(null);
    try {
      await deleteTeacher(teacherToDelete);
      await fetchTeachers();
      setIsDeleteModalOpen(false);
      setTeacherToDelete('');
    } catch (err: any) {
      console.error('Error deleting teacher:', err);
      
      let errorMsg = 'Failed to delete teacher.';
      if (err?.response?.data?.error) {
        errorMsg = err.response.data.error;
        if (err.response.data.active_classes) {
          errorMsg += ` Active classes: ${err.response.data.active_classes}`;
        }
        if (err.response.data.enrolled_students) {
          errorMsg += ` Enrolled students: ${err.response.data.enrolled_students}`;
        }
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      setDeleteError(errorMsg);
      setIsDeleteModalOpen(false);
      setTeacherToDelete('');
    }
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

  const handleSaveTeacher = async (data: FormData) => {
    try {
      const teacherPayload = {
        name: data.studentName,
        username: data.email ? data.email.split('@')[0] : data.studentName.replace(/\s+/g, '').toLowerCase(),
        password: data.password,
        email: data.email || undefined,
        phone_number: data.phoneNumber || undefined,
        // Optional associations
        levels: Array.isArray(data.levels) ? data.levels : (data.level ? [data.level] : []),
        modules: Array.isArray(data.modules) ? data.modules : [],
        payment_method: data.paymentMethod || undefined,
        payment_status: data.paymentStatus || undefined,
      };

      const res = await createTeacher(teacherPayload);
      const newId = (res?.id || res?.data?.id || Date.now()).toString();
      const override: Partial<Teacher> = {
        level: teacherPayload.levels?.[0] || '',
        modules: teacherPayload.modules?.join(', ') || '',
        paymentMethod: teacherPayload.payment_method || '',
        paymentStatus: teacherPayload.payment_status || '',
        email: teacherPayload.email || '',
      };
      const nextOverrides = { ...teacherOverrides, [newId]: { ...teacherOverrides[newId], ...override } };
      persistOverrides(nextOverrides);

      // Optimistic row
      setTeachers((prev) => [...prev, {
        id: newId,
        teacherName: teacherPayload.name,
        level: (Array.isArray(data.levels) && data.levels.length) ? data.levels.join(', ') : (data.level || ''),
        modules: (Array.isArray(data.modules) && data.modules.length) ? data.modules.join(', ') : '',
        sessions: 0,
        email: teacherPayload.email || '',
        paymentMethod: data.paymentMethod || '',
        paymentStatus: data.paymentStatus || '',
      }]);

      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error('Error creating teacher:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || err.message || 'Failed to create teacher';
      alert(`Failed to create teacher: ${errorMessage}`);
    }
  };

  const handleUpdateTeacher = async (data: FormData) => {
    try {
      const teacherPayload: any = {
        name: data.studentName,
        email: data.email,
        phone_number: data.phoneNumber,
      };

      if (data.password) teacherPayload.password = data.password;

      await updateTeacher(selectedTeacherId, teacherPayload);
      await fetchTeachers();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating teacher:', err);
      alert('Failed to update teacher. Please try again.');
    }
  };

  // Define table columns for teachers
  const columns: Column<Teacher>[] = [
    { key: 'id', label: 'ID' },
    { key: 'teacherName', label: 'Teacher Name' },
    { key: 'level', label: 'Level' },
    { key: 'modules', label: 'Modules' },
    { key: 'email', label: 'Email' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'paymentStatus', label: 'Payment Status' },
  ];

  const teacherStats = [
    {
      icon: 'total_teachers',
      label: 'Total Teachers',
      value: teachers.length,
      percentage: '0%',
    },
    {
      icon: 'attendance',
      label: 'Absent Teachers',
      value: 0,
      percentage: '0%',
    },
    {
      icon: 'attendance_rate',
      label: 'Attendance Rate',
      value: '0%',
      percentage: '0%',
    },
  ];

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

  const visibleTeachers = teachers
    .filter((t) => {
      const q = (searchQuery || '').trim().toLowerCase();
      if (!q) return true;
      return (t.teacherName || '').toLowerCase().includes(q);
    })
    .filter((t) => {
      if (!activeFilter || !activeFilter.value.trim()) return true;
      const raw = (t as any)[activeFilter.feature];
      if (raw === undefined || raw === null) return false;
      return raw.toString().toLowerCase().includes(activeFilter.value);
    });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
      {loading && <div className={styles.loading}>Loading teachers...</div>}
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
      
      {!loading && (
        <>
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
            <input
              type="text"
              placeholder="Enter teacher name"
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

          {/* Add button moved below the table to match your request */}
        </div>

        <div className={styles.listContainer}>
          <MembersTable
            data={visibleTeachers}
            columns={columns}
            onEdit={(id: string, row?: any) => handleEditClick(id, row)}
            onViewProfile={(id: string, row?: any) => handleProfileClick(id, row)}
            onDelete={handleDeleteClick}
            getId={(row) => row.id}
            emptyMessage="No teachers found"
          />
        </div>
        <div className={styles.addButtonContainer}>
          <button className={styles.addButton} onClick={handleAddClick}>Add Teacher</button>
        </div>
        </>
      )}
      </div>

      {/* Modals */}
      <AddTeacherModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveTeacher} />
      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedTeacherRow}
        onDelete={handleDeleteFromModal}
        onSave={handleUpdateTeacher}
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

