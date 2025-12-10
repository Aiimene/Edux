'use client';

import React from 'react';
import styles from './TopBar.module.css';
import Image from 'next/image';
import enterpriseData from '../../../data/enterprise.json';

type TopBarProps = {
  title: string;
  icon: string;
  iconWidth?: number;
  iconHeight?: number;
  onMenuClick?: () => void;
};

export default function TopBar({ title, icon, iconWidth = 24, iconHeight = 24, onMenuClick }: TopBarProps) {
  return (
    <div className={styles.topWrapper}>
      <div className={styles.leftSection}>
        {onMenuClick && (
          <button className={styles.menuButton} onClick={onMenuClick} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}

        <Image src={icon} alt={`${title} Icon`} width={iconWidth} height={iconHeight} />
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.notifBtn} title="Notifications">
          <Image src="/icons/notification.svg" alt="Notifications" width={35} height={35} />
        </button>

        <div className={styles.verticalLine}></div>

        <div className={styles.profileBox}>
          <Image src="/icons/profile.svg" alt="Profile" width={35} height={35} className={styles.profileImg} />
          <div className={styles.profileText}>
            <span className={styles.profileName}> {enterpriseData.name}</span>
            <span className={styles.profileRole}>{enterpriseData.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
