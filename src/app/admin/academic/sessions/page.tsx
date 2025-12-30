"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import SessionsList from '../../../../components/academic/SessionsList/SessionsList';
import AddSessionModal from '@/components/academic/AddSessionModal/AddSessionModal';
import DashboardCard from '../../../../components/dashboard/DashboardCard/DashboardCard';
import styles from './page.module.css';
import { getSessions, createSession, updateSession, deleteSession } from '@/lib/api/sessions';
import { getTeachers } from '@/lib/api/teachers';
import { getCourses } from '@/lib/api/levels';
import useLevels from '@/hooks/useLevels';
import enterpriseData from '@/data/enterprise.json';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionModalMode, setSessionModalMode] = useState<'add' | 'edit'>('add');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingInitial, setEditingInitial] = useState<any>(null);
  const dayInputRef = useRef<HTMLInputElement | null>(null);
  const [filterModule, setFilterModule] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [filterTeacher, setFilterTeacher] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string>(enterpriseData.name || '');
  const { levels: dynamicLevels } = useLevels();

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

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('school_name') : '';
    if (stored && stored.trim()) {
      setSchoolName(stored);
    }
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
        // Prefer explicit course/module names from API, fallback safely
        module: s.course_name || s.module_name || s.course?.name || s.module?.name || '',
        Module: s.course_name || s.module_name || s.course?.name || s.module?.name || '',
        // Level derived from API if present
        level: s.level_name || s.course?.level?.name || s.level?.name || '',
        Level: s.level_name || s.course?.level?.name || s.level?.name || '',
        teacher:
          s.teacher_name ||
          s.teacher?.name ||
          s.teacher?.user?.username ||
          schoolName ||
          '',
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
    // Resolve teacher ID from name
    const teacherMatch = teachers.find((t: any) => {
      const name = t.name || t.teacherName || [t?.user?.first_name, t?.user?.last_name].filter(Boolean).join(' ');
      return name === target.teacher;
    });
    const teacherId = (teacherMatch?.id ?? teacherMatch?.teacher_id ?? teacherMatch?.user?.id)?.toString() || '';

    // Resolve module ID from name using courses or dynamic levels
    const moduleName = target.module || target.Module || '';
    const courseMatch = courses.find((c: any) => c.name === moduleName);
    let moduleId = courseMatch?.id?.toString() || '';
    let levelName = target.level || target.Level || '';
    if (!moduleId) {
      const lev = dynamicLevels.find((l) => l.modules?.some((m: any) => m.name === moduleName));
      const mod = lev?.modules?.find((m: any) => m.name === moduleName);
      moduleId = mod?.id?.toString() || moduleId;
      levelName = lev?.name || levelName;
    }

    setEditingInitial({
      sessionName: target.sessionName || target.Module || '',
      module: moduleId || moduleName,
      level: levelName,
      teacher: teacherId || target.teacher || '',
      startDay: target.startDay || target.date?.split(' - ')[0] || '',
      endDay: target.endDay || target.date?.split(' - ')[1] || '',
      startTime: target.startTime || target.time?.split(' - ')[0] || '',
      endTime: target.endTime || target.time?.split(' - ')[1] || '',
      dayOfWeek: target.dayOfWeek ? [target.dayOfWeek] : [],
    });
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = async (payload: any) => {
    try {
      setError(null);
      const norm = (s: any) => (typeof s === 'string' ? s.trim().toLowerCase() : String(s ?? '').trim().toLowerCase());
      const teacherName = (t: any): string => (
        t?.name || t?.teacherName || t?.full_name || [t?.user?.first_name, t?.user?.last_name].filter(Boolean).join(' ') || ''
      );
      const teacherIdStr = (t: any) => (t?.id ?? t?.teacher_id ?? t?.user?.id)?.toString();

      const target = payload.teacher?.toString?.() ?? '';
      const targetNorm = norm(target);

      let teacher = teachers.find((t: any) => {
        const idStr = teacherIdStr(t);
        const nameStr = teacherName(t);
        return target === idStr || target === nameStr || targetNorm === norm(nameStr);
      });

      // Fallback: if payload.teacher looks like an ID but not found in local list, fetch by ID
      if (!teacher && /^[0-9]+$/.test(target)) {
        try {
          const fetched = await getTeachers();
          const fetchedList = Array.isArray(fetched) ? fetched : (fetched?.results ?? []);
          teacher = fetchedList.find((t: any) => teacherIdStr(t) === target) || teacher;
        } catch {}
      }
      // Accept module by id or name; fallback to dynamic levels if needed
      const course = courses.find((c: any) => {
        const idStr = (c?.id)?.toString();
        return payload.module === idStr || c.name === payload.module;
      }) || (() => {
        const lev = dynamicLevels.find((l) => l.name === payload.level);
        const mod = lev?.modules?.find((m: any) => m.id?.toString() === payload.module || m.name === payload.module);
        return mod ? { id: mod.id, name: mod.name } : undefined;
      })();
      if (!teacher) {
        setError('Teacher not found. Please select a valid teacher.');
        return;
      }
      if (!course) {
        setError('Module not found. Please select a valid module.');
        return;
      }
      // If multiple days, create a session for each day (backend expects this)
      const days = Array.isArray(payload.dayOfWeek) ? payload.dayOfWeek : [payload.dayOfWeek];
      const validDays = days.filter(Boolean);
      if (sessionModalMode === 'edit' && editingIndex !== null) {
        // Only allow editing one session at a time
        const dayOfWeek = dayNameToNumber[validDays[0]] ?? 0;
        const sessionPayload: any = {
          name: payload.sessionName || payload.module,
          course: course?.id ?? payload.module,
          teacher: teacher.id,
          start_time: payload.startTime,
          end_time: payload.endTime,
          status: 'active',
          day_of_week: dayOfWeek,
        };
        const id = sessions[editingIndex]?.id;
        await updateSession(id, sessionPayload);
      } else {
        // Create a session for each selected day
        for (const day of validDays) {
          const dayOfWeek = dayNameToNumber[day] ?? 0;
          const sessionPayload: any = {
            name: payload.sessionName || payload.module,
            course: course?.id ?? payload.module,
            teacher: teacher.id,
            start_time: payload.startTime,
            end_time: payload.endTime,
            status: 'active',
            day_of_week: dayOfWeek,
          };
          await createSession(sessionPayload);
        }
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
        <p className={styles.enterpriseName}>{schoolName || 'Your School'}</p>
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
   
     

      {/* Filters */}
      <div className={styles.controlsRow}>
        <div className={styles.leftControls}>
          <select
            className={styles.select}
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
          >
            <option value="">Module</option>
            {courses.map((c: any) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            className={styles.select}
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="">Level</option>
            {dynamicLevels.map((l) => (
              <option key={l.id} value={l.name}>{l.name}</option>
            ))}
          </select>

          <select
            className={styles.select}
            value={filterTeacher}
            onChange={(e) => setFilterTeacher(e.target.value)}
          >
            <option value="">Teacher</option>
            {teachers.map((t: any) => (
              <option key={t.id} value={t.name || t.teacherName}>{t.name || t.teacherName}</option>
            ))}
          </select>
        </div>

        <div className={styles.rightControls}>
          <div className={styles.dateControls}>
            <label
              className={styles.dayControl}
              onClick={openDayPicker}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDayPicker(); } }}
              role="button"
              tabIndex={0}
            >
              <Image src="/icons/timetables.svg" alt="Select Day" width={18} height={18} />
              <input
                ref={dayInputRef}
                type="date"
                className={styles.dateInput}
                aria-label="Select Day"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </label>
          </div>

          <button className={styles.primaryBtn} onClick={handleNewSession}>New Session</button>
        </div>
      </div>


      {!loading && (
        <SessionsList
          sessions={
            filterLevel
              ? sessions.filter((s: any) => {
                  let ok = true;
                  if (filterModule) ok = ok && (s.module === filterModule || s.Module === filterModule);
                  if (filterLevel) ok = ok && (s.level === filterLevel || s.Level === filterLevel);
                  if (filterTeacher) ok = ok && (s.teacher === filterTeacher);
                  if (filterDate) {
                    const d = new Date(filterDate);
                    const weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
                    ok = ok && (s.dayOfWeek === weekday);
                  }
                  return ok;
                })
              : sessions // Show all if no level filter
          }
          onDelete={handleDeleteSession}
          onEdit={handleEditSession}
        />
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
