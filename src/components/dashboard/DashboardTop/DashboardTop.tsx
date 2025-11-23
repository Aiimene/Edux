'use client';

import React from "react";
import styles from "./DashboardTop.module.css";
import Image from "next/image";
import enterpriseData from "../../../data/enterprise.json";

type DashboardTopProps = {
  onMenuClick?: () => void;
};

export default function DashboardTop({ onMenuClick }: DashboardTopProps) {
  return (
    <div className={styles.topWrapper}>
      {/* Left side: Menu button + Logo + Dashboard title */}
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
        <Image
          src="/icons/dashboard2.svg"
          alt="Dashboard Icon"
          width={20}
          height={20}
        />
        <h2 className={styles.title}>Dashboard</h2>
      </div>

      {/* Right side: Notification + Profile */}
      <div className={styles.rightSection}>
        <button className={styles.notifBtn}>
          <Image
            src="/icons/notification.svg"
            alt="Notifications"
            width={35}
            height={35}
          />
        </button>

        <div className={styles.verticalLine}></div>

        <div className={styles.profileBox}>
          <Image
            src="/icons/profile.svg"
            alt="Profile"
            width={35}
            height={35}
            className={styles.profileImg}
          />
          <div className={styles.profileText}>
            <span className={styles.profileName}> {enterpriseData.name}</span>
            <span className={styles.profileRole}>{enterpriseData.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

