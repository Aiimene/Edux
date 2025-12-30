"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import LevelCard from '@/components/academic/LevelCard/LevelCard';
import AddLevelModal from '@/components/academic/AddLevelModal/AddLevelModal';
import styles from './page.module.css';
import { getLevels, createLevel, updateLevel, deleteLevel, addModuleToLevel, deleteModule } from '@/lib/api/levels';
import { getStudents } from '@/lib/api/students';

type Module = {
  id: string;
  name: string;
};

type Level = {
  id: string;
  name: string;
  modules: Module[];
  students?: number;
};

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [allModules, setAllModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [levelsRes, studentsRes] = await Promise.all([
        getLevels(),
        // If students endpoint fails, continue with empty list
        getStudents().catch(() => [] as any[]),
      ]);

      const levelsData = Array.isArray(levelsRes) ? levelsRes : (levelsRes.results || []);
      const studentsData = Array.isArray(studentsRes) ? studentsRes : (studentsRes?.results || []);

      // Build student count map by level id/name
      const countById: Record<string, number> = {};
      const countByName: Record<string, number> = {};
      studentsData.forEach((s: any) => {
        const levelId = s?.level?.id ?? s?.level_id ?? s?.level?.level_id;
        const levelName = s?.level?.name ?? s?.level_name ?? s?.level;
        if (levelId) {
          const key = levelId.toString();
          countById[key] = (countById[key] || 0) + 1;
        } else if (levelName) {
          const key = levelName.toString();
          countByName[key] = (countByName[key] || 0) + 1;
        }
      });

      // Build global module name list for placeholder purposes
      const transformed: Level[] = levelsData.map((l: any) => {
        const id = l.id?.toString() || '';
        const name = l.name || '';
        const fallbackCount = l.students_count || 0;
        const students = countById[id] ?? countByName[name] ?? fallbackCount;
        return {
          id,
          name,
          modules: (l.modules || []).map((m: any) => ({ id: m.id?.toString() || '', name: m.name || '' })),
          students,
        };
      });
      const moduleNames = [...new Set(transformed.flatMap(l => l.modules.map(m => m.name)))].sort();
      setAllModules(moduleNames);
      setLevels(transformed);
    } catch (err) {
      console.error('Failed to load levels:', err);
      setError('Failed to load levels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSaveLevel = async (levelData: { name: string }) => {
    try {
      setError(null);
      if (modalMode === 'edit' && editingLevel) {
        await updateLevel(editingLevel.id, { 
          name: levelData.name, 
          description: '', 
          order: 0
        });
      } else {
        await createLevel({ 
          name: levelData.name, 
          description: '', 
          order: levels.length
        });
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving level:', err);
      const msg = err?.response?.data?.error || err?.response?.data?.name?.[0] || err?.message || 'Failed to save level';
      setError(msg);
    }
  };

  const handleDeleteLevel = async (levelId: string) => {
    try {
      await deleteLevel(levelId);
      await fetchData();
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete level';
      setError(msg);
    }
  };

  const handleAddModule = async (levelId: string, moduleName: string) => {
    try {
      const created = await addModuleToLevel(levelId, { name: moduleName, price_per_session: 0 });
      setLevels(prev => prev.map(level => {
        if (level.id === levelId) {
          // avoid duplicates
          if (level.modules.some(m => m.name.toLowerCase() === moduleName.toLowerCase())) return level;
          return { ...level, modules: [...level.modules, { id: created.id?.toString?.() || created.id, name: created.name }] };
        }
        return level;
      }));
    } catch (err) {
      console.error('Failed to add module:', err);
      setError('Failed to add module');
    }
  };

  const handleRemoveModule = async (levelId: string, moduleIdOrName: string) => {
    try {
      // Find module id if a name was provided
      const level = levels.find(l => l.id === levelId);
      const moduleEntry = level?.modules.find(m => m.id === moduleIdOrName || m.name === moduleIdOrName);
      const moduleId = moduleEntry?.id || moduleIdOrName;
      await deleteModule(moduleId);
      setLevels(prev => prev.map(l => l.id === levelId ? { ...l, modules: l.modules.filter(m => m.id !== moduleId) } : l));
    } catch (err) {
      console.error('Failed to remove module:', err);
      setError('Failed to remove module');
    }
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

      {loading && <div className={styles.loading}>Loading levels...</div>}
      {error && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c33',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#c33',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >×</button>
        </div>
      )}

      {!loading && (
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
      )}

      <AddLevelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLevel}
        mode={modalMode}
        initialData={editingLevel ? { name: editingLevel.name } : undefined}
      />
    </div>
  );
}
