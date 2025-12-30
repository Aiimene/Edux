'use client';

import React from "react";
import Image from "next/image";
import enterpriseData from "../../../data/enterprise.json";
import styles from "./layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      {/* Greeting Section */}
      <div className={styles.greetingSection}>
        <p className={styles.greetingText}>Hello</p>
          <Image src="/icons/hello.svg" alt="hello" width={45} height={45} className={styles.greetingIcon} />
        <p className={styles.enterpriseName}>{enterpriseData.name}</p>
      </div>
      <p className={styles.subtitle}>Track everything from one place</p>
      {children}
    </div>
  );
}
