"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Select from 'react-select';
import styles from './AddLevelModal.module.css';

type AddLevelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (levelData: { name: string; modules: string[] }) => void;
  mode?: 'add' | 'edit';
  initialData?: { name: string; modules: string[] };
  availableModules: string[];
};

export default function AddLevelModal({
  isOpen,
  onClose,
  onSave,
  mode = 'add',
  initialData,
  availableModules
}: AddLevelModalProps) {
  const [levelName, setLevelName] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setLevelName(initialData.name);
        setSelectedModules(initialData.modules);
      } else {
        setLevelName('');
        setSelectedModules([]);
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (levelName.trim()) {
      onSave({ name: levelName, modules: selectedModules });
      onClose();
    }
  };

  const moduleOptions = availableModules.map(m => ({ value: m, label: m }));

  const multiSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#F8F9FA',
      borderColor: '#e5e7eb',
      borderRadius: 10,
      minHeight: 48,
      width: '100%',
      boxShadow: 'none',
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#E8F3FF',
      borderRadius: 16,
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#1B2B4D',
      fontWeight: 500,
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#6b7280',
      ':hover': {
        backgroundColor: '#d0e4ff',
        color: '#1B2B4D',
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#fff',
      borderRadius: 8,
      boxShadow: '0 6px 18px rgba(11,20,30,0.08)',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused || state.isSelected ? '#E8F3FF' : '#fff',
      color: '#1B2B4D',
    }),
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Image src="/icons/levels.svg" alt="Level" width={24} height={24} />
            <h3>{mode === 'edit' ? 'Edit Level' : 'Add New Level'}</h3>
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

          <div className={styles.formGroup}>
            <label className={styles.label}>Modules</label>
            <Select
              isMulti
              options={moduleOptions}
              value={moduleOptions.filter(opt => selectedModules.includes(opt.value))}
              onChange={(selected) => setSelectedModules(selected ? selected.map(s => s.value) : [])}
              placeholder="Select modules for this level"
              styles={multiSelectStyles}
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
