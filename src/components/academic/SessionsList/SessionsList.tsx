"use client";

import React, { useState } from 'react';
import styles from './SessionsList.module.css';
import SessionCard from './SessionCard';
import ConfirmModal from '../../UI/ConfirmModal/ConfirmModal';

type Session = {
  Module: string;
  teacher: string;
  students: number;
  date: string;
  time: string;
};

const SessionsList: React.FC<{ sessions: Session[] }> = ({ sessions = [] }) => {
  const [localSessions, setLocalSessions] = useState<Session[]>(sessions);
  const [expanded, setExpanded] = useState(false);

  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);

  const openConfirm = (index: number) => setConfirmIndex(index);
  const closeConfirm = () => setConfirmIndex(null);

  const handleDelete = (index: number) => {
    setLocalSessions((prev) => prev.filter((_, i) => i !== index));
    closeConfirm();
  };

  const VISIBLE_COUNT = 8;

  const visibleSessions = expanded ? localSessions : localSessions.slice(0, VISIBLE_COUNT);

  return (
    <div className={styles.listWrap}>
      {visibleSessions.map((s, i) => (
        <SessionCard key={`${s.Module}-${i}`} session={s} onRequestDelete={() => openConfirm(i)} />
      ))}

      {localSessions.length > VISIBLE_COUNT && (
        <div className={styles.expandWrap}>
          <button
            className={`${styles.expandBtn} ${expanded ? styles.expandBtnBox : styles.expandBtnLink}`}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? 'Show Less' : `See All (${localSessions.length})`}
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmIndex !== null}
        title="Delete session"
        message="Are you sure you want to delete this session? This action can be undone from the archive."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => confirmIndex !== null && handleDelete(confirmIndex)}
        onCancel={closeConfirm}
      />
    </div>
  );
};

export default SessionsList;
