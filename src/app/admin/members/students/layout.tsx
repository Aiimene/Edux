import React from "react";
import Image from "next/image";
import styles from "./layout.module.css";

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.titleSection}>
          <Image src="/icons/students.svg" alt="students" width={20} height={20} className={styles.icon} />
          <h1 className={styles.title}>Students Management</h1>
        </div>
        <p className={styles.subtitle}>Manage and track all student information</p>
      </div>
      
      {children}
    </div>
  );
}

