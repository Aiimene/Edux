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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      {activeTab === 'general' && <GeneralTab />}
      {activeTab === 'user-role' && <UserRoleTab />}
      {activeTab === 'billing' && <BillingTab />}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'support' && <SupportTab />}
    </div>
  );
}

