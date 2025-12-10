'use client';

import React from 'react';
import styles from './SettingsTabs.module.css';

type TabType = 'general' | 'user-role' | 'billing' | 'security' | 'support';

type SettingsTabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showSaveButton?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  saveMessage?: { type: 'success' | 'error'; text: string } | null;
};

const tabs: { id: TabType; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'user-role', label: 'User & Role management' },
  { id: 'billing', label: 'Billing' },
  { id: 'security', label: 'Security' },
  { id: 'support', label: 'Support' },
];

export default function SettingsTabs({ 
  activeTab, 
  onTabChange,
  showSaveButton = false,
  onSave,
  isSaving = false,
  saveMessage
}: SettingsTabsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {showSaveButton && (
        <div className={styles.saveSection}>
          {saveMessage && (
            <div className={`${styles.message} ${styles[saveMessage.type]}`}>
              {saveMessage.text}
            </div>
          )}
          <button
            className={styles.saveButton}
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

