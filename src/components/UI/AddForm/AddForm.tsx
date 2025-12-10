'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import './AddForm.css';
import Select, { components } from 'react-select';
import enterprise from '@/data/enterprise.json';
import ConfirmModal from '@/components/UI/ConfirmModal/ConfirmModal';

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
  sessions: string[];
  feePayment: string;
  enrollmentDate: string;
  paymentMethod: string;
  paymentStatus: string;
  gender: string;
  parentName: string;
  modules: string[];
  academicYear: string;
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
  const [formData, setFormData] = useState<FormData>(() => ({
    studentName: initialData?.studentName ?? '',
    email: initialData?.email ?? '',
    password: initialData?.password ?? '',
    dateOfBirth: initialData?.dateOfBirth ?? '',
    phoneNumber: initialData?.phoneNumber ?? '',
    level: initialData?.level ?? '',
    sessions: initialData?.sessions ?? [],
    feePayment: initialData?.feePayment ?? '',
    enrollmentDate: initialData?.enrollmentDate ?? '',
    paymentMethod: initialData?.paymentMethod ? String(initialData.paymentMethod).toLowerCase() : '',
    paymentStatus: initialData?.paymentStatus ? String(initialData.paymentStatus).toLowerCase() : '',
    gender: initialData?.gender ?? '',
    parentName: initialData?.parentName ?? '',
    modules: initialData?.modules ?? [],
    academicYear: initialData?.academicYear ?? '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

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
          sessions: [],
          feePayment: '',
          enrollmentDate: '',
          paymentMethod: '',
          paymentStatus: '',
          gender: '',
          parentName: '',
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
        sessions: initialData.sessions ?? [],
        feePayment: initialData.feePayment ?? '',
        enrollmentDate: initialData.enrollmentDate ?? '',
        paymentMethod: initialData.paymentMethod ? String(initialData.paymentMethod).toLowerCase() : '',
        paymentStatus: initialData.paymentStatus ? String(initialData.paymentStatus).toLowerCase() : '',
        gender: initialData.gender ?? '',
        parentName: initialData.parentName ?? '',
        modules: initialData.modules ?? [],
        academicYear: initialData.academicYear ?? '',
      });
      setErrors({});
    }
  }, [initialData, isOpen, mode]);

  type SelectOptions = {
    levels: string[];
    modules: string[];
    sessions: Array<string | number>;
    genders?: string[];
  };

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

  const selectOptions = ((enterprise as any).selectOptions as SelectOptions | undefined);

  const levels = selectOptions?.levels ?? [];
  const availableModules = selectOptions?.modules ?? [];
  const availableSessions = (selectOptions?.sessions ?? []).map(String);
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
    setFormData({ ...formData, [name]: value });
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const moduleOptions = availableModules.map(m => ({ value: m, label: m }));
  const sessionOptions = availableSessions.map(s => ({ value: s, label: `Session ${s}` }));

  const handleModulesChange = (selected: any) => {
    setFormData({
      ...formData,
      modules: selected ? selected.map((opt: any) => opt.value) : [],
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
      sessions: selected ? selected.map((opt: any) => opt.value) : [],
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
  const levelOptions = levels.map(l => ({ value: l, label: l }));

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

  const handleLevelChange = (selected: any) => {
    setFormData({ ...formData, level: selected ? selected.value : '' });
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

    if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Student name is required';
    if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
    if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
    if (!formData.dateOfBirth || String(formData.dateOfBirth).trim() === '') e.dateOfBirth = 'Date of birth is required';
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
      if (!formData.parentName || !String(formData.parentName).trim()) e.parentName = 'Child name is required';
      if (!formData.academicYear || String(formData.academicYear).trim() === '') e.academicYear = 'Academic year is required';
      if (!formData.feePayment || String(formData.feePayment).trim() === '') e.feePayment = 'Fee payment is required';
      setErrors(e);
      return e;
    }

    if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Student name is required';
    if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
    if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
    if (!formData.dateOfBirth || String(formData.dateOfBirth).trim() === '') e.dateOfBirth = 'Date of birth is required';
    if (!formData.phoneNumber || !String(formData.phoneNumber).trim()) e.phoneNumber = 'Phone number is required';
    if (!formData.gender || String(formData.gender).trim() === '') e.gender = 'Gender is required';
    if (!formData.level || String(formData.level).trim() === '') e.level = 'Level is required';
    if (!formData.modules || (Array.isArray(formData.modules) && formData.modules.length === 0)) e.modules = 'At least one module is required';
    if (!formData.sessions || (Array.isArray(formData.sessions) && formData.sessions.length === 0)) e.sessions = 'At least one session is required';
    if (!formData.academicYear || String(formData.academicYear).trim() === '') e.academicYear = 'Academic year is required';
    if (entityLabel !== 'Teacher') {
      if (!formData.feePayment || String(formData.feePayment).trim() === '') e.feePayment = 'Fee payment is required';
    } else {
      if (!formData.enrollmentDate || String(formData.enrollmentDate).trim() === '') e.enrollmentDate = 'Enrollment date is required';
      if (!formData.paymentMethod || String(formData.paymentMethod).trim() === '') e.paymentMethod = 'Payment method is required';
      if (!formData.paymentStatus || String(formData.paymentStatus).trim() === '') e.paymentStatus = 'Payment status is required';
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
      sessions: [],
      feePayment: '',
      enrollmentDate: '',
      paymentMethod: '',
      paymentStatus: '',
      gender: '',
      parentName: '',
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

    if (mode === 'edit' && onSave) {
      onSave(formData);
    } else if (mode === 'add') {
      console.log('Form submitted:', formData);
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
          <div className="stepIndicator">
            <div className={`step ${currentStep === 1 ? 'activeStep' : 'completedStep'}`}>
              <span className="stepNumber">1</span>
              <span className="stepLabel">Personal Information</span>
            </div>
            <div className={`stepLine ${currentStep === 2 ? 'active' : ''}`}></div>
            <div className={`step ${currentStep === 2 ? 'activeStep' : ''}`}>
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
                        className={`input ${errors.email ? 'inputError' : ''}`}
                        placeholder="Enter email"
                      />
                      {errors.email && <div className="errorText">{errors.email}</div>}
                    </div>
                  </div>
                  <div className="formGroup">
                    <label className="label">Password</label>
                    <div className="inputWrapper">
                      <Image src="/icons/fingerprint.svg" alt="Password" width={20} height={20} className="inputIcon" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className={`input ${errors.password ? 'inputError' : ''}`}
                        placeholder="Enter password"
                      />
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
                          className={`input ${errors.feePayment ? 'inputError' : ''} hasInlineAction`}
                          placeholder="Enter fee payment"
                        />
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
                        <label className="label">Child Name</label>
                        <div className="inputWrapper">
                          <Image src="/icons/parents.svg" alt="Child" width={20} height={20} className="inputIcon" />
                          <input
                            type="text"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`input ${errors.parentName ? 'inputError' : ''}`}
                            placeholder="Enter child name"
                          />
                        </div>
                        {errors.parentName && <div className="errorText">{errors.parentName}</div>}
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
              </div>
            </div>
          )}

          {/* Step 2: Academic Information */}
          {currentStep === 2 && (
            <div className="section">
              <div className="formGrid">
                <div className="formColumn">
                  <div className="formGroup">
                    <label className="label">Level</label>
                    <div className="inputWrapper">
                      <Image src="/icons/level.svg" alt="Level" width={20} height={20} className="inputIcon" />
                      <div className={`selectContainer ${errors.level ? 'inputError' : ''}`}>
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

                        <div style={{ height: 12 }} />

                        <label className="label">Payment Method</label>
                        <div className="paymentRow">
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

                  <div className="formGroup">
                    <label className="label">Sessions</label>
                    <div className={`selectContainer ${errors.sessions ? 'inputError' : ''}`}>
                      <Select
                        isMulti
                        options={sessionOptions}
                        value={formData.sessions.map(s => ({ value: s, label: `Session ${s}` }))}
                        onChange={handleSessionsChangeWithClear}
                        classNamePrefix="custom-select"
                        placeholder="Select sessions..."
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
                    {errors.sessions && <div className="errorText">{errors.sessions}</div>}
                  </div>

                  {entityLabel === 'Teacher' && (
                    <div className="formGroup">
                      <label className="label">Payment Status</label>
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
      </div>
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
  );
}
