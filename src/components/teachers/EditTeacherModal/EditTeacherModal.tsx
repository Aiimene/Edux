"use client";

import AddForm, { FormData } from "@/components/UI/AddForm/AddForm";
import { useEffect, useMemo, useState } from "react";

type EditTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<FormData> & { id?: string };
  onSave?: (data: FormData) => void;
  onDelete?: () => void;
};



export default function EditTeacherModal({ isOpen, onClose, initialData, onSave, onDelete }: EditTeacherModalProps) {
  // Get teacher ID for localStorage key
  const teacherId = initialData?.id || initialData?.email || "";

  // Merge backend data with localStorage overrides
  const mergedInitial = useMemo(() => {
    let merged: any = { ...initialData };
    try {
      if (teacherId) {
        const raw = localStorage.getItem("teacher_overrides");
        if (raw) {
          const overrides = JSON.parse(raw);
          if (overrides && overrides[teacherId]) {
            merged = { ...merged, ...overrides[teacherId] };
          }
        }
      }
    } catch (_) {}
    return {
      studentName: merged.studentName ?? '',
      parentName: merged.parentName ?? '',
      email: merged.email ?? '',
      password: merged.password ?? '',
      phoneNumber: merged.phoneNumber ?? '',
      children: Array.isArray(merged.children) ? merged.children : [],
      academicYear: merged.academicYear ?? '',
      feePayment: merged.feePayment !== undefined ? String(merged.feePayment) : '',
      dateOfBirth: merged.dateOfBirth ?? '',
      level: merged.level ?? '',
      levels: Array.isArray(merged.levels) ? merged.levels : [],
      sessions: Array.isArray(merged.sessions) ? merged.sessions : [],
      enrollmentDate: merged.enrollmentDate ?? '',
      paymentMethod: merged.paymentMethod ? String(merged.paymentMethod).toLowerCase() : '',
      paymentStatus: merged.paymentStatus ? String(merged.paymentStatus).toLowerCase() : '',
      gender: merged.gender ?? '',
      modules: Array.isArray(merged.modules_list) 
        ? merged.modules_list 
        : Array.isArray(merged.modules) 
          ? merged.modules.map((m: any) => m?.name || m).filter(Boolean) 
          : [],
      days: Array.isArray(merged.days) ? merged.days : [],
      startDay: merged.startDay ?? merged.start_day ?? '',
      endDay: merged.endDay ?? merged.end_day ?? '',
    };
  }, [initialData, teacherId]);

  return (
    <AddForm
      isOpen={isOpen}
      onClose={onClose}
      initialData={mergedInitial}
      mode="edit"
      onSave={onSave}
      onDelete={onDelete}
      entityLabel="Teacher"
    />
  );
}

