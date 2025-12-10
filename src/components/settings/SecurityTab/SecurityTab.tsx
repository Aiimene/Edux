'use client';

import React, { useState } from 'react';
import styles from './SecurityTab.module.css';

type Session = {
  id: string;
  device: string;
  ip: string;
  date: string;
  isCurrent: boolean;
  status: 'Active' | 'Inactive';
};

const mockSessions: Session[] = [
  {
    id: '1',
    device: 'Windows PC-Himda',
    ip: '127.0.0.0',
    date: 'Tarf danya : Date',
    isCurrent: true,
    status: 'Active',
  },
  {
    id: '2',
    device: 'Windows PC-Himda',
    ip: '127.0.0.0',
    date: 'Tarf danya : Date',
    isCurrent: false,
    status: 'Active',
  },
  {
    id: '3',
    device: 'Windows PC-Himda',
    ip: '127.0.0.0',
    date: 'Tarf danya : Date',
    isCurrent: false,
    status: 'Active',
  },
  {
    id: '4',
    device: 'Windows PC-Himda',
    ip: '127.0.0.0',
    date: 'Tarf danya : Date',
    isCurrent: false,
    status: 'Active',
  },
];

export default function SecurityTab() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [sessionTimeout, setSessionTimeout] = useState('30 minutes');
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    // TODO: Integrate with API
    console.log('Password changed');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully!');
  };

  const handleRevokeSession = (sessionId: string) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      setSessions(sessions.filter((s) => s.id !== sessionId));
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    alert('Forgot password functionality will be implemented');
  };

  return (
    <div className={styles.container}>
      {/* Password and Authentication Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Password and Authentication</h2>
        
        <h3 className={styles.subtitle}>Change Password</h3>

        <form className={styles.passwordForm} onSubmit={handlePasswordChange}>
          <div className={styles.formField}>
            <label className={styles.label}>Current pasword</label>
            <input
              type="password"
              className={styles.input}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
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
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Confirm Passwod</label>
            <input
              type="password"
              className={styles.input}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              minLength={8}
            />
          </div>

          {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}

          <div className={styles.passwordActions}>
            <button type="submit" className={styles.updateButton}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span>Update Paddword</span>
            </button>
            <button type="button" className={styles.forgotLink} onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>
        </form>

        <div className={styles.divider}></div>

        <div className={styles.sessionTimeoutSection}>
          <label className={styles.label}>Session Timeout</label>
          <select
            className={styles.select}
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
          >
            <option value="15 minutes">15 minutes</option>
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="2 hours">2 hours</option>
            <option value="Never">Never</option>
          </select>
        </div>
      </div>

      {/* Login Activity Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Login Activity</h2>
        
        <div className={styles.sessionsList}>
          {sessions.map((session) => (
            <div key={session.id} className={styles.sessionCard}>
              <div className={styles.sessionIcon}>
                <svg width="57" height="51" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div className={styles.sessionInfo}>
                <p className={styles.sessionDevice}>{session.device}</p>
                <p className={styles.sessionIp}>IP:{session.ip}</p>
                <p className={styles.sessionDate}>{session.date}</p>
              </div>
              {session.isCurrent ? (
                <div className={styles.currentSessionBadge}>
                  <span>Current session</span>
                  <span className={styles.statusDot}></span>
                </div>
              ) : (
                <>
                  <div className={styles.statusBadge}>
                    <span>{session.status}</span>
                    <span className={styles.statusDot}></span>
                  </div>
                  <button className={styles.revokeButton} onClick={() => handleRevokeSession(session.id)}>
                    <span>Revoke</span>
                    <span className={styles.statusDot}></span>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
