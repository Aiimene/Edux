"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './LevelCard.module.css';
import ConfirmModal from '@/components/UI/ConfirmModal/ConfirmModal';

type Module = { id: string; name: string };
type Level = {
  id: string;
  name: string;
  modules: Module[];
  students?: number;
};

type LevelCardProps = {
  level: Level;
  onEdit: () => void;
  onDelete: () => void;
  onAddModule: (moduleName: string) => void;
  onRemoveModule: (moduleIdOrName: string) => void;
  availableModules: string[];
};

export default function LevelCard({ 
  level, 
  onEdit, 
  onDelete, 
  onAddModule, 
  onRemoveModule,
  availableModules 
}: LevelCardProps) {
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [showLevelDeleteConfirm, setShowLevelDeleteConfirm] = useState(false);

  const unassignedModules = availableModules.filter(m => !level.modules.some(x => x.name === m));

  const openAddModuleModal = () => {
    setNewModuleName('');
    setShowAddModuleModal(true);
  };

  const saveNewModule = () => {
    const name = newModuleName.trim();
    if (!name) return;
    if (level.modules.some(m => m.name === name)) {
      setShowAddModuleModal(false);
      return;
    }
    onAddModule(name);
    setShowAddModuleModal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveNewModule();
    }
  };

  const handleRemoveModule = (m: Module) => {
    setModuleToDelete(m);
    setShowDeleteConfirm(true);
  };

  const confirmRemoveModule = () => {
    if (moduleToDelete) {
      onRemoveModule(moduleToDelete.id);
      setModuleToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteLevel = () => {
    setShowLevelDeleteConfirm(true);
  };

  const confirmDeleteLevel = () => {
    onDelete();
    setShowLevelDeleteConfirm(false);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.levelName}>{level.name}</h3>
          <div className={styles.actions}>
            <button className={styles.iconBtn} onClick={onEdit} title="Edit level">
              <Image src="/icons/edit.svg" alt="Edit" width={18} height={18} />
            </button>
            <button className={styles.iconBtn} onClick={handleDeleteLevel} title="Delete level">
              <Image src="/icons/delete.svg" alt="Delete" width={18} height={18} />
            </button>
          </div>
        </div>

          {/* Student count removed as requested */}

        <div className={styles.modulesSection}>
          <div className={styles.modulesHeader}>
            <span className={styles.modulesLabel}>Modules ({level.modules.length})</span>
            <button
              className={styles.addModuleButton}
              onClick={openAddModuleModal}
              type="button"
            >
              Add Module
            </button>
          </div>

          <div className={styles.modulesList}>
            {level.modules.length === 0 ? (
              <p className={styles.noModules}>No modules assigned</p>
            ) : (
              level.modules.map(module => (
                <div key={module.id} className={styles.moduleChip}>
                  <span>{module.name}</span>
                  <button
                    className={styles.removeModuleBtn}
                    onClick={() => handleRemoveModule(module)}
                    title="Remove module"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        title="Remove Module?"
        message={`Are you sure you want to remove "${moduleToDelete?.name}" from ${level.name}?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmRemoveModule}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmModal
        open={showLevelDeleteConfirm}
        title="Delete Level?"
        message={`Are you sure you want to delete "${level.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteLevel}
        onCancel={() => setShowLevelDeleteConfirm(false)}
      />

      {showAddModuleModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h4>Add Module</h4>
              <button className={styles.modalClose} onClick={() => setShowAddModuleModal(false)} aria-label="Close">×</button>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.modalLabel}>Module Name</label>
              <input
                className={styles.modalInput}
                type="text"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={unassignedModules[0] || 'e.g., Physics'}
                autoFocus
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalSecondary} onClick={() => setShowAddModuleModal(false)}>Cancel</button>
              <button className={styles.modalPrimary} onClick={saveNewModule}>Add</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
