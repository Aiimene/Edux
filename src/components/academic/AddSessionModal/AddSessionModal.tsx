"use client";

import { useEffect, useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import styles from './AddSessionModal.module.css';
import enterpriseData from '@/data/enterprise.json';
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
  const { levels: dynamicLevels } = useLevels();

  useEffect(() => {
    if (isOpen) {
      setForm({ ...defaultForm, ...initialData });
    }
  }, [isOpen, initialData]);

  const levels = useMemo(() => dynamicLevels.map(l => l.name), [dynamicLevels]);
  const modules = useMemo(() => {
    const lev = dynamicLevels.find(l => l.name === form.level);
    return (lev?.modules ?? []).map(m => m.name);
  }, [dynamicLevels, form.level]);
  const teachers = useMemo(() => enterpriseData.teachers?.map((t: any) => t.name || t.teacherName || '') || [], []);
  const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  const moduleOptions = modules.map((m: string) => ({ value: m, label: m }));
  const levelOptions = levels.map((l: string) => ({ value: l, label: l }));
  const teacherOptions = teachers.map((t: string) => ({ value: t, label: t }));
  const weekdayOptions = weekdays.map((d) => ({ value: d, label: d }));

  const portalTarget = typeof window !== 'undefined' ? document.body : null;

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                  value={moduleOptions.find(opt => opt.value === form.module) || null}
                  onChange={(selected) => handleChange('module', selected?.value || '')}
                  placeholder="Select module"
                  styles={singleSelectStyles}
                  components={{ DropdownIndicator }}
                  menuPortalTarget={portalTarget}
                  isSearchable={false}
                  className={styles.input}
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
                  className={styles.input}
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
                  className={styles.input}
                />
              </div>
            </div>

            {/* Start Day */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Start Day</label>
              <div className={styles.inputWrapper}>
                <input type="date" value={form.startDay} onChange={(e) => handleChange('startDay', e.target.value)} required className={styles.input} />
              </div>
            </div>

            {/* End Day */}
            <div className={styles.formGroup}>
              <label className={styles.label}>End Day</label>
              <div className={styles.inputWrapper}>
                <input type="date" value={form.endDay} onChange={(e) => handleChange('endDay', e.target.value)} required className={styles.input} />
              </div>
            </div>

            {/* Start Time */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Start Time</label>
              <div className={styles.inputWrapper}>
                <input type="time" value={form.startTime} onChange={(e) => handleChange('startTime', e.target.value)} required className={styles.input} />
              </div>
            </div>

            {/* End Time */}
            <div className={styles.formGroup}>
              <label className={styles.label}>End Time</label>
              <div className={styles.inputWrapper}>
                <input type="time" value={form.endTime} onChange={(e) => handleChange('endTime', e.target.value)} required className={styles.input} />
              </div>
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
                  className={styles.input}
                />
              </div>
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
