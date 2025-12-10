'use client';

import React from "react";
import DashboardTop from "../../../components/dashboard/DashboardTop/DashboardTop";
import { useSidebar } from "../../../contexts/SidebarContext";
import styles from "./layout.module.css";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggle } = useSidebar();

  return (
    <>
      <DashboardTop onMenuClick={toggle} />
      <div className={styles.container}>
        {children}
      </div>
    </>
  );
}

