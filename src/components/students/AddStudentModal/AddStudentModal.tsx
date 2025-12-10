'use client';
import AddForm, { FormData } from '@/components/UI/AddForm/AddForm';

type AddStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<FormData>;
  mode?: 'add' | 'edit' | 'view';
  onSave?: (data: FormData) => void;
  onDelete?: (id?: string) => void;
  entityLabel?: string;
  hideAcademic?: boolean;
};

export default function AddStudentModal({ 
  isOpen, 
  onClose, 
  initialData, 
  mode = 'add', 
  onSave, 
  onDelete, 
  entityLabel = 'Student', 
  hideAcademic = false 
}: AddStudentModalProps) {
  return (
    <AddForm
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialData}
      mode={mode}
      onSave={onSave}
      onDelete={onDelete}
      entityLabel={entityLabel}
      hideAcademic={hideAcademic}
    />
  );
}

