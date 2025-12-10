'use client';

import AddForm, { FormData } from '@/components/UI/AddForm/AddForm';

type AddParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  mode?: 'add' | 'edit' | 'view';
  onSave?: (data: FormData) => void;
};

export default function AddParentModal({ isOpen, onClose, initialData, mode = 'add', onSave }: AddParentModalProps) {
  const mappedInitial = initialData
    ? {
        studentName: initialData.parentName ?? '',
        email: initialData.email ?? '',
        password: initialData.password ?? '',
        phoneNumber: initialData.phoneNumber ?? '',
        parentName: initialData.childName ?? '',
        academicYear: initialData.academicYear ?? '',
        feePayment: initialData.feesPayment ?? initialData.feePayment ?? '',
      }
    : undefined;

  return (
    <AddForm
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
