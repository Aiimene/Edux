"use client";
import AddForm, { FormData } from "@/components/UI/AddForm/AddForm";

type EditTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<FormData>;
  onSave?: (data: FormData) => void;
  onDelete?: () => void;
};

export default function EditTeacherModal({ isOpen, onClose, initialData, onSave, onDelete }: EditTeacherModalProps) {
  return (
    <AddForm
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialData}
      mode="edit"
      onSave={onSave}
      onDelete={onDelete}
      entityLabel="Teacher"
    />
  );
}

