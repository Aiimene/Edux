'use client';

import React, { useState } from 'react';
import SettingsTabs from '../../../components/settings/SettingsTabs/SettingsTabs';
import GeneralTab from '../../../components/settings/GeneralTab/GeneralTab';
import UserRoleTab from '../../../components/settings/UserRoleTab/UserRoleTab';
import BillingTab from '../../../components/settings/BillingTab/BillingTab';
import SecurityTab from '../../../components/settings/SecurityTab/SecurityTab';
import SupportTab from '../../../components/settings/SupportTab/SupportTab';
import styles from './page.module.css';

type TabType = 'general' | 'user-role' | 'billing' | 'security' | 'support';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // General Tab State
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleSaveGeneral = async () => {
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
      <SettingsTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        showSaveButton={activeTab === 'general'}
        onSave={handleSaveGeneral}
        isSaving={isSaving}
        saveMessage={saveMessage}
      />
      
      {activeTab === 'general' && (
        <GeneralTab 
          schoolData={schoolData}
          setSchoolData={setSchoolData}
          interfaceData={interfaceData}
          setInterfaceData={setInterfaceData}
        />
      )}
      {activeTab === 'user-role' && <UserRoleTab />}
      {activeTab === 'billing' && <BillingTab />}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'support' && <SupportTab />}
    </div>
  );
}

