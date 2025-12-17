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
      mode="edit"
      onSave={onSave}
      onDelete={onDelete}
      entityLabel="Parent"
      hideAcademic={true}
    />
  );
}

