'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MembersTable, { Column } from '../../../../../components/members/MembersTable/MembersTable';
import DashboardCard from '../../../../../components/dashboard/DashboardCard/DashboardCard';
import AddStudentModal from '../../../../../components/students/AddStudentModal/AddStudentModal';
import EditStudentModal from '../../../../../components/students/EditStudentModal/EditStudentModal';
import StudentProfileModal from '../../../../../components/students/StudentProfileModal/StudentProfileModal';
import ConfirmModal from '../../../../../components/UI/ConfirmModal/ConfirmModal';
import { getStudents, deleteStudent, createStudent, updateStudent } from '../../../../../api/students';
import { FormData } from '../../../../../components/UI/AddForm/AddForm';
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
  const [originalStudentData, setOriginalStudentData] = useState<any>(null);
  const [isMonthPopupOpen, setIsMonthPopupOpen] = useState(false);
  const [isSelectByPopupOpen, setIsSelectByPopupOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedFilterFeature, setSelectedFilterFeature] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const monthPopupRef = useRef<HTMLDivElement>(null);
  const selectByPopupRef = useRef<HTMLDivElement>(null);

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudents();
      
      // Handle paginated or direct array response
      const apiData = Array.isArray(response) ? response : (response.results || []);
      
      // Debug: log first item shape to align fields
      if (apiData && apiData.length) {
        console.log('Students API sample:', apiData[0]);
      }

      // Transform API response to match Student type
      const transformedStudents: Student[] = apiData.map((s: any) => ({
        id: s.id?.toString() || '',
        studentName: s.name || s.studentName || s.full_name || '',
        level: s.level || s.level_name || s.level?.name || 'N/A',
        module: Array.isArray(s.modules)
          ? s.modules.map((m: any) => m?.name || m).filter(Boolean).join(', ')
          : s.modules_titles?.join(', ') || s.modules || 'N/A',
        sessions: s.sessions || s.sessions_count || s.total_sessions || 0,
        email: s.email || s.user?.email || 'N/A',
        parentName: s.parent_name || s.parent?.name || 'N/A',
        feePayment: s.total_owed ?? s.balance ?? s.fee_payment ?? s.total_paid ?? 0,
      }));
      
      setStudents(transformedStudents);
    } catch (err) {
      console.error('Error fetching students:', err);
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
    try {
      await deleteStudent(studentToDelete);
      await fetchStudents();
      setIsDeleteModalOpen(false);
      setStudentToDelete('');
    } catch (err: any) {
      console.error('Error deleting student:', err);
      
      let errorMsg = 'Failed to delete student.';
      if (err?.response?.data?.error) {
        errorMsg = err.response.data.error;
        if (err.response.data.balance) {
          errorMsg += ` Outstanding balance: ${err.response.data.balance} DZD`;
        }
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      setDeleteError(errorMsg);
      setIsDeleteModalOpen(false);
      setStudentToDelete('');
    }
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
      value: students.length,
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
    console.log('=== ADD STUDENT STARTED ===');
    console.log('Form data received:', data);
    try {
      const studentPayload = {
        name: data.studentName,
        username: data.email ? data.email.split('@')[0] : data.studentName.replace(/\s+/g, '').toLowerCase(),
        password: data.password,
        email: data.email || undefined,
        phone_number: data.phoneNumber || undefined,
        fee_payment: data.feePayment ? parseFloat(data.feePayment) : undefined,
        // Additional fields from the form
        level: data.level || undefined,
        modules: data.modules || undefined,
        sessions: data.sessions ? parseInt(data.sessions) : undefined,
        date_of_birth: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        parent_name: data.parentName || undefined,
      };

      console.log('Payload to send:', studentPayload);
      const response = await createStudent(studentPayload);
      console.log('Student created successfully:', response);
      
      // Refresh the students list
      console.log('Refreshing student list...');
      await fetchStudents();
      console.log('Student list refreshed');
      
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error('=== ERROR CREATING STUDENT ===');
      console.error('Error object:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      // Extract detailed error messages from backend
      let errorMessage = 'Failed to create student';
      
      if (err.response?.data) {
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
            data={students}
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

