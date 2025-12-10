'use client';

import styles from './TeacherProfileModal.module.css';

type TeacherProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
};

export default function TeacherProfileModal({ isOpen, onClose, teacherId }: TeacherProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Teacher Profile</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          {/* Add your profile content here */}
          <p>Teacher Profile - ID: {teacherId}</p>
        </div>
      </div>
    </div>
  );
}

