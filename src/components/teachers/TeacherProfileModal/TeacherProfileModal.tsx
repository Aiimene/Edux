"use client";
import React from "react";
import AddStudentModal from "@/components/students/AddStudentModal/AddStudentModal";

type TeacherProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
};

export default function TeacherProfileModal({ isOpen, onClose, initialData }: TeacherProfileModalProps) {
  return (
    <AddStudentModal
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialData}
      mode="view"
      entityLabel="Teacher"
    />
  );
}

