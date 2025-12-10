'use client';

import React, { useState } from 'react';
import SchoolInformation from '../SchoolInformation/SchoolInformation';
import InterfacePreference from '../InterfacePreference/InterfacePreference';
import styles from './GeneralTab.module.css';

export default function GeneralTab() {
  const [schoolData, setSchoolData] = useState({
    schoolName: '',
    schoolEmail: '',
    address: '',
    timezone: 'UTC',
    language: 'English',
    logo: null as string | null,
  });

  const [interfaceData, setInterfaceData] = useState({
    darkMode: false,
    accentColor: 'Default',
    sidebarLayout: 'Default',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    // Validate required fields
    if (!schoolData.schoolName.trim()) {
      setSaveMessage({ type: 'error', text: 'School name is required' });
      setIsSaving(false);
      return;
    }

    if (!schoolData.schoolEmail.trim()) {
      setSaveMessage({ type: 'error', text: 'School email is required' });
      setIsSaving(false);
      return;
    }

    if (!schoolData.address.trim()) {
      setSaveMessage({ type: 'error', text: 'Address is required' });
      setIsSaving(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(schoolData.schoolEmail)) {
      setSaveMessage({ type: 'error', text: 'Please enter a valid email address' });
      setIsSaving(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/settings/general', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ schoolData, interfaceData }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.saveSection}>
        {saveMessage && (
          <div className={`${styles.message} ${styles[saveMessage.type]}`}>
            {saveMessage.text}
          </div>
        )}
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <SchoolInformation
        data={schoolData}
        onDataChange={setSchoolData}
      />
      <InterfacePreference
        data={interfaceData}
        onDataChange={setInterfaceData}
      />
    </div>
  );
}

