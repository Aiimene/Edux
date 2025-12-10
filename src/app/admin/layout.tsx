'use client';

import React from "react";
import Sidebar from "../../components/UI/Sidebar";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import styles from "./layout.module.css";

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, isMobile, close } = useSidebar();

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isOpen} onClose={close} />
      <div className={`${styles.mainContent} ${isMobile && !isOpen ? styles.sidebarClosed : ''}`}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}

