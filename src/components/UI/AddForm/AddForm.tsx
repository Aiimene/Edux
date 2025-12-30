'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import './AddForm.css';
import Select, { components } from 'react-select';
import useLevels from '@/hooks/useLevels';
import ConfirmModal from '@/components/UI/ConfirmModal/ConfirmModal';
import { getSessions } from '@/lib/api/sessions';

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8L10 12L14 8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </components.DropdownIndicator>
);

export type FormData = {
  studentName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phoneNumber: string;
  level: string;
  levels: string[];
  sessions: string[];
  feePayment: string;
  enrollmentDate: string;
  paymentMethod: string;
  paymentStatus: string;
  gender: string;
  parentName: string;
  children: string[];
  modules: string[];
  academicYear: string;
  days?: string[]; // NEW: for multi-day support
};

type AddFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<FormData>;
  mode?: 'add' | 'edit' | 'view';
  onSave?: (data: FormData) => void;
  onDelete?: (id?: string) => void;
  entityLabel?: string;
  hideAcademic?: boolean;
};

export default function AddForm({ 
  isOpen, 
  onClose, 
  initialData, 
  mode = 'add', 
  onSave, 
  onDelete, 
  entityLabel = 'Student', 
  hideAcademic = false 
}: AddFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [addAmountVisible, setAddAmountVisible] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const allowFeeAdjust = mode === 'edit';

  const EyeIcon = ({ visible }: { visible: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12s4.5-7 10-7 10 7 10 7-4.5 7-10 7-10-7-10-7Z" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3.2" stroke="#111827" strokeWidth="1.8"/>
      {visible ? null : <path d="M4 4l16 16" stroke="#111827" strokeWidth="1.8" strokeLinecap="round"/>}
    </svg>
  );
  const [formData, setFormData] = useState<FormData>(() => ({
    studentName: initialData?.studentName ?? '',
    email: initialData?.email ?? '',
    password: initialData?.password ?? '',
    dateOfBirth: initialData?.dateOfBirth ?? '',
    phoneNumber: initialData?.phoneNumber ?? '',
    level: initialData?.level ?? '',
    levels: Array.isArray(initialData?.levels) ? (initialData?.levels as string[]) : [],
    sessions: initialData?.sessions ?? [],
    feePayment: initialData?.feePayment ?? '',
    enrollmentDate: initialData?.enrollmentDate ?? '',
    paymentMethod: initialData?.paymentMethod ? String(initialData.paymentMethod).toLowerCase() : '',
    paymentStatus: initialData?.paymentStatus ? String(initialData.paymentStatus).toLowerCase() : '',
    gender: initialData?.gender ?? '',
    parentName: initialData?.parentName ?? '',
    children: Array.isArray(initialData?.children) ? initialData.children : [],
    modules: initialData?.modules ?? [],
    academicYear: initialData?.academicYear ?? '',
    days: Array.isArray(initialData?.days) ? initialData.days : [], // NEW
  }));
  // Days of the week options
  const daysOfWeekOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ];
  const handleDaysChange = (selected: any) => {
    setFormData({
      ...formData,
      days: selected ? selected.map((opt: any) => opt.value) : [],
    });
  };
  // ...existing code...
  // When submitting the form, ensure to include formData.days (array) in your payload for sessions.

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sessionsData, setSessionsData] = useState<Array<{ id: string; name: string; module: string; level: string; day: string; start: string; end: string }>>([]);
  const [sessionsLoading, setSessionsLoading] = useState<boolean>(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [childInputValue, setChildInputValue] = useState<string>('');

  useEffect(() => {
    if (mode === 'add') {
      if (isOpen) {
        setFormData({
          studentName: '',
          email: '',
          password: '',
          dateOfBirth: '',
          phoneNumber: '',
          level: '',
          levels: [],
          sessions: [],
          feePayment: '',
          enrollmentDate: '',
          paymentMethod: '',
          paymentStatus: '',
          gender: '',
          parentName: '',
          children: [],
          modules: [],
          academicYear: '',
        });
      }
      return;
    }

    if (initialData && isOpen) {
      setFormData({
        studentName: initialData.studentName ?? '',
        email: initialData.email ?? '',
        password: initialData.password ?? '',
        dateOfBirth: initialData.dateOfBirth ?? '',
        phoneNumber: initialData.phoneNumber ?? '',
        level: initialData.level ?? '',
        levels: Array.isArray(initialData.levels) ? (initialData.levels as string[]) : [],
        sessions: initialData.sessions ?? [],
        feePayment: initialData.feePayment ?? '',
        enrollmentDate: initialData.enrollmentDate ?? '',
        paymentMethod: initialData.paymentMethod ? String(initialData.paymentMethod).toLowerCase() : '',
        paymentStatus: initialData.paymentStatus ? String(initialData.paymentStatus).toLowerCase() : '',
        gender: initialData.gender ?? '',
        parentName: initialData.parentName ?? '',
        children: Array.isArray(initialData.children) ? initialData.children : [],
        modules: initialData.modules ?? [],
        academicYear: initialData.academicYear ?? '',
      });
      setErrors({});
    }
  }, [initialData, isOpen, mode]);

  const normalizeSession = (s: any) => {
    const name = s?.name || s?.sessionName || s?.title || s?.course_name || s?.module_name || s?.course?.name || s?.module?.name || '';
    const moduleName = s?.course_name || s?.module_name || s?.course?.name || s?.module?.name || '';
    const levelName = s?.level_name || s?.course?.level?.name || s?.level?.name || '';
    const day = s?.day_name || s?.day || '';
    const start = s?.start_time || s?.startTime || '';
    const end = s?.end_time || s?.endTime || '';
    return {
      id: s?.id?.toString?.() || '',
      name,
      module: moduleName,
      level: levelName,
      day,
      start,
      end,
    };
  };

  useEffect(() => {
    if (!isOpen) return;
    const loadSessions = async () => {
      try {
        setSessionsLoading(true);
        setSessionsError(null);
        const res = await getSessions();
        const list = Array.isArray(res) ? res : (res?.results ?? []);
        const mapped = list.map(normalizeSession).filter((s: any) => s.id || s.name);
        setSessionsData(mapped);
      } catch (err: any) {
        setSessionsError(err?.message || 'Failed to load sessions');
      } finally {
        setSessionsLoading(false);
      }
    };
    loadSessions();
  }, [isOpen]);

  const handleAddAmountConfirm = () => {
    const existing = parseFloat(formData.feePayment || '0') || 0;
    const toAdd = parseFloat(addAmount || '0') || 0;
    const newVal = existing + toAdd;
    const formatted = Number.isInteger(newVal) ? String(newVal) : String(newVal);
    setFormData({ ...formData, feePayment: formatted });
    setAddAmount('');
    setAddAmountVisible(false);
  };

  const handleAddAmountCancel = () => {
    setAddAmount('');
    setAddAmountVisible(false);
  };
  const { levels: dynamicLevels } = useLevels();
  const normalize = (v: string) => (v || '').toString().trim().toLowerCase();
  // Modules: show all at first, filter by level if selected
  const allModules = Array.from(new Set(dynamicLevels.flatMap(l => l.modules.map(m => m.name))));
  const selectedLevel = dynamicLevels.find(l => l.name === formData.level);
  const selectedLevelsForTeacher = dynamicLevels.filter(l => (formData.levels || []).includes(l.name));
  const availableModules = (
    entityLabel === 'Teacher'
      ? Array.from(new Set(selectedLevelsForTeacher.flatMap(l => l.modules.map(m => m.name))))
      : formData.level
        ? (selectedLevel?.modules ?? []).map(m => m.name)
        : allModules
  );

  const filteredSessions = useMemo(() => {
    const targetLevel = normalize(formData.level);
    const targetModules = (formData.modules || []).map(normalize).filter(Boolean);
    return sessionsData.filter((s) => {
      const levelMatch = targetLevel ? normalize(s.level) === targetLevel : true;
      const moduleMatch = targetModules.length ? targetModules.includes(normalize(s.module)) : true;
      return levelMatch && moduleMatch;
    });
  }, [formData.level, formData.modules, sessionsData]);

  useEffect(() => {
    const allowed = new Set(filteredSessions.map((s) => String(s.id || s.name)));
    setFormData((prev) => {
      const nextSessions = (prev.sessions || []).filter((val) => allowed.has(String(val)));
      if (nextSessions.length === (prev.sessions || []).length) return prev;
      return { ...prev, sessions: nextSessions };
    });
  }, [filteredSessions]);
  const genders = ['male', 'female'];

  const paymentMethodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'per session', label: 'Per Session' },
  ];

  const paymentStatusOptions = [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // When level changes, reset modules to those belonging to the new level
    if (name === 'level') {
      setFormData({ ...formData, level: value, modules: [], sessions: [] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const moduleOptions = availableModules.map(m => ({ value: m, label: m }));
  const sessionOptions = filteredSessions.map((s) => {
    const parts = [s.name || s.module || 'Session'];
    if (s.day) parts.push(`• ${s.day}`);
    if (s.start && s.end) parts.push(`• ${s.start} - ${s.end}`);
    return {
      value: s.id || s.name,
      label: parts.join(' '),
    };
  });
  const selectedSessionOptions = useMemo(
    () => sessionOptions.filter((opt) => (formData.sessions || []).includes(String(opt.value))),
    [sessionOptions, formData.sessions]
  );

  const handleModulesChange = (selected: any) => {
    const nextModules = selected ? selected.map((opt: any) => opt.value) : [];
    setFormData({
      ...formData,
      modules: nextModules,
      sessions: [],
    });
  };

  const handleModulesChangeWithClear = (selected: any) => {
    handleModulesChange(selected);
    setErrors(prev => {
      const { modules: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSessionsChange = (selected: any) => {
    setFormData({
      ...formData,
      sessions: selected ? selected.map((opt: any) => String(opt.value)) : [],
    });
  };

  const handleSessionsChangeWithClear = (selected: any) => {
    handleSessionsChange(selected);
    setErrors(prev => {
      const { sessions: _, ...rest } = prev;
      return rest;
    });
  };

  const genderOptions = genders.map(g => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }));
  const levelOptions = dynamicLevels.map(l => ({ value: l.name, label: l.name }));

  const portalTarget = typeof window !== 'undefined' ? document.body : null;

  const singleSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#F8F9FA',
      borderColor: '#e5e7eb',
      borderRadius: 8,
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

  const multiSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#F8F9FA',
      borderColor: '#e5e7eb',
      borderRadius: 8,
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
      padding: '4px 0',
      gap: 4,
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#DBEAFE',
      borderRadius: 6,
      padding: '2px 6px',
      display: 'flex',
      alignItems: 'center',
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#1e40af',
      fontSize: '14px',
      fontWeight: 500,
      padding: '2px 4px',
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#1e40af',
      cursor: 'pointer',
      paddingLeft: 4,
      paddingRight: 0,
      ':hover': {
        backgroundColor: 'transparent',
        color: '#1e3a8a',
      },
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

  const handleLevelChange = (selected: any) => {
    setFormData({ ...formData, level: selected ? selected.value : '' });
  };

  const handleTeacherLevelsChange = (selected: any) => {
    const values = selected ? selected.map((opt: any) => opt.value) : [];
    setFormData({ ...formData, levels: values, modules: [] });
  };

  const handleLevelChangeWithClear = (selected: any) => {
    handleLevelChange(selected);
    setErrors(prev => {
      const { level: _, ...rest } = prev;
      return rest;
    });
  };

  const handleGenderChange = (selected: any) => {
    setFormData({ ...formData, gender: selected ? selected.value : '' });
  };

  const handleGenderChangeWithClear = (selected: any) => {
    handleGenderChange(selected);
    setErrors(prev => {
      const { gender: _, ...rest } = prev;
      return rest;
    });
  };

  const handlePaymentMethodChange = (selected: any) => {
    setFormData({ ...formData, paymentMethod: selected ? selected.value : '' });
  };

  const handlePaymentStatusChange = (selected: any) => {
    setFormData({ ...formData, paymentStatus: selected ? selected.value : '' });
  };

  const isEmail = (value: string) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const isValidDate = (value: string) => {
    if (!value) return false;
    const d = new Date(value);
    return !isNaN(d.getTime());
  };

  const ageFromDate = (value: string) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return NaN;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (entityLabel === 'Parent') {
      if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Parent name is required';
      if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
      if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
      if (!formData.phoneNumber || !String(formData.phoneNumber).trim()) e.phoneNumber = 'Phone number is required';
      setErrors(e);
      return Object.keys(e).length === 0;
    }

    if (entityLabel === 'Teacher') {
      if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Teacher name is required';
      if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
      if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
      if (!formData.phoneNumber || !String(formData.phoneNumber).trim()) e.phoneNumber = 'Phone number is required';
      setErrors(e);
      return Object.keys(e).length === 0;
    }

    if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Student name is required';
    if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
    if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
    if (!formData.dateOfBirth || String(formData.dateOfBirth).trim() === '') {
      e.dateOfBirth = 'Date of birth is required';
    } else if (!isValidDate(String(formData.dateOfBirth))) {
      e.dateOfBirth = 'Enter a valid date of birth';
    } else {
      const age = ageFromDate(String(formData.dateOfBirth));
      const minAge = 5; // generic minimum
      const maxAge = 100; // generic maximum
      const dobDate = new Date(String(formData.dateOfBirth));
      if (dobDate.getTime() > Date.now()) {
        e.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (isNaN(age) || age < minAge || age > maxAge) {
        e.dateOfBirth = `Age must be between ${minAge} and ${maxAge}`;
      }
    }
    if (!formData.phoneNumber || !String(formData.phoneNumber).trim()) e.phoneNumber = 'Phone number is required';
    if (!formData.gender || String(formData.gender).trim() === '') e.gender = 'Gender is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateAll = () => {
    const e: Record<string, string> = {};
    if (entityLabel === 'Parent') {
      if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Parent name is required';
      if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
      if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
      if (!formData.phoneNumber || !String(formData.phoneNumber).trim()) e.phoneNumber = 'Phone number is required';
      setErrors(e);
      return e;
    }

    if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Student name is required';
    if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
    if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
    if (!formData.dateOfBirth || String(formData.dateOfBirth).trim() === '') {
      e.dateOfBirth = 'Date of birth is required';
    } else if (!isValidDate(String(formData.dateOfBirth))) {
      e.dateOfBirth = 'Enter a valid date of birth';
    } else {
      const age = ageFromDate(String(formData.dateOfBirth));
      const minAge = 5;
      const maxAge = 100;
      const dobDate = new Date(String(formData.dateOfBirth));
      if (dobDate.getTime() > Date.now()) {
        e.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (isNaN(age) || age < minAge || age > maxAge) {
        e.dateOfBirth = `Age must be between ${minAge} and ${maxAge}`;
      }
    }
    if (!formData.phoneNumber || !String(formData.phoneNumber).trim()) e.phoneNumber = 'Phone number is required';
    if (!formData.gender || String(formData.gender).trim() === '') e.gender = 'Gender is required';
    if (entityLabel === 'Teacher') {
      if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Teacher name is required';
      if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
      if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
      if (!formData.phoneNumber || !String(formData.phoneNumber).trim()) e.phoneNumber = 'Phone number is required';
    } else {
      if (!formData.level || String(formData.level).trim() === '') e.level = 'Level is required';
      if (!formData.modules || (Array.isArray(formData.modules) && formData.modules.length === 0)) e.modules = 'At least one module is required';
      if (!formData.sessions || (Array.isArray(formData.sessions) && formData.sessions.length === 0)) e.sessions = 'At least one session is required';
      if (!formData.academicYear || String(formData.academicYear).trim() === '') e.academicYear = 'Academic year is required';
      if (!formData.feePayment || String(formData.feePayment).trim() === '') e.feePayment = 'Fee payment is required';
    }
    setErrors(e);
    return e;
  };

  const handleNext = () => {
    if (mode === 'view') {
      setCurrentStep(2);
      return;
    }
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      email: '',
      password: '',
      dateOfBirth: '',
      phoneNumber: '',
      level: '',
      levels: [],
      sessions: [],
      feePayment: '',
      enrollmentDate: '',
      paymentMethod: '',
      paymentStatus: '',
      gender: '',
      parentName: '',
      children: [],
      modules: [],
      academicYear: '',
    });
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      const step1Keys = ['studentName', 'email', 'password', 'dateOfBirth', 'phoneNumber', 'gender'];
      const hasStep1Error = Object.keys(validationErrors).some(k => step1Keys.includes(k));
      if (hasStep1Error) setCurrentStep(1);
      else setCurrentStep(2);
      return;
    }

    // Call onSave for both add and edit modes
    if (onSave) {
      console.log('Form submitted:', formData);
      onSave(formData);
    }
    
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) onDelete();
    setIsDeleteConfirmOpen(false);
    resetForm();
    onClose();
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  if (!isOpen) return null;

  const step1Class = currentStep === 1 ? 'activeStep' : currentStep > 1 ? 'completedStep' : '';
  const step2Class = currentStep === 2 ? 'activeStep' : currentStep > 2 ? 'completedStep' : '';

  return (
    <div className="overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <div className="titleSection">
            <Image src="/icons/person-circle.svg" alt="Person" width={24} height={24} />
            <h2 className="title">{mode === 'add' ? `Add New ${entityLabel}` : mode === 'edit' ? `Edit ${entityLabel}` : `${entityLabel} Profile`}</h2>
          </div>
          <button className="closeButton" onClick={handleClose}>×</button>
        </div>
        {!hideAcademic && (
          <div className="steps" style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginTop: 20 }}>
            <div className={`step ${step1Class}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="stepNumber">1</span>
              <span className="stepLabel">Personal Information</span>
            </div>
            <div className={`stepLine ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`step ${step2Class}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="stepNumber">2</span>
              <span className="stepLabel">Academic Information</span>
            </div>
          </div>
        )}
        <form className="content" onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="section">
              <div className="formGrid">
                {entityLabel === 'Parent' && hideAcademic ? (
                  <>
                    {/* Left Column: 4 fields */}
                    <div className="formColumn">
                      <div className="formGroup">
                        <label className="label">Parent Name</label>
                        <div className="inputWrapper">
                          <Image src="/icons/students.svg" alt="Parent" width={20} height={20} className="inputIcon" />
                          <input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`input ${errors.studentName ? 'inputError' : ''}`}
                            placeholder="Enter parent name"
                          />
                          {errors.studentName && <div className="errorText">{errors.studentName}</div>}
                        </div>
                      </div>
                      <div className="formGroup">
                        <label className="label">Email</label>
                        <div className="inputWrapper">
                          <Image src="/icons/envelope.svg" alt="Email" width={20} height={20} className="inputIcon" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            autoComplete="off"
                            className={`input ${errors.email ? 'inputError' : ''}`}
                            placeholder="Enter email"
                          />
                          {errors.email && <div className="errorText">{errors.email}</div>}
                        </div>
                      </div>
                      <div className="formGroup">
                        <label className="label">Password</label>
                        <div className="inputWrapper" style={{ position: 'relative' }}>
                          <Image src="/icons/fingerprint.svg" alt="Password" width={20} height={20} className="inputIcon" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            autoComplete="new-password"
                            className={`input ${errors.password ? 'inputError' : ''}`}
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                            onClick={() => setShowPassword((v) => !v)}
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 4,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <EyeIcon visible={showPassword} />
                          </button>
                          {errors.password && <div className="errorText">{errors.password}</div>}
                        </div>
                      </div>
                      <div className="formGroup">
                        <label className="label">Children Names</label>
                        <div style={{
                          backgroundColor: '#F8F9FA',
                          borderColor: '#e5e7eb',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                          padding: '8px 12px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          alignItems: 'center',
                          minHeight: 48,
                        }}>
                          <Image src="/icons/students.svg" alt="Children" width={18} height={18} style={{ marginTop: -2, marginRight: 6, flexShrink: 0 }} />
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, alignItems: 'center' }}>
                            {(formData.children || []).map((child, index) => (
                              <div key={index} style={{
                                backgroundColor: '#DBEAFE',
                                color: '#1e40af',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                              }}>
                                <span>{child}</span>
                                {mode !== 'view' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newChildren = (formData.children || []).filter((_, i) => i !== index);
                                      setFormData({ ...formData, children: newChildren });
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#1e40af',
                                      cursor: 'pointer',
                                      padding: '0',
                                      fontSize: '16px',
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                    aria-label="Remove"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                            {mode !== 'view' && (
                              <input
                                type="text"
                                value={childInputValue}
                                onChange={(e) => setChildInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const trimmed = childInputValue.trim();
                                    if (trimmed && !(formData.children || []).includes(trimmed)) {
                                      setFormData({ ...formData, children: [...(formData.children || []), trimmed] });
                                      setChildInputValue('');
                                    }
                                  }
                                }}
                                onBlur={() => {
                                  const trimmed = childInputValue.trim();
                                  if (trimmed && !(formData.children || []).includes(trimmed)) {
                                    setFormData({ ...formData, children: [...(formData.children || []), trimmed] });
                                    setChildInputValue('');
                                  }
                                }}
                                disabled={mode !== 'add' && mode !== 'edit'}
                                style={{
                                  border: 'none',
                                  outline: 'none',
                                  backgroundColor: 'transparent',
                                  fontSize: '14px',
                                  flex: 1,
                                  minWidth: '120px',
                                  padding: '4px 0',
                                }}
                                placeholder="Add child names..."
                              />
                            )}
                          </div>
                        </div>
                        {errors.children && <div className="errorText">{errors.children}</div>}
                      </div>
                    </div>
                    {/* Right Column: 3 fields */}
                    <div className="formColumn">
                      <div className="formGroup">
                        <label className="label">Phone Number</label>
                        <div className="inputWrapper">
                          <Image src="/icons/phone.svg" alt="Phone" width={20} height={20} className="inputIcon" />
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`input ${errors.phoneNumber ? 'inputError' : ''}`}
                            placeholder="Enter phone number"
                          />
                          {errors.phoneNumber && <div className="errorText">{errors.phoneNumber}</div>}
                        </div>
                      </div>
                      <div className="formGroup">
                        <label className="label">Academic Year</label>
                        <div className="inputWrapper">
                          <Image src="/icons/select-month.svg" alt="Academic Year" width={20} height={20} className="inputIcon" />
                          <input
                            type="text"
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`input ${errors.academicYear ? 'inputError' : ''}`}
                            placeholder="Enter academic year"
                          />
                        </div>
                        {errors.academicYear && <div className="errorText">{errors.academicYear}</div>}
                      </div>
                      <div className="formGroup">
                        <label className="label">Fee Payment</label>
                        <div className="inputWrapper">
                          <span className="dollarIcon">$</span>
                          <input
                            type="number"
                            name="feePayment"
                            value={formData.feePayment}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`input ${errors.feePayment ? 'inputError' : ''} ${allowFeeAdjust ? 'hasInlineAction' : ''}`}
                            placeholder="Enter fee payment"
                          />
                          {allowFeeAdjust && (
                            <div className="addAmountInline">
                              {!addAmountVisible ? (
                                <button type="button" className="plusSmallButton" onClick={() => setAddAmountVisible(true)} aria-label="Add amount">+</button>
                              ) : (
                                <div className="addAmountControlsInline">
                                  <input
                                    type="number"
                                    value={addAmount}
                                    onChange={(e) => setAddAmount(e.target.value)}
                                    className="smallAddInput"
                                    placeholder="0"
                                  />
                                  <button type="button" className="addConfirmButton" onClick={handleAddAmountConfirm} aria-label="Confirm add">OK</button>
                                  <button type="button" className="addCancelButton" onClick={handleAddAmountCancel} aria-label="Cancel add">✕</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {errors.feePayment && <div className="errorText">{errors.feePayment}</div>}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Original layout for non-parent forms */}
                    <div className="formColumn">
                  <div className="formGroup">
                    <label className="label">{entityLabel} Name</label>
                    <div className="inputWrapper">
                      <Image src="/icons/students.svg" alt="Student" width={20} height={20} className="inputIcon" />
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className={`input ${errors.studentName ? 'inputError' : ''}`}
                        placeholder={`Enter ${entityLabel.toLowerCase()} name`}
                      />
                      {errors.studentName && <div className="errorText">{errors.studentName}</div>}
                    </div>
                  </div>
                  <div className="formGroup">
                    <label className="label">Email</label>
                    <div className="inputWrapper">
                      <Image src="/icons/envelope.svg" alt="Email" width={20} height={20} className="inputIcon" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        autoComplete="off"
                        className={`input ${errors.email ? 'inputError' : ''}`}
                        placeholder="Enter email"
                      />
                      {errors.email && <div className="errorText">{errors.email}</div>}
                    </div>
                  </div>
                  <div className="formGroup">
                    <label className="label">Password</label>
                    <div className="inputWrapper" style={{ position: 'relative' }}>
                      <Image src="/icons/fingerprint.svg" alt="Password" width={20} height={20} className="inputIcon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        autoComplete="new-password"
                        className={`input ${errors.password ? 'inputError' : ''}`}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <EyeIcon visible={showPassword} />
                      </button>
                      {errors.password && <div className="errorText">{errors.password}</div>}
                    </div>
                  </div>
                  {entityLabel === 'Student' && (
                    <div className="formGroup">
                      <label className="label">Parent Name</label>
                      <div className="inputWrapper">
                        <Image src="/icons/parents.svg" alt="Parent" width={20} height={20} className="inputIcon" />
                        <input
                          type="text"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleChange}
                          disabled={mode === 'view'}
                          className={`input ${errors.parentName ? 'inputError' : ''}`}
                          placeholder="Enter parent name"
                        />
                      </div>
                      {errors.parentName && <div className="errorText">{errors.parentName}</div>}
                    </div>
                  )}
                  {entityLabel === 'Parent' || hideAcademic ? (
                    <div className="formGroup">
                      <label className="label">Fee Payment</label>
                      <div className="inputWrapper">
                        <span className="dollarIcon">$</span>
                        <input
                          type="number"
                          name="feePayment"
                          value={formData.feePayment}
                          onChange={handleChange}
                          disabled={mode === 'view'}
                          className={`input ${errors.feePayment ? 'inputError' : ''} ${allowFeeAdjust ? 'hasInlineAction' : ''}`}
                          placeholder="Enter fee payment"
                        />
                        {allowFeeAdjust && (
                          <div className="addAmountInline">
                            {!addAmountVisible ? (
                              <button type="button" className="plusSmallButton" onClick={() => setAddAmountVisible(true)} aria-label="Add amount">+</button>
                            ) : (
                              <div className="addAmountControlsInline">
                                <input
                                  type="number"
                                  value={addAmount}
                                  onChange={(e) => setAddAmount(e.target.value)}
                                  className="smallAddInput"
                                  placeholder="0"
                                />
                                <button type="button" className="addConfirmButton" onClick={handleAddAmountConfirm} aria-label="Confirm add">OK</button>
                                <button type="button" className="addCancelButton" onClick={handleAddAmountCancel} aria-label="Cancel add">✕</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {errors.feePayment && <div className="errorText">{errors.feePayment}</div>}
                    </div>
                  ) : null}
                </div>
                <div className="formColumn">
                  <div className="formGroup">
                    <label className="label">Phone Number</label>
                    <div className="inputWrapper">
                      <Image src="/icons/phone.svg" alt="Phone" width={20} height={20} className="inputIcon" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className={`input ${errors.phoneNumber ? 'inputError' : ''}`}
                        placeholder="Enter phone number"
                      />
                      {errors.phoneNumber && <div className="errorText">{errors.phoneNumber}</div>}
                    </div>
                  </div>
                  {entityLabel === 'Parent' || hideAcademic ? (
                    <>
                      <div className="formGroup">
                        <label className="label">Academic Year</label>
                        <div className="inputWrapper">
                          <Image src="/icons/select-month.svg" alt="Academic Year" width={20} height={20} className="inputIcon" />
                          <input
                            type="text"
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`input ${errors.academicYear ? 'inputError' : ''}`}
                            placeholder="Enter academic year"
                          />
                        </div>
                        {errors.academicYear && <div className="errorText">{errors.academicYear}</div>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="formGroup">
                        <label className="label">Gender</label>
                        <div className="inputWrapper">
                          <Image src="/icons/gender.svg" alt="Gender" width={20} height={20} className="inputIcon" />
                          <div className={`selectContainer ${errors.gender ? 'inputError' : ''}`}>
                            <Select
                              options={genderOptions}
                              value={formData.gender ? { value: formData.gender, label: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) } : null}
                              onChange={handleGenderChangeWithClear}
                              classNamePrefix="custom-select"
                              components={{ DropdownIndicator }}
                              styles={singleSelectStyles}
                              menuPortalTarget={portalTarget}
                              menuPosition="fixed"
                              placeholder="Select gender..."
                              isDisabled={mode === 'view'}
                            />
                          </div>
                          {errors.gender && <div className="errorText">{errors.gender}</div>}
                        </div>
                      </div>
                      <div className="formGroup">
                        <label className="label">Date Of Birth</label>
                        <div className="inputWrapper">
                          <Image src="/icons/select-month.svg" alt="Calendar" width={20} height={20} className="inputIcon" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`input ${errors.dateOfBirth ? 'inputError' : ''}`}
                            placeholder="YYYY-MM-DD"
                          />
                          {errors.dateOfBirth && <div className="errorText">{errors.dateOfBirth}</div>}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
              )}
            </div>
            <div className="formActions">
              <button type="button" className="cancelButton" onClick={handleClose}>
                Cancel
              </button>
              {!hideAcademic ? (
                <button type="button" className="nextButton" onClick={handleNext}>
                  Next
                </button>
              ) : (
                mode === 'view' ? null : <button type="submit" className="submitButton">{mode === 'add' ? `Add ${entityLabel}` : 'Save'}</button>
              )}
            </div>
            </div>
          )}

          {/* Step 2: Academic Information */}
          {currentStep === 2 && (
            <div className="section">
              <div className="formGrid">
                <div className="formColumn">
                  <div className="formGroup">
                    <label className="label">Level{entityLabel === 'Teacher' ? 's' : ''}</label>
                    <div className="inputWrapper">
                      <Image src="/icons/level.svg" alt="Level" width={20} height={20} className="inputIcon" />
                      <div className={`selectContainer ${errors.level ? 'inputError' : ''}`}>
                        {entityLabel === 'Teacher' ? (
                          <Select
                            isMulti
                            options={levelOptions}
                            value={(formData.levels || []).map(l => ({ value: l, label: l }))}
                            onChange={handleTeacherLevelsChange}
                            classNamePrefix="custom-select"
                            placeholder="Select levels..."
                            components={{ DropdownIndicator }}
                            styles={{
                              control: (base: any) => ({
                                ...base,
                                backgroundColor: '#F8F9FA',
                                borderColor: '#e5e7eb',
                                borderRadius: 8,
                                minHeight: 48,
                                boxShadow: 'none',
                                paddingLeft: 12,
                              }),
                              valueContainer: (base: any) => ({ ...base, padding: '2px 0' }),
                              multiValue: (base: any) => ({
                                ...base,
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: 6,
                                padding: '2px 6px',
                              }),
                              multiValueLabel: (base: any) => ({ ...base, color: '#1B2B4D', fontWeight: 500 }),
                              multiValueRemove: (base: any) => ({ ...base, color: '#6b7280', ':hover': { backgroundColor: '#F8F9FA', color: '#1B2B4D' } }),
                              placeholder: (base: any) => ({ ...base, color: '#9ca3af', fontWeight: 400 }),
                              indicatorSeparator: () => ({ display: 'none' }),
                              menu: (base: any) => ({ ...base, backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 6px 18px rgba(11,20,30,0.08)', marginTop: 8 }),
                              menuList: (base: any) => ({ ...base, backgroundColor: '#fff', padding: 4, maxHeight: 220, overflowY: 'auto' }),
                              option: (base: any, state: any) => ({ ...base, backgroundColor: state.isFocused || state.isSelected ? '#E8F3FF' : '#fff', color: '#1B2B4D' }),
                              menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
                            }}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            isDisabled={mode === 'view'}
                          />
                        ) : (
                          <Select
                            options={levelOptions}
                            value={formData.level ? { value: formData.level, label: formData.level } : null}
                            onChange={handleLevelChangeWithClear}
                            classNamePrefix="custom-select"
                            components={{ DropdownIndicator }}
                            styles={singleSelectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            placeholder="Select level..."
                            isDisabled={mode === 'view'}
                          />
                        )}
                      </div>
                      {errors.level && <div className="errorText">{errors.level}</div>}
                    </div>
                  </div>

                  <div className="formGroup">
                    <label className="label">Academic Year</label>
                    <div className="inputWrapper">
                      <Image src="/icons/select-month.svg" alt="Calendar" width={20} height={20} className="inputIcon" />
                      <input
                        type="text"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className={`input ${errors.academicYear ? 'inputError' : ''}`}
                        placeholder="Enter academic year"
                      />
                      {errors.academicYear && <div className="errorText">{errors.academicYear}</div>}
                    </div>
                  </div>

                  <div className="formGroup">
                    {entityLabel === 'Teacher' ? (
                      <>
                        <label className="label">Enrollment Date</label>
                        <div className="inputWrapper">
                          <Image src="/icons/select-month.svg" alt="Calendar" width={20} height={20} className="inputIcon" />
                          <input
                            type="date"
                            name="enrollmentDate"
                            value={formData.enrollmentDate}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`input ${errors.enrollmentDate ? 'inputError' : ''}`}
                          />
                        </div>
                        {errors.enrollmentDate && <div className="errorText">{errors.enrollmentDate}</div>}
                      </>
                    ) : (
                      <>
                        <label className="label">Fee Payment</label>
                        <div className="inputWrapper">
                          <span className="dollarIcon">$</span>
                          <input
                            type="number"
                            name="feePayment"
                            value={formData.feePayment}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`input ${errors.feePayment ? 'inputError' : ''}`}
                            placeholder="Enter fee payment"
                          />
                          {mode === 'edit' && (
                            <div className="addAmountWrapper">
                              {!addAmountVisible ? (
                                <button type="button" className="plusSmallButton" onClick={() => setAddAmountVisible(true)} aria-label="Add amount">+</button>
                              ) : (
                                <div className="addAmountControls">
                                  <input
                                    type="number"
                                    value={addAmount}
                                    onChange={(e) => setAddAmount(e.target.value)}
                                    className="smallAddInput"
                                    placeholder="0"
                                  />
                                  <button type="button" className="addConfirmButton" onClick={handleAddAmountConfirm} aria-label="Confirm add">OK</button>
                                  <button type="button" className="addCancelButton" onClick={handleAddAmountCancel} aria-label="Cancel add">✕</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="formColumn">
                  <div className="formGroup">
                    <label className="label">Modules</label>
                    <div className={`selectContainer ${errors.modules ? 'inputError' : ''}`}>
                      <Select
                        isMulti
                        options={moduleOptions}
                        value={formData.modules.map(m => ({ value: m, label: m }))}
                        onChange={handleModulesChangeWithClear}
                        classNamePrefix="custom-select"
                        placeholder="Select modules..."
                        components={{ DropdownIndicator }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: '#F8F9FA',
                            borderColor: '#e5e7eb',
                            borderRadius: 8,
                            minHeight: 48,
                            boxShadow: 'none',
                            paddingLeft: 12,
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: '2px 0',
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: 6,
                            padding: '2px 6px',
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: '#1B2B4D',
                            fontWeight: 500,
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: '#6b7280',
                            ':hover': { backgroundColor: '#F8F9FA', color: '#1B2B4D' },
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: '#9ca3af',
                            fontWeight: 400,
                          }),
                          indicatorSeparator: () => ({ display: 'none' }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            boxShadow: '0 6px 18px rgba(11,20,30,0.08)',
                            marginTop: 8,
                          }),
                          menuList: (base) => ({
                            ...base,
                            backgroundColor: '#fff',
                            padding: 4,
                            maxHeight: 220,
                            overflowY: 'auto',
                          }),
                          option: (base: any, state: any) => ({
                            ...base,
                            backgroundColor: state.isFocused || state.isSelected ? '#E8F3FF' : '#fff',
                            color: '#1B2B4D',
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={portalTarget}
                        menuPosition="fixed"
                        isDisabled={mode === 'view'}
                      />
                    </div>
                    {errors.modules && <div className="errorText">{errors.modules}</div>}
                  </div>

                  {entityLabel !== 'Teacher' && (
                    <div className="formGroup">
                      <label className="label">Sessions</label>
                      <div className={`selectContainer ${errors.sessions ? 'inputError' : ''}`}>
                        <Select
                          isMulti
                          options={sessionOptions}
                          value={selectedSessionOptions}
                          onChange={handleSessionsChangeWithClear}
                          classNamePrefix="custom-select"
                          placeholder={sessionsLoading ? 'Loading sessions...' : 'Select sessions...'}
                          components={{ DropdownIndicator }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: '#F8F9FA',
                              borderColor: '#e5e7eb',
                              borderRadius: 8,
                              minHeight: 48,
                              boxShadow: 'none',
                              paddingLeft: 12,
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              padding: '2px 0',
                            }),
                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: 6,
                              padding: '2px 6px',
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: '#1B2B4D',
                              fontWeight: 500,
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: '#6b7280',
                              ':hover': { backgroundColor: '#F8F9FA', color: '#1B2B4D' },
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: '#9ca3af',
                              fontWeight: 400,
                            }),
                            indicatorSeparator: () => ({ display: 'none' }),
                            menu: (base) => ({
                              ...base,
                              backgroundColor: '#fff',
                              borderRadius: 8,
                              boxShadow: '0 6px 18px rgba(11,20,30,0.08)',
                              marginTop: 8,
                            }),
                            menuList: (base) => ({
                              ...base,
                              backgroundColor: '#fff',
                              padding: 4,
                              maxHeight: 220,
                              overflowY: 'auto',
                            }),
                            option: (base: any, state: any) => ({
                              ...base,
                              backgroundColor: state.isFocused || state.isSelected ? '#E8F3FF' : '#fff',
                              color: '#1B2B4D',
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPortalTarget={portalTarget}
                          menuPosition="fixed"
                          isDisabled={mode === 'view' || sessionsLoading}
                        />
                      </div>
                      {errors.sessions && <div className="errorText">{errors.sessions}</div>}
                      {sessionsError && <div className="errorText">{sessionsError}</div>}
                    </div>
                  )}

                  {entityLabel === 'Teacher' && (
                    <div className="formGroup">
                      <label className="label">Payment Method</label>
                      <div className="inputWrapper">
                        <Image src="/icons/paiment.svg" alt="Payment" width={16} height={16} className="inputIcon paymentIcon" />
                        <div className={`selectContainer ${errors.paymentMethod ? 'inputError' : ''}`}>
                          <Select
                            options={paymentMethodOptions}
                            value={formData.paymentMethod ? { value: formData.paymentMethod, label: formData.paymentMethod.charAt(0).toUpperCase() + formData.paymentMethod.slice(1) } : null}
                            onChange={handlePaymentMethodChange}
                            classNamePrefix="custom-select"
                            components={{ DropdownIndicator }}
                            styles={singleSelectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            placeholder="Select payment method..."
                            isDisabled={mode === 'view'}
                          />
                        </div>
                      </div>
                      {errors.paymentMethod && <div className="errorText">{errors.paymentMethod}</div>}
                    </div>
                  )}

                  {entityLabel === 'Teacher' && (
                    <div className="formGroup">
                      <label className="label">Payment Status</label>
                      <div className="inputWrapper">
                        <Image src="/icons/paiment.svg" alt="Payment Status" width={16} height={16} className="inputIcon paymentIcon" />
                        <div className={`selectContainer ${errors.paymentStatus ? 'inputError' : ''}`}>
                          <Select
                            options={paymentStatusOptions}
                            value={formData.paymentStatus ? { value: formData.paymentStatus, label: formData.paymentStatus.charAt(0).toUpperCase() + formData.paymentStatus.slice(1) } : null}
                            onChange={handlePaymentStatusChange}
                            classNamePrefix="custom-select"
                            components={{ DropdownIndicator }}
                            styles={singleSelectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            placeholder="Select payment status..."
                            isDisabled={mode === 'view'}
                          />
                        </div>
                      </div>
                      {errors.paymentStatus && <div className="errorText">{errors.paymentStatus}</div>}
                    </div>
                  )}

                  {entityLabel === 'Teacher' && (
                    <div className="formActionsUnder">
                      {mode === 'view' && (
                        <>
                          <button type="button" className="previousButton" onClick={handlePrevious}>
                            Previous
                          </button>
                          <button type="button" className="cancelButton" onClick={handleClose}>
                            Close
                          </button>
                        </>
                      )}
                      {mode === 'edit' && (
                        <>
                          <button type="button" className="cancelButton" onClick={handleClose}>
                            Cancel
                          </button>
                          <button type="button" className="previousButton" onClick={handlePrevious}>
                            Previous
                          </button>
                          <button type="submit" className="submitButton">
                            Save Changes
                          </button>
                        </>
                      )}
                      {mode === 'add' && (
                        <>
                          <button type="button" className="cancelButton" onClick={handleClose}>
                            Cancel
                          </button>
                          <button type="button" className="previousButton" onClick={handlePrevious}>
                            Previous
                          </button>
                          <button type="submit" className="submitButton">
                            Add Teacher
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {entityLabel !== 'Teacher' && (
                    <div className="formActionsUnder">
                      {mode === 'view' && (
                        <>
                          <button type="button" className="previousButton" onClick={handlePrevious}>
                            Previous
                          </button>
                          <button type="button" className="cancelButton" onClick={handleClose}>
                            Close
                          </button>
                        </>
                      )}
                      {mode === 'edit' && (
                        <>
                          <button type="button" className="cancelButton" onClick={handleClose}>
                            Cancel
                          </button>
                          <button type="button" className="previousButton" onClick={handlePrevious}>
                            Previous
                          </button>
                          <button type="submit" className="submitButton">
                            Save Changes
                          </button>
                        </>
                      )}
                      {mode === 'add' && (
                        <>
                          <button type="button" className="cancelButton" onClick={handleClose}>
                            Cancel
                          </button>
                          <button type="button" className="previousButton" onClick={handlePrevious}>
                            Previous
                          </button>
                          <button type="submit" className="submitButton">
                            Add Student
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
        <ConfirmModal
          open={isDeleteConfirmOpen}
          title={`Delete ${entityLabel}`}
          message={`Are you sure you want to delete this ${entityLabel.toLowerCase()}? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
}