"use client";
import React from "react";
import AddStudentModal from "@/components/students/AddStudentModal/AddStudentModal";

type EditTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave?: (data: any) => void;
  onDelete?: () => void;
};

export default function EditTeacherModal({ isOpen, onClose, initialData, onSave, onDelete }: EditTeacherModalProps) {
  return (
    <AddStudentModal
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

