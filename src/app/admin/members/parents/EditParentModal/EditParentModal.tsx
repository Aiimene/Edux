'use client';

import styles from './EditParentModal.module.css';

type EditParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
};

export default function EditParentModal({ isOpen, onClose, parentId }: EditParentModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Parent</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          {/* Add your edit form here */}
          <p>Edit Parent Form - ID: {parentId}</p>
        </div>
      </div>
    </div>
  );
}

