
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import './addstudentmodal.css';
import Select, { components } from 'react-select';
import enterprise from '@/data/enterprise.json';
import { px } from 'framer-motion';

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8L10 12L14 8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </components.DropdownIndicator>
);

type AddStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // optional: reuse this modal for viewing/editing existing student
  initialData?: Partial<{
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
  }>;
  mode?: 'add' | 'edit' | 'view';
  onSave?: (data: any) => void;
  onDelete?: (id?: string) => void;
  entityLabel?: string;
  hideAcademic?: boolean;
};

export default function AddStudentModal({ isOpen, onClose, initialData, mode = 'add', onSave, onDelete, entityLabel = 'Student', hideAcademic = false }: AddStudentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [addAmountVisible, setAddAmountVisible] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [formData, setFormData] = useState(() => ({
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

  // Keep internal form state in sync when `initialData` or `isOpen` changes.
  // AddStudentModal remains mounted across open/close, so update form values
  // whenever a new student is selected or the modal is opened.
  useEffect(() => {
    if (mode === 'add') {
      // reset when opening in add mode
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

    // for edit/view modes, populate from initialData when available
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

  // Remove old selection states, react-select will handle them

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
    // Keep integer if both are integers
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
    // clear error for this field
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  // react-select handlers
  const moduleOptions = availableModules.map(m => ({ value: m, label: m }));
  const sessionOptions = availableSessions.map(s => ({ value: s, label: `Session ${s}` }));

  const handleModulesChange = (selected: any) => {
    setFormData({
      ...formData,
      modules: selected ? selected.map((opt: any) => opt.value) : [],
    });
  };
  // clear modules error when changed
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

  // Options + handlers for single-select react-select controls
  const genderOptions = genders.map(g => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }));
  const levelOptions = levels.map(l => ({ value: l, label: l }));

  // For portal rendering of menus (prevents underlying elements from showing through)
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

  // validation helpers
  const isEmail = (value: string) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (entityLabel === 'Parent') {
      // Parent: only validate the basic parent fields in the single section
      if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Parent name is required';
      if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
      if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
      if (!formData.phoneNumber || !String(formData.phoneNumber).trim()) e.phoneNumber = 'Phone number is required';
      setErrors(e);
      return Object.keys(e).length === 0;
    }

    // Student/Teacher default validations for step 1
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
      // validate single-section parent fields
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

    // Student/Teacher full validation
    // step1 validations
    if (!formData.studentName || !String(formData.studentName).trim()) e.studentName = 'Student name is required';
    if (!formData.email || !String(formData.email).trim() || !isEmail(String(formData.email))) e.email = 'Valid email is required';
    if (!formData.password || String(formData.password).length < 8) e.password = 'Password must be at least 8 characters';
    if (!formData.dateOfBirth || String(formData.dateOfBirth).trim() === '') e.dateOfBirth = 'Date of birth is required';
    if (!formData.phoneNumber || !String(formData.phoneNumber).trim()) e.phoneNumber = 'Phone number is required';
    if (!formData.gender || String(formData.gender).trim() === '') e.gender = 'Gender is required';
    // step2 validations (all required except parentName)
    if (!formData.level || String(formData.level).trim() === '') e.level = 'Level is required';
    if (!formData.modules || (Array.isArray(formData.modules) && formData.modules.length === 0)) e.modules = 'At least one module is required';
    if (!formData.sessions || (Array.isArray(formData.sessions) && formData.sessions.length === 0)) e.sessions = 'At least one session is required';
    if (!formData.academicYear || String(formData.academicYear).trim() === '') e.academicYear = 'Academic year is required';
    if (entityLabel !== 'Teacher') {
      if (!formData.feePayment || String(formData.feePayment).trim() === '') e.feePayment = 'Fee payment is required';
    } else {
      // For teachers, require payment method and payment status
      // Also require enrollment date for teachers
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
    // Removed unused state resets for react-select
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all required fields before submit
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
      // default add behavior
      console.log('Form submitted:', formData);
    }
    // In view mode do nothing on submit
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) onDelete();
    resetForm();
    onClose();
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
                  {/* Parent Name for Student flows: move to left column as requested */}
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
                  {/* Date of birth moved to right column to balance three fields per column */}
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

                      {/* Fee Payment moved to left column for parent flows */}
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

                      {/* Parent name moved to left column for Student flows. */}
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
                              {/* inline action buttons removed */}
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

                  {/* Move Payment Status here for teacher flows so right column has three fields */}
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

                  {/* Place Previous + Close under Payment Status for view mode */}
                  {/* Footer actions under Payment Status (shows for add, edit, view) */}
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
    </div>
  );
}

