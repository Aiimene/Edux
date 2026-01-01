
'use client';

import AddForm, { FormData } from '@/components/UI/AddForm/AddForm';
import { useMemo } from 'react';

type ParentProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parentData?: Partial<FormData> & { id?: string };
  onDelete?: () => void;
};

const ParentProfileModal = ({ isOpen, onClose, parentData, onDelete }: ParentProfileModalProps) => {
  if (!isOpen) return null;

  // Merge parentData with localStorage overrides for full prefill
  const parentId = parentData?.id || parentData?.email || '';
  const mergedInitial = useMemo(() => {
    let merged = { ...parentData };
    try {
      if (parentId) {
        const raw = localStorage.getItem('parent_overrides');
        if (raw) {
          const overrides = JSON.parse(raw);
          if (overrides && overrides[parentId]) {
            merged = { ...merged, ...overrides[parentId] };
          }
        }
      }
    } catch (_) {}
    return {
      studentName: merged.studentName ?? merged.parentName ?? (merged as any).name ?? '',
      parentName: merged.parentName ?? merged.studentName ?? (merged as any).name ?? '',
      email: merged.email ?? '',
      password: merged.password ?? '',
      phoneNumber: merged.phoneNumber ?? (merged as any).phone_number ?? '',
      children: Array.isArray(merged.children) ? merged.children : [],
      academicYear: merged.academicYear ?? '',
      feePayment: merged.feePayment !== undefined ? String(merged.feePayment) : '',
      dateOfBirth: merged.dateOfBirth ?? '',
      paymentStatus: merged.paymentStatus ? String(merged.paymentStatus).toLowerCase() : '',
      gender: merged.gender ?? '',
      modules: Array.isArray(merged.modules) ? merged.modules : [],
      days: Array.isArray(merged.days) ? merged.days : [],
    };
  }, [parentData, parentId]);

  return (
    <AddForm
      isOpen={isOpen}
      onClose={onClose}
      initialData={mergedInitial}
      mode="view"
      onDelete={onDelete}
      entityLabel="Parent"
      hideAcademic={true}
    />
  );
};

export default ParentProfileModal;

