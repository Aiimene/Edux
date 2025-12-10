'use client';

import React from 'react';
import Toggle from '../Toggle/Toggle';
import styles from './InterfacePreference.module.css';

type InterfaceData = {
  darkMode: boolean;
  accentColor: string;
  sidebarLayout: string;
};

type InterfacePreferenceProps = {
  data: InterfaceData;
  onDataChange: (data: InterfaceData) => void;
};

export default function InterfacePreference({ data, onDataChange }: InterfacePreferenceProps) {
  const handleChange = (field: keyof InterfaceData, value: boolean | string) => {
    onDataChange({ ...data, [field]: value });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Interface Preference</h2>
      
      {/* Dark Mode */}
      <div className={styles.preferenceItem}>
        <div className={styles.preferenceContent}>
          <h3 className={styles.preferenceTitle}>Dark Mode</h3>
          <p className={styles.preferenceDescription}>Enable Dark Mode across the dashboard</p>
        </div>
        <div className={styles.control}>
          <Toggle checked={data.darkMode} onChange={(checked) => handleChange('darkMode', checked)} />
        </div>
        <div className={styles.divider}></div>
      </div>

      {/* Accent Color */}
      <div className={styles.preferenceItem}>
        <div className={styles.preferenceContent}>
          <h3 className={styles.preferenceTitle}>Accent Color</h3>
          <p className={styles.preferenceDescription}>Choose the color you prefer</p>
        </div>
        <div className={styles.control}>
          <select
            className={styles.select}
            value={data.accentColor}
            onChange={(e) => handleChange('accentColor', e.target.value)}
          >
            <option value="Default">Default</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Purple">Purple</option>
            <option value="Orange">Orange</option>
          </select>
        </div>
        <div className={styles.divider}></div>
      </div>

      {/* Side Bar Layout */}
      <div className={styles.preferenceItem}>
        <div className={styles.preferenceContent}>
          <h3 className={styles.preferenceTitle}>Side Bar Layout</h3>
          <p className={styles.preferenceDescription}>Customize you side bar as you want</p>
        </div>
        <div className={styles.control}>
          <select
            className={styles.select}
            value={data.sidebarLayout}
            onChange={(e) => handleChange('sidebarLayout', e.target.value)}
          >
            <option value="Default">Default</option>
            <option value="Compact">Compact</option>
            <option value="Expanded">Expanded</option>
          </select>
        </div>
      </div>
    </div>
  );
}

