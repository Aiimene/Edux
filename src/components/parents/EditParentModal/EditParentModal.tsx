'use client';

import AddForm, { FormData } from '@/components/UI/AddForm/AddForm';

type EditParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<FormData>;
  onSave?: (data: FormData) => void;
  onDelete?: () => void;
};

export default function EditParentModal({ isOpen, onClose, initialData, onSave, onDelete }: EditParentModalProps) {
  if (!isOpen) return null;


  const mappedInitial = initialData
    ? {
        studentName: initialData.studentName ?? initialData.parentName ?? (initialData as any).name ?? '',
        parentName: initialData.parentName ?? initialData.studentName ?? (initialData as any).name ?? '',
        email: initialData.email ?? '',
        password: initialData.password ?? '',
        phoneNumber: initialData.phoneNumber ?? (initialData as any).phone_number ?? '',
        children: Array.isArray(initialData.children) ? initialData.children : [],
        academicYear: initialData.academicYear ?? '',
        feePayment: initialData.feePayment !== undefined ? String(initialData.feePayment) : '',
        // Add all other fields from FormData with fallback to empty string/array
        dateOfBirth: initialData.dateOfBirth ?? '',
        level: initialData.level ?? '',
        levels: Array.isArray(initialData.levels) ? initialData.levels : [],
        sessions: Array.isArray(initialData.sessions) ? initialData.sessions : [],
        enrollmentDate: initialData.enrollmentDate ?? '',
        paymentMethod: initialData.paymentMethod ? String(initialData.paymentMethod).toLowerCase() : '',
        paymentStatus: initialData.paymentStatus ? String(initialData.paymentStatus).toLowerCase() : '',
        gender: initialData.gender ?? '',
        modules: Array.isArray(initialData.modules) ? initialData.modules : [],
        days: Array.isArray(initialData.days) ? initialData.days : [],
      }
    : undefined;

  return (
    <AddForm
      isOpen={isOpen}
      onClose={onClose}
      initialData={mappedInitial}
      mode="edit"
      onSave={onSave}
      onDelete={onDelete}
      entityLabel="Parent"
      hideAcademic={true}
    />
  );
}

