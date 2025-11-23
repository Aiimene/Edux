'use client';

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../../components/UI/Sidebar";
import DashboardTop from "../../components/dashboard/DashboardTop";
import { useSidebar } from "../../hooks/useSidebar";
import styles from "./layout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, toggle, close } = useSidebar();
  const pathname = usePathname();
  const isDashboard = pathname === '/admin/dashboard';

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isOpen} onClose={close} />
      <div className={styles.mainContent}>
        {isDashboard && <DashboardTop onMenuClick={toggle} />}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

