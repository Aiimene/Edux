'use client';

import AddForm, { FormData } from '@/components/UI/AddForm/AddForm';
import enterpriseData from '@/data/enterprise.json';

type EditParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
  onSave?: (data: FormData) => void;
  onDelete?: () => void;
};

export default function EditParentModal({ isOpen, onClose, parentId, onSave, onDelete }: EditParentModalProps) {
  if (!isOpen) return null;

  const parents = (enterpriseData as any).parents || [];
  const found = parents.find((p: any) => String(p.id) === String(parentId) || p.parentName === parentId) || null;

  const mappedInitial = found
    ? {
        studentName: found.parentName ?? '',
        email: found.email ?? '',
        password: found.password ?? '',
        phoneNumber: found.phoneNumber ?? '',
        parentName: found.childName ?? '',
        academicYear: found.academicYear ?? '',
        feePayment: found.feesPayment ?? found.feePayment ?? '',
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

