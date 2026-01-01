'use client';

import React, { useState } from 'react';
import { authService } from '../../../lib/api/auth.service';
import styles from './SecurityTab.module.css';

export default function SecurityTab() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend API (dj-rest-auth standard endpoint)
      await authService.changePassword({
        old_password: passwordData.currentPassword,
        new_password1: passwordData.newPassword,
        new_password2: passwordData.confirmPassword,
      });

      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setPasswordSuccess('');
      }, 5000);
    } catch (error: any) {
      const errorMessage = error?.data?.old_password?.[0] || 
                          error?.data?.new_password1?.[0] ||
                          error?.data?.new_password2?.[0] ||
                          error?.data?.detail ||
                          error?.message ||
                          'Failed to change password. Please check your current password.';
      setPasswordError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Password and Authentication Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Password and Authentication</h2>
        
        <h3 className={styles.subtitle}>Change Password</h3>

        <form className={styles.passwordForm} onSubmit={handlePasswordChange}>
          <div className={styles.formField}>
            <label className={styles.label}>Current password</label>
            <input
              type="password"
              className={styles.input}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>New password</label>
            <input
              type="password"
              className={styles.input}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength={8}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Confirm password</label>
            <input
              type="password"
              className={styles.input}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              minLength={8}
              disabled={isSubmitting}
            />
          </div>

          {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
          {passwordSuccess && <p style={{ color: 'green', marginBottom: '1rem' }}>{passwordSuccess}</p>}

          <div className={styles.passwordActions}>
            <button 
              type="submit" 
              className={styles.updateButton}
              disabled={isSubmitting}
            >
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
