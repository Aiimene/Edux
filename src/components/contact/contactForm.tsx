'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './contactForm.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>الاسم</label>
          <div className={styles.inputWrapper}>
            <Image 
              src="/icons/person-circle.svg" 
              alt="Name" 
              width={20} 
              height={20}
              className={styles.inputIcon}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="أدخل اسمك الكامل"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>البريد الإلكتروني</label>
          <div className={styles.inputWrapper}>
            <Image 
              src="/icons/envelope.svg" 
              alt="Email" 
              width={20} 
              height={20}
              className={styles.inputIcon}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="example@email.com"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>الموضوع</label>
          <div className={styles.inputWrapper}>
            <Image 
              src="/icons/envelope-arrow-up-fill.svg" 
              alt="Subject" 
              width={20} 
              height={20}
              className={styles.inputIcon}
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={styles.input}
              placeholder="موضوع الرسالة"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>الرسالة</label>
          <div className={styles.inputWrapper}>
            <Image 
              src="/icons/envelope.svg" 
              alt="Message" 
              width={20} 
              height={20}
              className={`${styles.inputIcon} ${styles.textareaIcon}`}
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`${styles.input} ${styles.textarea}`}
              placeholder="اكتب رسالتك هنا..."
              rows={6}
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          إرسال الرسالة
        </button>
      </form>
    </div>
  );
}

