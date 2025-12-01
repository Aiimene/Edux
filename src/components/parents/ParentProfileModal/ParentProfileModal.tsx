'use client';

import AddStudentModal from '@/components/students/AddStudentModal/AddStudentModal';
import enterpriseData from '@/data/enterprise.json';

type ParentProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
};

// Reuse canonical modal in view mode to show parent profile details.
export default function ParentProfileModal({ isOpen, onClose, parentId }: ParentProfileModalProps) {
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
      mode="view"
      entityLabel="Parent"
      hideAcademic={true}
    />
  );
}

