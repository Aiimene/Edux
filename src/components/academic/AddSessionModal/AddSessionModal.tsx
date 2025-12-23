"use client";

import { useEffect, useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import styles from './AddSessionModal.module.css';
import { getTeachers } from '@/api/teachers';
import useLevels from '@/hooks/useLevels';
import Image from 'next/image';

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8L10 12L14 8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </components.DropdownIndicator>
);

type SessionForm = {
  sessionName: string;
  module: string;
  level: string;
  teacher: string;
  startDay: string;
  endDay: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string[];
};

type AddSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (session: SessionForm) => void;
  initialData?: Partial<SessionForm>;
  mode?: 'add' | 'edit';
};

const defaultForm: SessionForm = {
  sessionName: '',
  module: '',
  level: '',
  teacher: '',
  startDay: '',
  endDay: '',
  startTime: '',
  endTime: '',
  dayOfWeek: [],
};

export default function AddSessionModal({ isOpen, onClose, onSave, initialData, mode = 'add' }: AddSessionModalProps) {
  const [form, setForm] = useState<SessionForm>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { levels: dynamicLevels } = useLevels();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teachersLoading, setTeachersLoading] = useState<boolean>(false);
  const [teachersError, setTeachersError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...defaultForm, ...initialData });
      (async () => {
        try {
          setTeachersLoading(true);
          setTeachersError(null);
          const res = await getTeachers();
          const list = Array.isArray(res) ? res : (res?.results ?? []);
          setTeachers(list || []);
        } catch (e: any) {
          console.error('Failed to load teachers:', e);
          setTeachersError(e?.message || 'Failed to load teachers');
        } finally {
          setTeachersLoading(false);
        }
      })();
    }
  }, [isOpen, initialData]);

  const levels = useMemo(() => dynamicLevels.map(l => l.name), [dynamicLevels]);
  const modules = useMemo(() => {
    const lev = dynamicLevels.find(l => l.name === form.level);
    return (lev?.modules ?? []);
  }, [dynamicLevels, form.level]);
  const teacherName = (t: any): string => (
    t?.name || t?.teacherName || t?.full_name || [t?.user?.first_name, t?.user?.last_name].filter(Boolean).join(' ') || ''
  );

  const teacherLevelNames = (t: any): string[] => {
    if (Array.isArray(t?.levels)) {
      return t.levels.map((l: any) => (typeof l === 'string' ? l : (l?.name || l?.level || ''))).filter(Boolean);
    }
    const single = t?.level?.name || t?.level || t?.level_name;
    return single ? [single] : [];
  };

  const teacherModuleNames = (t: any): string[] => {
    if (Array.isArray(t?.modules)) {
      return t.modules.map((m: any) => (typeof m === 'string' ? m : (m?.name || m?.title || ''))).filter(Boolean);
    }
    if (Array.isArray(t?.modules_titles)) return (t.modules_titles as string[]).filter(Boolean);
    return [];
  };
  const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  const moduleOptions = modules.map((m: any) => ({ value: String(m.id), label: m.name }));
  const levelOptions = levels.map((l: string) => ({ value: l, label: l }));
  const teacherOptions = useMemo((): { value: string; label: string }[] => {
    const norm = (s: any) => (typeof s === 'string' ? s.trim().toLowerCase() : String(s ?? '').trim().toLowerCase());
    const targetLevel = form.level ? norm(form.level) : '';
    // If module is an ID, resolve its name for matching teacher modules
    const selectedModuleName = (() => {
      if (!form.module) return '';
      const lev = dynamicLevels.find(l => l.name === form.level);
      const mod = (lev?.modules ?? []).find((m: any) => String(m.id) === String(form.module));
      return mod?.name || '';
    })();
    const targetModule = selectedModuleName ? norm(selectedModuleName) : (form.module ? norm(form.module) : '');

    const filtered = (teachers || []).filter((t: any) => {
      const levels = teacherLevelNames(t).map(norm);
      const modules = teacherModuleNames(t).map(norm);

      // If teacher lacks metadata, do not exclude them
      const hasLevels = levels.length > 0;
      const hasModules = modules.length > 0;

      let matchLevel = true;
      if (targetLevel) matchLevel = hasLevels ? levels.includes(targetLevel) : true;

      let matchModule = true;
      if (targetModule) matchModule = hasModules ? modules.includes(targetModule) : true;

      return matchLevel && matchModule;
    });

    const opts = filtered
      .map((t: any) => {
        const id = t?.id ?? t?.teacher_id ?? t?.user?.id;
        const label = teacherName(t);
        if (!id || !label) return null;
        return { value: String(id), label };
      })
      .filter((opt): opt is { value: string; label: string } => !!opt);
    // Fallback to all teachers if filtering yields no options
    if (opts.length === 0 && (teachers || []).length > 0) {
      return (teachers || [])
        .map((t: any) => {
          const id = t?.id ?? t?.teacher_id ?? t?.user?.id;
          const label = teacherName(t);
          if (!id || !label) return null;
          return { value: String(id), label };
        })
        .filter((opt): opt is { value: string; label: string } => !!opt);
    }
    return opts;
  }, [teachers, form.level, form.module]);
  const weekdayOptions = weekdays.map((d) => ({ value: d, label: d }));

  const portalTarget = typeof window !== 'undefined' ? document.body : null;

  // Normalize initial module value: if it's a name, convert to its ID
  useEffect(() => {
    if (!form.level || !form.module) return;
    const byId = moduleOptions.find((opt) => opt.value === form.module);
    if (!byId) {
      const byLabel = moduleOptions.find((opt) => opt.label === form.module);
      if (byLabel) {
        setForm((prev) => ({ ...prev, module: byLabel.value }));
      }
    }
  }, [form.level, form.module, moduleOptions.length]);

  const singleSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#F8F9FA',
      borderColor: '#e5e7eb',
      borderRadius: 10,
      minHeight: 48,
      width: '100%',
      minWidth: 0,
      boxShadow: 'none',
      paddingLeft: 40,
    }),
    container: (base: any) => ({
      ...base,
      width: '100%',
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '2px 0',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af',
      fontWeight: 400,
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#fff',
      borderRadius: 8,
      boxShadow: '0 6px 18px rgba(11,20,30,0.08)',
      marginTop: 8,
    }),
    menuList: (base: any) => ({
      ...base,
      backgroundColor: '#fff',
      padding: 4,
      maxHeight: 200,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused || state.isSelected ? '#E8F3FF' : '#fff',
      color: '#1B2B4D',
    }),
    menuPortal: (base: any) => ({
      ...base,
      backgroundColor: '#fff',
      zIndex: 9999,
    }),
  };

  const handleChange = (field: keyof SessionForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  };

  const isValidDateStr = (s: string): boolean => {
    if (!s) return false;
    const d = new Date(s);
    return !isNaN(d.getTime());
  };

  const parseTimeToMinutes = (t: string): number | null => {
    if (!t) return null;
    const m = /^([0-1]?\d|2[0-3]):([0-5]\d)$/.exec(t);
    if (!m) return null;
    const hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    return hh * 60 + mm;
  };

  const getWeekdayName = (d: Date): string => {
    return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
  };

  const weekdaysBetweenInclusive = (startStr: string, endStr: string): Set<string> => {
    const set = new Set<string>();
    if (!isValidDateStr(startStr) || !isValidDateStr(endStr)) return set;
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (end.getTime() < start.getTime()) return set;
    const cur = new Date(start);
    cur.setHours(0,0,0,0);
    const endNorm = new Date(end);
    endNorm.setHours(0,0,0,0);
    while (cur.getTime() <= endNorm.getTime()) {
      set.add(getWeekdayName(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return set;
  };

  const validateAll = (f: SessionForm): Record<string, string> => {
    const errs: Record<string, string> = {};

    // Dates
    if (!isValidDateStr(f.startDay)) {
      errs.startDay = 'Enter a valid start day';
    }
    if (!isValidDateStr(f.endDay)) {
      errs.endDay = 'Enter a valid end day';
    }
    if (isValidDateStr(f.startDay) && isValidDateStr(f.endDay)) {
      const sd = new Date(f.startDay);
      const ed = new Date(f.endDay);
      if (ed.getTime() < sd.getTime()) {
        errs.endDay = 'End day must be same or after start day';
      }
    }

    // Times
    const sMin = parseTimeToMinutes(f.startTime);
    const eMin = parseTimeToMinutes(f.endTime);
    if (sMin === null) {
      errs.startTime = 'Enter a valid start time (HH:MM)';
    }
    if (eMin === null) {
      errs.endTime = 'Enter a valid end time (HH:MM)';
    }
    // Enforce endTime > startTime only when session does not span days
    if (sMin !== null && eMin !== null) {
      if (isValidDateStr(f.startDay) && isValidDateStr(f.endDay)) {
        const sd = new Date(f.startDay);
        const ed = new Date(f.endDay);
        const spansDays = ed.getTime() > sd.getTime();
        if (!spansDays && eMin <= sMin) {
          errs.endTime = 'End time must be after start time';
        }
      } else if (eMin <= sMin) {
        errs.endTime = 'End time must be after start time';
      }
    }

    // Day of week
    if (!Array.isArray(f.dayOfWeek) || f.dayOfWeek.length === 0) {
      errs.dayOfWeek = 'Select at least one day of the week';
    }
    // Ensure selected weekdays fall within date range
    if (isValidDateStr(f.startDay) && isValidDateStr(f.endDay) && Array.isArray(f.dayOfWeek) && f.dayOfWeek.length > 0) {
      const allowed = weekdaysBetweenInclusive(f.startDay, f.endDay);
      if (allowed.size > 0) {
        const invalid = f.dayOfWeek.filter((d) => !allowed.has(d));
        if (invalid.length > 0) {
          errs.dayOfWeek = 'Selected day(s) must be within the start/end date range';
        }
      }
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vErrs = validateAll(form);
    if (Object.keys(vErrs).length > 0) {
      setErrors(vErrs);
      return;
    }
    if (onSave) onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Image src="/icons/sessions.svg" alt="Session" width={24} height={24} />
            <h3>{mode === 'edit' ? 'Edit Session' : 'Add Session'}</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            {/* Session Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Session Name</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={form.sessionName}
                  onChange={(e) => handleChange('sessionName', e.target.value)}
                  required
                  className={styles.input}
                  placeholder="Enter session name"
                />
              </div>
            </div>

            {/* Module */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Module</label>
              <div className={styles.inputWrapper}>
                <Select
                  options={moduleOptions}
                  value={moduleOptions.find(opt => opt.value === form.module) || moduleOptions.find(opt => opt.label === form.module) || null}
                  onChange={(selected) => handleChange('module', selected?.value || '')}
                  placeholder="Select module"
                  styles={singleSelectStyles}
                  components={{ DropdownIndicator }}
                  menuPortalTarget={portalTarget}
                  isSearchable={false}
                  className=""
                />
              </div>
            </div>

            {/* Level */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Level</label>
              <div className={styles.inputWrapper}>
                <Select
                  options={levelOptions}
                  value={levelOptions.find(opt => opt.value === form.level) || null}
                  onChange={(selected) => handleChange('level', selected?.value || '')}
                  placeholder="Select level"
                  styles={singleSelectStyles}
                  components={{ DropdownIndicator }}
                  menuPortalTarget={portalTarget}
                  isSearchable={false}
                  className=""
                />
              </div>
            </div>

            {/* Teacher */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Teacher</label>
              <div className={styles.inputWrapper}>
                <Select
                  options={teacherOptions}
                  value={teacherOptions.find(opt => opt.value === form.teacher) || null}
                  onChange={(selected) => handleChange('teacher', selected?.value || '')}
                  placeholder="Select teacher"
                  styles={singleSelectStyles}
                  components={{ DropdownIndicator }}
                  menuPortalTarget={portalTarget}
                  isSearchable={false}
                  className=""
                />
              </div>
            </div>

            {/* Start Day */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Start Day</label>
              <div className={styles.inputWrapper}>
                <input type="date" value={form.startDay} onChange={(e) => handleChange('startDay', e.target.value)} required className={`${styles.input} ${errors.startDay ? styles.error : ''}`} />
              </div>
              {errors.startDay && <div className={styles.errorText}>{errors.startDay}</div>}
            </div>

            {/* End Day */}
            <div className={styles.formGroup}>
              <label className={styles.label}>End Day</label>
              <div className={styles.inputWrapper}>
                <input type="date" value={form.endDay} onChange={(e) => handleChange('endDay', e.target.value)} required className={`${styles.input} ${errors.endDay ? styles.error : ''}`} />
              </div>
              {errors.endDay && <div className={styles.errorText}>{errors.endDay}</div>}
            </div>

            {/* Start Time */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Start Time</label>
              <div className={styles.inputWrapper}>
                <input type="time" value={form.startTime} onChange={(e) => handleChange('startTime', e.target.value)} required className={`${styles.input} ${errors.startTime ? styles.error : ''}`} />
              </div>
              {errors.startTime && <div className={styles.errorText}>{errors.startTime}</div>}
            </div>

            {/* End Time */}
            <div className={styles.formGroup}>
              <label className={styles.label}>End Time</label>
              <div className={styles.inputWrapper}>
                <input type="time" value={form.endTime} onChange={(e) => handleChange('endTime', e.target.value)} required className={`${styles.input} ${errors.endTime ? styles.error : ''}`} />
              </div>
              {errors.endTime && <div className={styles.errorText}>{errors.endTime}</div>}
            </div>

            {/* Day of the Week */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Day of the Week</label>
              <div className={styles.inputWrapper}>
                <Select
                  options={weekdayOptions}
                  value={weekdayOptions.filter(opt => form.dayOfWeek.includes(opt.value))}
                  onChange={(selected) => {
                    const values = Array.isArray(selected) ? selected.map((opt) => opt.value) : [];
                    handleChange('dayOfWeek', values);
                  }}
                  placeholder="Select day(s)"
                  styles={singleSelectStyles}
                  components={{ DropdownIndicator }}
                  menuPortalTarget={portalTarget}
                  isMulti
                  isSearchable={false}
                  className=""
                />
              </div>
              {errors.dayOfWeek && <div className={styles.errorText}>{errors.dayOfWeek}</div>}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.primary}>{mode === 'edit' ? 'Save Changes' : 'Add Session'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
