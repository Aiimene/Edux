"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import enterpriseData from "../../../data/enterprise.json";
import styles from "./layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [schoolName, setSchoolName] = useState<string>(enterpriseData.name || "");

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('school_name') : '';
    if (stored && stored.trim()) {
      setSchoolName(stored);
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* Greeting Section */}
      <div className={styles.greetingSection}>
        <p className={styles.greetingText}>Hello</p>
        <Image src="/icons/hello.svg" alt="hello" width={30} height={30} className={styles.greetingIcon} />
        <p className={styles.enterpriseName}>{schoolName || 'Your School'}</p>
      </div>
      <p className={styles.subtitle}>Track everything from one place</p>
      {children}
    </div>
  );
}
