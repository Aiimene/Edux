'use client';

import React from 'react';
import styles from './SettingsTabs.module.css';

type TabType = 'general' | 'user-role' | 'billing' | 'security' | 'support';

type SettingsTabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

const tabs: { id: TabType; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'user-role', label: 'User & Role management' },
  { id: 'billing', label: 'Billing' },
  { id: 'security', label: 'Security' },
  { id: 'support', label: 'Support' },
];

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
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
  );
}

