
"use client";
import AddForm, { FormData } from "@/components/UI/AddForm/AddForm";

type AddTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<FormData>;
  onSave?: (data: FormData) => void;
  onDelete?: () => void;
};

export default function AddTeacherModal({ isOpen, onClose, initialData, onSave, onDelete }: AddTeacherModalProps) {
  return (
    <AddForm
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialData}
      mode="add"
      onSave={onSave}
      onDelete={onDelete}
      entityLabel="Teacher"
    />
  );
}

