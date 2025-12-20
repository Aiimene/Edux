"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import SessionsList from '../../../../components/academic/SessionsList/SessionsList';
import AddSessionModal from '@/components/academic/AddSessionModal/AddSessionModal';
import DashboardCard from '../../../../components/dashboard/DashboardCard/DashboardCard';
import styles from './page.module.css';
import { getSessions, createSession, updateSession, deleteSession } from '@/api/sessions';
import { getTeachers } from '@/api/teachers';
import { getCourses } from '@/api/levels';
import useLevels from '@/hooks/useLevels';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionModalMode, setSessionModalMode] = useState<'add' | 'edit'>('add');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingInitial, setEditingInitial] = useState<any>(null);
  const [month, setMonth] = useState('');
  const [monthOpen, setMonthOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement | null>(null);
  const dayInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { levels: dynamicLevels } = useLevels();
  const months = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];

  const dayNumberToName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayNameToNumber: Record<string, number> = {
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
    'Saturday': 5,
    'Sunday': 6,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sessionsRes, teachersRes, coursesRes] = await Promise.all([
        getSessions(),
        getTeachers(),
        getCourses(),
      ]);
      const sessionsData = Array.isArray(sessionsRes) ? sessionsRes : (sessionsRes.results || []);
      const teachersData = Array.isArray(teachersRes) ? teachersRes : (teachersRes.results || []);
      const coursesData = Array.isArray(coursesRes) ? coursesRes : (coursesRes.results || []);
      setTeachers(teachersData);
      setCourses(coursesData);
      const transformed = sessionsData.map((s: any) => ({
        id: s.id?.toString() || '',
        sessionName: s.name || '',
        Module: s.name || '',
        module: s.name || '',
        teacher: s.teacher_name || '',
        time: `${s.start_time || ''} - ${s.end_time || ''}`,
        startTime: s.start_time || '',
        endTime: s.end_time || '',
        dayOfWeek: s.day_name || dayNumberToName[s.day_of_week] || '',
        day_of_week: s.day_of_week,
        status: s.status || 'active',
        students_count: s.students_count || 0,
      }));
      setSessions(transformed);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError('Failed to load sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSaveSession = async (payload: any) => {
    try {
      setError(null);
      const teacher = teachers.find((t: any) => (t.name || t.teacherName) === payload.teacher);
      const course = courses.find((c: any) => c.name === payload.module);
      if (!teacher) {
        setError('Teacher not found. Please select a valid teacher.');
        return;
      }
      if (!course) {
        setError('Module not found. Please select a valid module.');
        return;
      }
      const dayOfWeek = Array.isArray(payload.dayOfWeek)
        ? dayNameToNumber[payload.dayOfWeek[0]] ?? 0
        : dayNameToNumber[payload.dayOfWeek] ?? 0;
      const sessionPayload = {
        name: payload.sessionName || payload.module,
        course_id: course.id,
        teacher_id: teacher.id,
        day_of_week: dayOfWeek,
        start_time: payload.startTime,
        end_time: payload.endTime,
        status: 'active',
      };
      if (sessionModalMode === 'edit' && editingIndex !== null) {
        const id = sessions[editingIndex]?.id;
        await updateSession(id, sessionPayload);
      } else {
        await createSession(sessionPayload);
      }
      await fetchData();
      setIsSessionModalOpen(false);
    } catch (err: any) {
      console.error('Error saving session:', err);
      const msg = err?.response?.data?.error || err?.message || 'Failed to save session';
      setError(msg);
    }
  };

  const handleDeleteSession = async (index: number) => {
    setDeleteError(null);
    const id = sessions[index]?.id;
    if (!id) {
      setDeleteError('Session ID not found');
      return;
    }
    try {
      await deleteSession(id);
      await fetchData();
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete session';
      setDeleteError(msg);
    }
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
        <p className={styles.enterpriseName}>Elite School</p>
      </div>
      <p className={styles.subtitle}>Track everything from one place</p>
      {/* Stats Cards (same as dashboard, Total Sessions instead of Total Parents) */}
      
      {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading sessions...</div>}
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
            style={{ background: 'none', border: 'none', color: '#c33', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
          >×</button>
        </div>
      )}
      {deleteError && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          color: '#856404',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            style={{ background: 'none', border: 'none', color: '#856404', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
          >×</button>
        </div>
      )}
   
     

      <div className={styles.controlsRow}>
        <div className={styles.leftControls}>
          <select className={styles.select} defaultValue="">
            <option value="">Module</option>
            {courses.map((c: any) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select className={styles.select} defaultValue="">
            <option value="">Level</option>
            {dynamicLevels.map((l) => (
              <option key={l.id} value={l.name}>{l.name}</option>
            ))}
          </select>

          <select className={styles.select} defaultValue="">
            <option value="">Teacher</option>
            {teachers.map((t: any) => (
              <option key={t.id} value={t.name || t.teacherName}>{t.name || t.teacherName}</option>
            ))}
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

      {!loading && (
        <SessionsList sessions={sessions} onDelete={handleDeleteSession} onEdit={handleEditSession} />
      )}

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
