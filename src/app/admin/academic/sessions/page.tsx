"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import SessionsList from '../../../../components/academic/SessionsList/SessionsList';
import AddSessionModal from '@/components/academic/AddSessionModal/AddSessionModal';
import DashboardCard from '../../../../components/dashboard/DashboardCard/DashboardCard';
import styles from './page.module.css';
import enterpriseData from '../../../../data/enterprise.json';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>(enterpriseData.weeklySessions || []);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionModalMode, setSessionModalMode] = useState<'add' | 'edit'>('add');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingInitial, setEditingInitial] = useState<any>(null);
  const [month, setMonth] = useState('');
  const [monthOpen, setMonthOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement | null>(null);
  const dayInputRef = useRef<HTMLInputElement | null>(null);
  const months = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (monthOpen && monthRef.current && !monthRef.current.contains(e.target as Node)) {
        setMonthOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [monthOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && monthOpen) setMonthOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [monthOpen]);

  const toggleMonth = () => setMonthOpen((s) => !s);

  const selectMonth = (m: string) => {
    setMonth(m);
    setMonthOpen(false);
  };

  const handleNewSession = () => {
    setSessionModalMode('add');
    setEditingIndex(null);
    setEditingInitial(null);
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (index: number) => {
    const target = sessions[index];
    if (!target) return;
    setSessionModalMode('edit');
    setEditingIndex(index);
    setEditingInitial({
      sessionName: target.sessionName || target.Module || '',
      module: target.module || target.Module || '',
      level: target.level || target.Level || '',
      teacher: target.teacher || '',
      startDay: target.startDay || target.date?.split(' - ')[0] || '',
      endDay: target.endDay || target.date?.split(' - ')[1] || '',
      startTime: target.startTime || target.time?.split(' - ')[0] || '',
      endTime: target.endTime || target.time?.split(' - ')[1] || '',
      dayOfWeek: target.dayOfWeek || '',
    });
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = (payload: any) => {
    const mapped = {
      ...payload,
      Module: payload.module,
      level: payload.level,
      teacher: payload.teacher,
      date: payload.startDay && payload.endDay ? `${payload.startDay} - ${payload.endDay}` : payload.startDay,
      time: payload.startTime && payload.endTime ? `${payload.startTime} - ${payload.endTime}` : payload.startTime,
    };

    setSessions((prev) => {
      if (sessionModalMode === 'edit' && editingIndex !== null) {
        const copy = [...prev];
        copy[editingIndex] = { ...copy[editingIndex], ...mapped };
        return copy;
      }
      return [...prev, mapped];
    });
  };

  const handleDeleteSession = (index: number) => {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  };

  const openDayPicker = () => {
    const input = dayInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  return (
    <div className={styles.pageWrap}>
         <div className={styles.greetingSection}>
        <p className={styles.greetingText}>Hello</p>
        <Image src="/icons/hello.svg" alt="hello" width={30} height={30} className={styles.greetingIcon} />
        <p className={styles.enterpriseName}>{enterpriseData.name}</p>
      </div>
      <p className={styles.subtitle}>Track everything from one place</p>
      {/* Stats Cards (same as dashboard, Total Sessions instead of Total Parents) */}
      
      <div className={styles.statsContainer}>
        {[
          {
            icon: 'monthly-profit',
            label: 'Monthly Profit',
            value: `${enterpriseData["Monthly Profit"]}DZD`,
            percentage: `${enterpriseData["monthly profit percentage"]}%`,
            iconSize: 40,
          },
          {
            icon: 'students',
            label: 'Total Students',
            value: enterpriseData['number of students'],
            percentage: `${enterpriseData['students percentage']}%`,
          },
          {
            icon: 'teachers',
            label: 'Total Teachers',
            value: enterpriseData['number of teachers'],
            percentage: `${enterpriseData['teachers percentage']}%`,
          },
          {
            icon: 'timetables',
            label: 'Total Sessions',
            value: enterpriseData['number of sessions'] ?? (enterpriseData.weeklySessions ? enterpriseData.weeklySessions.length : 0),
            percentage: undefined,
          },
        ].map((stat) => (
          <DashboardCard key={String(stat.label)} {...stat} />
        ))}
      </div>
   
     

      <div className={styles.controlsRow}>
        <div className={styles.leftControls}>
          <select className={styles.select} defaultValue="">
            <option value="">Module</option>
            {enterpriseData.selectOptions?.modules?.map((m: string) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select className={styles.select} defaultValue="">
            <option value="">Level</option>
            {enterpriseData.selectOptions?.levels?.map((l: string) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <select className={styles.select} defaultValue="">
            <option value="">Teacher</option>
          </select>
        </div>

        <div className={styles.rightControls}>
          <div className={styles.dateControls}>
            <div ref={monthRef} className={styles.monthControl} onClick={toggleMonth} role="button" tabIndex={0}>
              <Image src="/icons/select-month.svg" alt="Select Month" width={18} height={18} />
              <span className={month ? styles.monthValue : styles.monthPlaceholder}>{month ? month : 'Select Month'}</span>
              {monthOpen && (
                <div className={styles.monthDropdown} role="list">
                  {months.map((m) => (
                    <div
                      key={m}
                      role="listitem"
                      tabIndex={0}
                      className={styles.monthItem}
                      onClick={(e) => { e.stopPropagation(); selectMonth(m); }}
                      onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') selectMonth(m); }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label
              className={styles.dayControl}
              onClick={openDayPicker}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDayPicker(); } }}
              role="button"
              tabIndex={0}
            >
              <Image src="/icons/timetables.svg" alt="Select Day" width={18} height={18} />
              <input ref={dayInputRef} type="date" className={styles.dateInput} aria-label="Select Day" />
            </label>
          </div>

          <button className={styles.primaryBtn} onClick={handleNewSession}>New Session</button>
        </div>
      </div>

      <SessionsList sessions={sessions} onDelete={handleDeleteSession} onEdit={handleEditSession} />

      <AddSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onSave={handleSaveSession}
        initialData={editingInitial}
        mode={sessionModalMode}
      />
    </div>
  );
}
