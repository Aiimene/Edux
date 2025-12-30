'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MembersTable, { Column } from '../../../../../components/members/MembersTable/MembersTable';
import DashboardCard from '../../../../../components/dashboard/DashboardCard/DashboardCard';
import AddStudentModal from '../../../../../components/students/AddStudentModal/AddStudentModal';
import EditStudentModal from '../../../../../components/students/EditStudentModal/EditStudentModal';
import StudentProfileModal from '../../../../../components/students/StudentProfileModal/StudentProfileModal';
import ConfirmModal from '../../../../../components/UI/ConfirmModal/ConfirmModal';
import { getStudents, deleteStudent, createStudent, updateStudent, getStudentById } from '../../../../../lib/api/students';
import { FormData } from '../../../../../components/UI/AddForm/AddForm';
import styles from './page.module.css';

// Normalize various backend fee fields to a single numeric value
const resolveFeePayment = (student: any): number => {
  // Prefer the initial fee set at creation (total_owed). Fallback to paid values
  const raw = student?.total_owed ?? student?.total_paid ?? student?.fee_payment ?? student?.fees_payment ?? student?.paid_fees ?? student?.payment;
  const num = typeof raw === 'string' ? parseFloat(raw) : raw;
  return Number.isFinite(num as number) ? (num as number) : 0;
};

