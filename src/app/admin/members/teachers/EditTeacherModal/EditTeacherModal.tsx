'use client';

import styles from './EditTeacherModal.module.css';

type EditTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
};

export default function EditTeacherModal({ isOpen, onClose, teacherId }: EditTeacherModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Teacher</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          {/* Add your edit form here */}
          <p>Edit Teacher Form - ID: {teacherId}</p>
        </div>
      </div>
    </div>
  );
}

