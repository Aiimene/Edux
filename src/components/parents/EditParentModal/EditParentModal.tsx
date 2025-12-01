'use client';

import AddStudentModal from '@/components/students/AddStudentModal/AddStudentModal';
import enterpriseData from '@/data/enterprise.json';

type EditParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
  onSave?: (data: any) => void;
};

// Wrapper that locates the parent in enterprise.json and forwards the
// mapped data to the canonical modal in edit mode.
export default function EditParentModal({ isOpen, onClose, parentId, onSave }: EditParentModalProps) {
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
    <AddStudentModal
      isOpen={isOpen}
      onClose={onClose}
      initialData={mappedInitial}
      mode="edit"
      onSave={onSave}
      entityLabel="Parent"
      hideAcademic={true}
    />
  );
}