type Student = {
  id: string;
  studentName: string;
  level: string;
  module: string;
  sessions: string;
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
  const [originalStudentData, setOriginalStudentData] = useState<any>(null);
  const [isMonthPopupOpen, setIsMonthPopupOpen] = useState(false);
  const [isSelectByPopupOpen, setIsSelectByPopupOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedFilterFeature, setSelectedFilterFeature] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [hiddenStudentIds, setHiddenStudentIds] = useState<string[]>([]);
  const [studentOverrides, setStudentOverrides] = useState<Record<string, Partial<Student>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const monthPopupRef = useRef<HTMLDivElement>(null);
  const selectByPopupRef = useRef<HTMLDivElement>(null);

  // Load overrides BEFORE fetching to ensure fees merge correctly
  useEffect(() => {
    try {
      const rawHidden = localStorage.getItem('hidden_student_ids');
      if (rawHidden) setHiddenStudentIds(JSON.parse(rawHidden));

      const rawOv = localStorage.getItem('student_overrides');
      if (rawOv) setStudentOverrides(JSON.parse(rawOv));
    } catch (_) {}
  }, []);

  // Fetch students AFTER overrides are available so merge applies
  useEffect(() => {
    fetchStudents();
  }, [studentOverrides]);

  const persistHidden = (ids: string[]) => {
    setHiddenStudentIds(ids);
    try { localStorage.setItem('hidden_student_ids', JSON.stringify(ids)); } catch (_) {}
  };

  const persistOverrides = (ov: Record<string, Partial<Student>>) => {
    setStudentOverrides(ov);
    try { localStorage.setItem('student_overrides', JSON.stringify(ov)); } catch (_) {}
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudents();
      
      // Handle paginated or direct array response
      const apiData = Array.isArray(response) ? response : (response.results || []);
      
      // Fetch full details for each student to get all fields
      const transformedStudents: Student[] = await Promise.all(
        apiData.map(async (s: any) => {
          try {
            // Try to fetch full student details
            const detailResponse = await getStudentById(s.id.toString());
            const detail = detailResponse || s;
            
            return {
              id: detail.id?.toString() || s.id?.toString() || '',
              studentName: detail.name || detail.studentName || s.name || s.studentName || '',
              level: detail.timetable ? 'Active' : (detail.level || detail.level_name || s.level || s.level_name || 'N/A'),
              module: detail.timetable && Array.isArray(detail.timetable)
                ? detail.timetable.map((t: any) => t?.session_name || t?.module).filter(Boolean).join(', ')
                : 'N/A',
              sessions: detail.timetable && Array.isArray(detail.timetable)
                ? detail.timetable.map((t: any) => t?.session_name || t?.module).filter(Boolean).join(', ')
                : (Array.isArray(s.sessions) ? (s.sessions as any[]).join(', ') : (s.sessions_count ? `Sessions: ${s.sessions_count}` : 'N/A')),
              email: detail.user?.email || detail.email || s.email || 'N/A',
              parentName: detail.parent_name || detail.parent?.name || s.parent_name || s.parent?.name || 'N/A',
              feePayment: resolveFeePayment(detail ?? s),
            };
          } catch (detailErr) {
            // Fallback to list data if detail fetch fails
            return {
              id: s.id?.toString() || '',
              studentName: s.name || s.studentName || '',
              level: 'N/A',
              module: 'N/A',
              sessions: Array.isArray(s.sessions) ? (s.sessions as any[]).join(', ') : (s.sessions_count ? `Sessions: ${s.sessions_count}` : 'N/A'),
              email: s.email || 'N/A',
              parentName: s.parent_name || s.parent?.name || 'N/A',
              feePayment: resolveFeePayment(s),
            };
          }
        })
      );
      
      // Apply local display overrides for fields the backend doesn't provide
      const merged = transformedStudents.map((s) => {
        const ov = studentOverrides[s.id];
        if (!ov) return s;
        // Handle both old (number) and new (string) session formats from localStorage
        let sessionsValue = s.sessions;
        if (ov.sessions !== undefined) {
          sessionsValue = typeof ov.sessions === 'number' 
            ? `Sessions: ${ov.sessions}` 
            : ov.sessions;
        }
        return {
          ...s,
          level: ov.level ?? s.level,
          module: ov.module ?? s.module,
          sessions: sessionsValue,
          parentName: ov.parentName ?? s.parentName,
          feePayment: ov.feePayment !== undefined ? ov.feePayment : s.feePayment,
        } as Student;
      });
      setStudents(merged);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      // Handle 401 auth errors by redirecting to login
      if (err?.response?.status === 401) {
        // Clear auth tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('access_token');
        // Redirect to login
        window.location.href = '/login';
        return;
      }
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
    setOriginalStudentData(row ?? null);
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

  const handleDeleteConfirm = async () => {
    setDeleteError(null);
    const targetId = studentToDelete || selectedStudentId;
    // Immediately hide locally (soft delete) and persist across refresh
    if (targetId) {
      const next = Array.from(new Set([...hiddenStudentIds, targetId.toString()]));
      persistHidden(next);
    }

    setIsDeleteModalOpen(false);
    setStudentToDelete('');

    // Attempt backend delete in background; do not block UI
    try {
      await deleteStudent(targetId);
    } catch (err: any) {
      // Log silently; UI remains hidden per user's preference
      console.warn('Backend delete failed; kept hidden locally:', err);
    } finally {
      // Refresh to keep data current; hidden filter will apply
      await fetchStudents();
    }
  };

  // Auto-dismiss delete warnings after 6 seconds to reduce noise
  useEffect(() => {
    if (!deleteError) return;
    const t = setTimeout(() => setDeleteError(null), 6000);
    return () => clearTimeout(t);
  }, [deleteError]);

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

  const visibleStudents = students.filter((s) => !hiddenStudentIds.includes(s.id));

  const studentStats = [
    {
      icon: 'total_students',
      label: 'Total Students',
      value: visibleStudents.length,
      percentage: '0%',
    },
    {
      icon: 'attendance',
      label: 'Absent Students',
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

  const handleSaveStudent = async (data: FormData) => {
    setError(null);
    console.log('=== ADD STUDENT STARTED ===');
    console.log('Form data received:', data);
    try {
      // Only send fields that backend accepts
      const studentPayload: any = {
        name: data.studentName,
        username: data.email ? data.email.split('@')[0] : data.studentName.replace(/\s+/g, '').toLowerCase(),
        password: data.password,
      };

      // Add optional fields only if they have values
      if (data.email) studentPayload.email = data.email;
      if (data.phoneNumber) studentPayload.phone_number = data.phoneNumber;
      if (data.feePayment !== undefined && data.feePayment !== '') {
        studentPayload.fee_payment = Number(data.feePayment);
      }

      console.log('Payload to send:', studentPayload);
      const response = await createStudent(studentPayload);
      console.log('Student created successfully:', response);
      const newId = (response?.id || response?.data?.studentId || Date.now()).toString();
      const overrideForNew: Partial<Student> = {
        level: data.level || 'Active',
        module: Array.isArray(data.modules) && data.modules.length ? data.modules.join(', ') : 'N/A',
        sessions: Array.isArray(data.sessions) && data.sessions.length
          ? data.sessions.map((s) => `Session ${s}`).join(', ')
          : 'N/A',
        parentName: data.parentName || 'N/A',
        feePayment: data.feePayment ? parseFloat(data.feePayment) : 0,
      };
      const nextOverrides = { ...studentOverrides, [newId]: { ...studentOverrides[newId], ...overrideForNew } };
      persistOverrides(nextOverrides);

      // Optimistically add the student to the table to avoid requiring a refresh (using overrides)
      const optimisticStudent: Student = {
        id: newId,
        studentName: response?.name || response?.data?.studentName || data.studentName,
        level: overrideForNew.level as string,
        module: overrideForNew.module as string,
        sessions: overrideForNew.sessions as string,
        email: response?.email || response?.data?.email || data.email || 'N/A',
        parentName: overrideForNew.parentName as string,
        feePayment: overrideForNew.feePayment ?? (resolveFeePayment(response) || parseFloat(data.feePayment || '0')),
      };
      setStudents((prev) => [...prev, optimisticStudent]);
      
      // Delay refresh to avoid wiping optimistic UI when backend lacks fees
      setTimeout(() => {
        fetchStudents();
      }, 500);
      
      setIsAddModalOpen(false);
    } catch (err: any) {
      // Try to recover by refreshing list; if it succeeds, hide the error
      let recovered = false;
      try {
        await fetchStudents();
        recovered = true;
      } catch (_) {
        // ignore
      }

      if (recovered) {
        setError(null);
        setIsAddModalOpen(false);
        return;
      }

      // Extract detailed error messages from backend
      let errorMessage = 'Failed to create student';

      // If backend returned HTML (likely 500), surface a clearer message
      if (typeof err?.response?.data === 'string' && err.response.data.includes('<!DOCTYPE html')) {
        errorMessage = 'Backend server error (500). Check backend logs for details.';
      } else if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle field-specific errors (like email, username validation)
        if (typeof errorData === 'object' && !errorData.error && !errorData.detail) {
          const fieldErrors = Object.entries(errorData)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(', ')}`;
            })
            .join('\n');
          errorMessage = fieldErrors || errorMessage;
        } else {
          // Handle generic error or detail messages
          errorMessage = errorData.error || errorData.detail || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(`Failed to create student: ${errorMessage}`);
    }
  };

  const handleUpdateStudent = async (data: FormData) => {
    console.log('=== UPDATE STUDENT STARTED ===');
    console.log('Student ID:', selectedStudentId);
    console.log('Form data received:', data);
    console.log('Original student data:', originalStudentData);
    try {
      const studentPayload: any = {
        name: data.studentName,
      };

      // Only send email if it has changed from original
      // This avoids the "email already exists" error when updating without changing email
      const originalEmail = originalStudentData?.email || '';
      if (data.email && data.email !== originalEmail) {
        studentPayload.email = data.email;
      }
      
      // Only send phone if it has changed
      const originalPhone = originalStudentData?.phoneNumber || '';
      if (data.phoneNumber && data.phoneNumber !== originalPhone) {
        studentPayload.phone_number = data.phoneNumber;
      }
      
      // Always allow password updates if provided
      if (data.password) {
        studentPayload.password = data.password;
      }

      console.log('Payload to send:', studentPayload);
      await updateStudent(selectedStudentId, studentPayload);
      console.log('Student updated successfully');
      // Update local display overrides based on edit form
      if (selectedStudentId) {
        const upd: Partial<Student> = {
          level: data.level || studentOverrides[selectedStudentId]?.level,
          module: Array.isArray(data.modules) && data.modules.length ? data.modules.join(', ') : studentOverrides[selectedStudentId]?.module,
          sessions: Array.isArray(data.sessions) && data.sessions.length
            ? data.sessions.map((s) => `Session ${s}`).join(', ')
            : studentOverrides[selectedStudentId]?.sessions,
          parentName: data.parentName || studentOverrides[selectedStudentId]?.parentName,
          feePayment: data.feePayment ? parseFloat(data.feePayment) : studentOverrides[selectedStudentId]?.feePayment,
        };
        const nextOv = { ...studentOverrides, [selectedStudentId]: { ...studentOverrides[selectedStudentId], ...upd } };
        persistOverrides(nextOv);
      }
      await fetchStudents();
      setIsEditModalOpen(false);
      setOriginalStudentData(null);
      setError(null);
    } catch (err: any) {
      console.error('=== UPDATE STUDENT ERROR ===');
      console.error('Error object:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      // Parse backend error
      let errorMsg = 'Failed to update student';
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          const fieldErrors = Object.entries(data)
            .filter(([key]) => key !== 'error' && key !== 'detail')
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(', ');
          
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
      
      setError('Error updating student: ' + errorMsg);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
      {loading && <div className={styles.loading}>Loading students...</div>}
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
            data={visibleStudents}
            columns={columns}
            onEdit={handleEditClick}
            onViewProfile={handleProfileClick}
            onDelete={handleDeleteClick}
            getId={(row) => (row as any).id}
            emptyMessage="No students found"
          />
        </div>
        </>
      )}
      </div>

      {/* Modals */}
      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        onSave={handleSaveStudent}
      />
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        studentId={selectedStudentId}
        studentData={selectedStudentRow}
        onDelete={handleDeleteFromModal}
        onSave={handleUpdateStudent}
      />
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          fetchStudents();
        }}
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

