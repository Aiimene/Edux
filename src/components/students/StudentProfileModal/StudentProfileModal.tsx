'use client';


import AddStudentModal from '../AddStudentModal/AddStudentModal';
import enterprise from '@/data/enterprise.json';

type StudentProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  // optional: a student object can be passed later when backend is ready
  studentData?: any;
};

export default function StudentProfileModal({ isOpen, onClose, studentId, studentData }: StudentProfileModalProps) {
  // Prefer explicit studentData, then try to find a student by `studentId` (id, email or name)
  // in the available students lists in `enterprise.json`. Support multiple possible keys.
  const studentsList = (enterprise as any)['studentsOfThisMonth']
    || (enterprise as any)['students of this month']
    || (enterprise as any)['studentsOfThisMonth']
    || [];
  let src: any = studentData ?? null;
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

  const initial = {
    studentName: src.studentName ?? src.student ?? placeholder.studentName,
    email: src.email ?? placeholder.email,
    dateOfBirth: src.dateOfBirth ?? placeholder.dateOfBirth,
    phoneNumber: src.phoneNumber ? String(src.phoneNumber) : String(placeholder.phoneNumber),
    gender: src.gender ? String(src.gender).toLowerCase() : String(placeholder.gender),
    parentName: src.parentName ?? src.parent ?? placeholder.parentName,
    level: src.level ?? placeholder.level,
    modules: src.module ? [src.module] : src.modules ?? placeholder.modules,
    sessions: src.sessions ? [String(src.sessions)] : src.session ? [String(src.session)] : [String(placeholder.sessions)],
    academicYear: src.academicYear ?? src['academic year'] ?? placeholder.academicYear,
    feePayment: src.feePayment ? String(src.feePayment) : String(placeholder.feePayment),
  };

  return (
    <AddStudentModal
      isOpen={isOpen}
      onClose={onClose}
      initialData={initial}
      mode="view"
    />
  );
}

