'use client';


import AddForm, { FormData } from '@/components/UI/AddForm/AddForm';
import enterprise from '@/data/enterprise.json';
import { useMemo } from 'react';

type EditStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentData?: any;
  onSave?: (data: FormData) => void;
  onDelete?: () => void;
};



  export default function EditStudentModal({ isOpen, onClose, studentId, studentData, onSave, onDelete }: any) {
    // Compose merged initial data from backend, localStorage, and fallback
    const mergedInitial = useMemo(() => {
      // Prefer explicit studentData, then try to find a student by `studentId` (id, email or name)
      const studentsList = (enterprise as any)['studentsOfThisMonth']
        || (enterprise as any)['students of this month']
        || [];
      let src: any = studentData ?? null;
      if (!src && studentId) {
        src = studentsList.find((s: any) => s.id === studentId || s.email === studentId || s.studentName === studentId) ?? null;
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
        const fromKey = (enterprise as any)['Edit this students '] || (enterprise as any)['editStudent'] || null;
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
        studentName: merged.studentName ?? merged.student ?? placeholder.studentName,
        parentName: merged.parentName ?? merged.parent ?? placeholder.parentName,
        email: merged.email ?? placeholder.email,
        password: merged.password ?? '',
        dateOfBirth: merged.dateOfBirth ?? placeholder.dateOfBirth,
        phoneNumber: merged.phoneNumber ? String(merged.phoneNumber) : String(placeholder.phoneNumber),
        gender: merged.gender ? String(merged.gender).toLowerCase() : String(placeholder.gender),
        level: merged.level ?? placeholder.level,
        levels: Array.isArray(merged.levels) ? merged.levels : [],
        sessions: Array.isArray(merged.sessions) ? merged.sessions.map(String) : merged.session ? [String(merged.session)] : [String(placeholder.sessions)],
        feePayment: merged.feePayment !== undefined ? String(merged.feePayment) : String(placeholder.feePayment),
        enrollmentDate: merged.enrollmentDate ?? '',
        paymentMethod: merged.paymentMethod ? String(merged.paymentMethod).toLowerCase() : '',
        paymentStatus: merged.paymentStatus ? String(merged.paymentStatus).toLowerCase() : '',
        modules: merged.module ? [merged.module] : Array.isArray(merged.modules) ? merged.modules : placeholder.modules,
        academicYear: merged.academicYear ?? '',
        children: Array.isArray(merged.children) ? merged.children : [],
        days: Array.isArray(merged.days) ? merged.days : [],
      };
    }, [studentData, studentId]);

    const handleSave = (data: FormData) => {
      if (onSave) onSave(data);
      else console.log('Save student (static):', data);
    };

    const handleDelete = () => {
      if (onDelete) onDelete();
      else console.log('Delete student (static):', studentId);
    };

    return (
      <AddForm
        isOpen={isOpen}
        onClose={onClose}
        initialData={mergedInitial}
        mode="edit"
        onSave={handleSave}
        onDelete={handleDelete}
      />
    );
  }

