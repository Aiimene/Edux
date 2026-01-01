'use client';

import React, { useState } from 'react';
import { sendSupportMessage } from '../../../lib/api/settings';
import styles from './SupportTab.module.css';

export default function SupportTab() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setIsSubmitting(true);

    try {
      await sendSupportMessage({ message: message.trim() });
      setSuccess('Message sent successfully!');
      setMessage('');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Send Us a Message Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Send Us a Message</h2>
        
        <form className={styles.messageForm} onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label className={styles.label}>Message</label>
            <textarea
              className={styles.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              required
              disabled={isSubmitting}
            />
          </div>

          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Get in touch Section */}
      <div className={styles.contactSection}>
        <h2 className={styles.sectionTitle}>Get in touch</h2>
        <p className={styles.contactDescription}>
          Our support team is here to help you. Reach out through any of the following channels.
        </p>
        
        <div className={styles.contactCards}>
          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <svg width="34" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Email Support</h3>
            <p className={styles.cardDescription}>Send us an email anytime</p>
            <a href="mailto:support@edux-manager.online" className={styles.emailLink}>
              support@edux-manager.online
            </a>
            <div className={styles.responseTime}>
              <svg width="17" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Response within 24 hours</span>
            </div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <svg width="39" height="43" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Phone Support</h3>
            <p className={styles.cardDescription}>Call us anytime</p>
            <a href="tel:+213541731397" className={styles.emailLink}>
              0541731397
            </a>
            <div className={styles.responseTime}>
              <svg width="17" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Response within 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
