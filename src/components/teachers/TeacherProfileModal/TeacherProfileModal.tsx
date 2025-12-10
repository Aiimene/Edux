"use client";
import AddForm, { FormData } from "@/components/UI/AddForm/AddForm";

type TeacherProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<FormData>;
  onDelete?: () => void;
};

export default function TeacherProfileModal({ isOpen, onClose, initialData, onDelete }: TeacherProfileModalProps) {
  return (
    <AddForm
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialData}
      mode="view"
      onDelete={onDelete}
      entityLabel="Teacher"
    />
  );
}

