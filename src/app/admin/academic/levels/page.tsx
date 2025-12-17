"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import LevelCard from '@/components/academic/LevelCard/LevelCard';
import AddLevelModal from '@/components/academic/AddLevelModal/AddLevelModal';
import styles from './page.module.css';
import enterpriseData from '@/data/enterprise.json';

type Level = {
  id: string;
  name: string;
  modules: string[];
  students?: number;
};

export default function LevelsPage() {
  const initialLevels = enterpriseData.selectOptions?.levels || [];
  const allModules = enterpriseData.selectOptions?.modules || [];
  
  // Convert to Level objects with modules
  const [levels, setLevels] = useState<Level[]>(
    initialLevels.map((levelName, index) => ({
      id: `level-${index}`,
      name: levelName,
      modules: allModules.slice(0, 3), // Default modules for demo
      students: 25 + (index * 5) // Fixed number to avoid hydration mismatch
    }))
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);

  const handleAddLevel = () => {
    setModalMode('add');
    setEditingLevel(null);
    setIsModalOpen(true);
  };

  const handleEditLevel = (level: Level) => {
    setModalMode('edit');
    setEditingLevel(level);
    setIsModalOpen(true);
  };

  const handleSaveLevel = (levelData: { name: string; modules: string[] }) => {
    if (modalMode === 'edit' && editingLevel) {
      setLevels(prev => prev.map(l => 
        l.id === editingLevel.id 
          ? { ...l, name: levelData.name, modules: levelData.modules }
          : l
      ));
    } else {
      const newLevel: Level = {
        id: `level-${Date.now()}`,
        name: levelData.name,
        modules: levelData.modules,
        students: 0
      };
      setLevels(prev => [...prev, newLevel]);
    }
  };

  const handleDeleteLevel = (levelId: string) => {
    setLevels(prev => prev.filter(l => l.id !== levelId));
  };

  const handleAddModule = (levelId: string, moduleName: string) => {
    setLevels(prev => prev.map(level => {
      if (level.id === levelId && !level.modules.includes(moduleName)) {
        return { ...level, modules: [...level.modules, moduleName] };
      }
      return level;
    }));
  };

  const handleRemoveModule = (levelId: string, moduleName: string) => {
    setLevels(prev => prev.map(level => {
      if (level.id === levelId) {
        return { ...level, modules: level.modules.filter(m => m !== moduleName) };
      }
      return level;
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.titleWrap}>
          <div className={styles.titleRow}>
            <Image src="/icons/levels.svg" alt="Levels" width={28} height={28} />
            <h1 className={styles.title}>Academic Levels</h1>
          </div>
          <p className={styles.subtitle}>Manage and track all student information</p>
        </div>
        <button className={styles.addButton} onClick={handleAddLevel}>
          <span className={styles.addButtonIcon}>+</span>
          <span>New Level</span>
        </button>
      </div>

      {/* Stats cards removed per request */}

      <div className={styles.levelsGrid}>
        {levels.map(level => (
          <LevelCard
            key={level.id}
            level={level}
            onEdit={() => handleEditLevel(level)}
            onDelete={() => handleDeleteLevel(level.id)}
            onAddModule={(moduleName) => handleAddModule(level.id, moduleName)}
            onRemoveModule={(moduleName) => handleRemoveModule(level.id, moduleName)}
            availableModules={allModules}
          />
        ))}
      </div>

      <AddLevelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLevel}
        mode={modalMode}
        initialData={editingLevel ? { name: editingLevel.name, modules: editingLevel.modules } : undefined}
        availableModules={allModules}
      />
    </div>
  );
}
