'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './NewPaymentModal.module.css';

type NewPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: {
    method: string;
    date: string;
    proof: File | null;
  }) => void;
};

export default function NewPaymentModal({ isOpen, onClose, onSave }: NewPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('Bank');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a JPG, PNG, or PDF file');
        return;
      }

      setProofFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setProofPreview(null);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!proofFile) {
      alert('Please upload proof of payment');
      return;
    }

    onSave({
      method: paymentMethod,
      date: paymentDate,
      proof: proofFile,
    });

    // Reset form
    setPaymentMethod('Bank');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setProofFile(null);
    setProofPreview(null);
    onClose();
  };

  const handleCancel = () => {
    setPaymentMethod('Bank');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setProofFile(null);
    setProofPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <h2 className={styles.title}>Submit Payment</h2>

        <div className={styles.description}>
          Upload proof of payment for your subscription. Our team will verify and approve your payment within 1-2 business days.
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Payment method</label>
          <select
            className={styles.select}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Bank">Bank</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Payment Date</label>
          <input
            type="date"
            className={styles.dateInput}
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Payment Reciept/Proof</label>
          <div className={styles.uploadSection}>
            <div className={styles.uploadArea} onClick={handleUploadClick}>
              {proofPreview ? (
                <div className={styles.preview}>
                  {proofFile?.type.startsWith('image/') ? (
                    <img src={proofPreview} alt="Proof preview" className={styles.previewImage} />
                  ) : (
                    <div className={styles.previewPdf}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span>{proofFile?.name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <span className={styles.uploadText}>Proof</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <div className={styles.requirements}>
              <p className={styles.requirementsTitle}>Upload Requirements</p>
              <ul className={styles.requirementsList}>
                <li>Clear image or scan of payment receipt</li>
                <li>Must show transaction reference number</li>
                <li>Accepted formats: JPG, PNG, PDF</li>
                <li>Maximum file size: 5MB</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            <svg width="37" height="33" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Cancel</span>
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

