'use client';

import styles from './ParentProfileModal.module.css';

type ParentProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
};

export default function ParentProfileModal({ isOpen, onClose, parentId }: ParentProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Parent Profile</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          {/* Add your profile content here */}
          <p>Parent Profile - ID: {parentId}</p>
        </div>
      </div>
    </div>
  );
}

