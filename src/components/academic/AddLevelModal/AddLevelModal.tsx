"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './AddLevelModal.module.css';

type AddLevelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (levelData: { name: string }) => void;
  mode?: 'add' | 'edit';
  initialData?: { name: string };
};

export default function AddLevelModal({
  isOpen,
  onClose,
  onSave,
  mode = 'add',
  initialData,
}: AddLevelModalProps) {
  const [levelName, setLevelName] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setLevelName(initialData.name);
      } else {
        setLevelName('');
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (levelName.trim()) {
      onSave({ name: levelName });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Image src="/icons/levels.svg" alt="Level" width={24} height={24} />
            <h3 className={styles.headerTitle}>{mode === 'edit' ? 'Edit Level' : 'Add New Level'}</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Level Name</label>
            <input
              type="text"
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
              placeholder="e.g., First Year (High School)"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primary}>
              {mode === 'edit' ? 'Save Changes' : 'Add Level'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
