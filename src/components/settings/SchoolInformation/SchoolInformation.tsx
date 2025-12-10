'use client';

import React from 'react';
import LogoUpload from '../LogoUpload/LogoUpload';
import styles from './SchoolInformation.module.css';

type SchoolData = {
  schoolName: string;
  schoolEmail: string;
  address: string;
  timezone: string;
  language: string;
  logo: string | null;
};

type SchoolInformationProps = {
  data: SchoolData;
  onDataChange: (data: SchoolData) => void;
};

export default function SchoolInformation({ data, onDataChange }: SchoolInformationProps) {
  const handleChange = (field: keyof SchoolData, value: string | null) => {
    onDataChange({ ...data, [field]: value });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>School Information</h2>
      
      {/* School Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoLabel}>School Logo</div>
        <div className={styles.logoContainer}>
          <LogoUpload 
            logo={data.logo}
            onLogoChange={(logo) => handleChange('logo', logo)}
          />
          <div className={styles.logoRequirements}>
            <p className={styles.requirementsTitle}>Image Requirements:</p>
            <ul className={styles.requirementsList}>
              <li>Recommended size: 512x512px (square)</li>
              <li>Accepted formats: JPG, PNG, SVG</li>
              <li>Maximum file size: 2MB</li>
              <li>Best with transparent background</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.label}>School name</label>
          <input
            type="text"
            className={styles.input}
            value={data.schoolName}
            onChange={(e) => handleChange('schoolName', e.target.value)}
            placeholder="Enter school name"
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>School Email</label>
          <input
            type="email"
            className={styles.input}
            value={data.schoolEmail}
            onChange={(e) => handleChange('schoolEmail', e.target.value)}
            placeholder="Enter school email"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formFieldFull}>
          <label className={styles.label}>Adresse</label>
          <input
            type="text"
            className={styles.input}
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter address"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.label}>Timezone</label>
          <select
            className={styles.select}
            value={data.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="Africa/Algiers">Africa/Algiers</option>
          </select>
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Language</label>
          <select
            className={styles.select}
            value={data.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>
      </div>
    </div>
  );
}

