'use client';

import AddForm, { FormData } from '@/components/UI/AddForm/AddForm';
import enterpriseData from '@/data/enterprise.json';

type ParentProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parentData?: Partial<FormData>;
  onDelete?: () => void;
};

export default function ParentProfileModal({ isOpen, onClose, parentData, onDelete }: ParentProfileModalProps) {
  if (!isOpen) return null;

  const mappedInitial = parentData
    ? {
        studentName: parentData.studentName ?? parentData.parentName ?? (parentData as any).name ?? '',
        email: parentData.email ?? '',
        password: parentData.password ?? '',
        phoneNumber: parentData.phoneNumber ?? (parentData as any).phone_number ?? '',
      }
    : undefined;

  return (
    <AddForm
      isOpen={isOpen}
      onClose={onClose}
      initialData={mappedInitial}
      mode="view"
      onDelete={onDelete}
      entityLabel="Parent"
      hideAcademic={true}
    />
  );
}

