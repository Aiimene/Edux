'use client';
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../../components/UI/Sidebar";
import DashboardTop from "../../components/dashboard/DashboardTop/DashboardTop";
import MembersTop from "../../components/members/MembersTop/MembersTop";
import TopBar from "../../components/layout/TopBar/TopBar";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import styles from "./layout.module.css";

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, isMobile, toggle, close } = useSidebar();
  const pathname = usePathname();
  
  const isDashboard = pathname === '/admin/dashboard';
  const isMembersPage = pathname.startsWith('/admin/members/students') || 
                        pathname.startsWith('/admin/members/parents') || 
                        pathname.startsWith('/admin/members/teachers');
  const isAcademicPage = pathname.startsWith('/admin/academic');

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isOpen} onClose={close} />
      <div className={`${styles.mainContent} ${isMobile && !isOpen ? styles.sidebarClosed : ''}`}>
        {isDashboard && <DashboardTop onMenuClick={toggle} />}
        {isMembersPage && <MembersTop onMenuClick={toggle} />}
        {isAcademicPage && <TopBar title="Academic" icon="/icons/academic.svg" iconWidth={22} iconHeight={22} onMenuClick={toggle} />}
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