"use client";

import React from 'react';
import styles from './SessionCard.module.css';
import Image from 'next/image';

type Session = {
  Module: string;
  teacher: string;
  students?: number;
  date: string;
  time: string;
};

const SessionCard: React.FC<{ session: Session; onRequestDelete?: () => void; onRequestEdit?: () => void }> = ({ session, onRequestDelete, onRequestEdit }) => {
  const handleDelete = () => {
    if (onRequestDelete) onRequestDelete();
  };

  const handleEdit = () => {
    if (onRequestEdit) onRequestEdit();
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <Image src="/icons/sessions.svg" alt="session" width={20} height={20} />
        <div className={styles.cardText}>
          <div className={styles.cardTitle}>{session.Module} - {session.teacher}</div>
          <div className={styles.cardMeta}>{session.date} · {session.time}</div>
        </div>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.editBtn} title="Edit" onClick={handleEdit}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#0f172a" />
            <path d="M20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#0f172a" />
          </svg>
        </button>
        <button className={styles.softDeleteBtn} title="Archive" onClick={handleDelete}>
          <Image src="/icons/delete.svg" alt="archive" width={16} height={16} />
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
