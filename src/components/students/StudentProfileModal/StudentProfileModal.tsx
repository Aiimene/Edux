'use client';



import AddForm, { FormData } from '@/components/UI/AddForm/AddForm';
import enterprise from '@/data/enterprise.json';
import { useMemo } from 'react';

type StudentProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  // optional: a student object can be passed later when backend is ready
  studentData?: any;
  onDelete?: () => void;
};


  // Compose merged initial data from backend, localStorage, and fallback

  export default function StudentProfileModal({ isOpen, onClose, studentId, studentData, onDelete }: any) {
    const mergedInitial = useMemo(() => {
      // Prefer explicit studentData, use _fullData if available for complete API response
      const studentsList = (enterprise as any)['studentsOfThisMonth']
        || (enterprise as any)['students of this month']
        || [];
      let src: any = studentData?._fullData || studentData || null;
      if (!src && studentId && studentsList && studentsList.length > 0) {
        src = studentsList.find((s: any) => s.id === studentId || s.email === studentId || s.studentName === studentId || s.student === studentId) ?? null;
      }
      // default placeholder when no student found
      const placeholder = {
        studentName: 'Aya Hamdi',
        email: 'aya.hamdi@example.com',
        dateOfBirth: '2008-05-10',
        phoneNumber: '0549062531',
        gender: 'female',
        parentName: 'Samir Hamdi',
        level: '3 eme',
        modules: ['Science'],
        sessions: 20,
        academicYear: '2023-2024',
        feePayment: 400,
      };
      if (!src) {
        const fromKey = (enterprise as any)['View this students '] || (enterprise as any)['viewStudent'] || null;
        if (studentsList && studentsList.length > 0) {
          src = studentsList[0];
        } else if (fromKey) {
          src = fromKey;
        } else {
          src = placeholder;
        }
      }
      // Merge with localStorage overrides
      let merged = { ...src };
      try {
        const raw = localStorage.getItem('student_overrides');
        if (raw && studentId) {
          const overrides = JSON.parse(raw);
          if (overrides && overrides[studentId]) {
            merged = { ...merged, ...overrides[studentId] };
          }
        }
      } catch (_) {}
      return {
        studentName: merged.studentName ?? merged.student ?? merged.name ?? placeholder.studentName,
        email: merged.email ?? merged.user?.email ?? placeholder.email,
        password: merged.password ?? '********',
        dateOfBirth: merged.dateOfBirth ?? merged.date_of_birth ?? placeholder.dateOfBirth,
        phoneNumber: (merged.phoneNumber || merged.phone_number || merged.phone) ? String(merged.phoneNumber || merged.phone_number || merged.phone) : String(placeholder.phoneNumber),
        gender: merged.gender ? String(merged.gender).toLowerCase() : String(placeholder.gender),
        parentName: merged.parentName ?? merged.parent_name ?? merged.parent ?? placeholder.parentName,
        level: (merged.level?.name || merged.level_name || merged.level) ?? placeholder.level,
        modules: Array.isArray(merged.modules) 
          ? merged.modules.map((m: any) => m?.name || m).filter(Boolean) 
          : merged.module ? [merged.module] : placeholder.modules,
        sessions: Array.isArray(merged.sessions) 
          ? merged.sessions.map((s: any) => s?.name || s?.session_name || s?.id?.toString() || s).filter(Boolean) 
          : merged.session ? [String(merged.session)] : [],
        academicYear: merged.academicYear ?? merged.academic_year ?? placeholder.academicYear,
        feePayment: (merged.feePayment ?? merged.total_owed ?? merged.fee_payment ?? merged.fees_payment ?? merged.paid_fees ?? merged.payment) ? String(merged.feePayment ?? merged.total_owed ?? merged.fee_payment ?? merged.fees_payment ?? merged.paid_fees ?? merged.payment) : String(placeholder.feePayment),
      };
    }, [studentData, studentId]);

    return (
      <AddForm
        isOpen={isOpen}
        onClose={onClose}
        initialData={mergedInitial}
        mode="view"
        onDelete={onDelete}
      />
    );
  }

