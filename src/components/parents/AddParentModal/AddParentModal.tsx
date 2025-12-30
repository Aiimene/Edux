'use client';

import AddForm, { FormData } from '@/components/UI/AddForm/AddForm';

type AddParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<FormData>;
  mode?: 'add' | 'edit' | 'view';
  onSave?: (data: FormData) => void;
};

export default function AddParentModal({ isOpen, onClose, initialData, mode = 'add', onSave }: AddParentModalProps) {
  const mappedInitial = initialData
    ? {
        studentName: initialData.studentName ?? initialData.parentName ?? (initialData as any).name ?? '',
        email: initialData.email ?? '',
        password: initialData.password ?? '',
        phoneNumber: initialData.phoneNumber ?? (initialData as any).phone_number ?? '',
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
