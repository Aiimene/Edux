'use client';

import AddStudentModal from '@/components/students/AddStudentModal/AddStudentModal';

type AddParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  mode?: 'add' | 'edit' | 'view';
  onSave?: (data: any) => void;
};

// Thin wrapper: reuse the canonical two-step modal and map parent fields
// into the modal's expected shape. This keeps a single implementation
// for the complex form while providing a separate component for parents.
export default function AddParentModal({ isOpen, onClose, initialData, mode = 'add', onSave }: AddParentModalProps) {
  // Map enterprise.json parent shape to the canonical modal fields
  const mappedInitial = initialData
    ? {
        studentName: initialData.parentName ?? '', // main label becomes Parent Name
        email: initialData.email ?? '',
        password: initialData.password ?? '',
        phoneNumber: initialData.phoneNumber ?? '',
        parentName: initialData.childName ?? '', // childName maps to modal's parentName field
        academicYear: initialData.academicYear ?? '',
        feePayment: initialData.feesPayment ?? initialData.feePayment ?? '',
      }
    : undefined;

  return (
    <AddStudentModal
      isOpen={isOpen}
      onClose={onClose}
      initialData={mappedInitial}
      mode={mode}
      onSave={onSave}
      entityLabel="Parent"
      hideAcademic={true}
    />
  );
}

