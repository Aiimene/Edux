import React from "react";
import Image from "next/image";
import enterpriseData from "../../../../data/enterprise.json";
import styles from "./layout.module.css";

export default function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.titleSection}>
          <Image src="/icons/teachers.svg" alt="teachers" width={30} height={30} className={styles.icon} />
          <h1 className={styles.title}>Teachers Management</h1>
        </div>
        <p className={styles.subtitle}>Manage and track all teacher information</p>
      </div>
      {children}
    </div>
  );
}

