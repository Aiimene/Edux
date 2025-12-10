'use client';

import React from "react";
import Sidebar from "../../components/UI/Sidebar";
import { useSidebar } from "../../hooks/useSidebar";
import styles from "./layout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, close } = useSidebar();

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isOpen} onClose={close} />
      <div className={styles.mainContent}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

