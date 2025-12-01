'use client';

import styles from './AddParentModal.module.css';

type AddParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddParentModal({ isOpen, onClose }: AddParentModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Parent</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          {/* Add your form here */}
          <p>Add Parent Form</p>
        </div>
      </div>
    </div>
  );
}

