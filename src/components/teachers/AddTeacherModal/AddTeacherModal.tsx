
"use client";
import React from "react";
import AddStudentModal from "@/components/students/AddStudentModal/AddStudentModal";

type AddTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave?: (data: any) => void;
};

export default function AddTeacherModal({ isOpen, onClose, initialData, onSave }: AddTeacherModalProps) {
  return (
    <AddStudentModal
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialData}
      mode="add"
      onSave={onSave}
      entityLabel="Teacher"
    />
  );
}

