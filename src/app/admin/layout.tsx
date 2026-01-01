'use client';
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../../components/UI/Sidebar";
import DashboardTop from "../../components/dashboard/DashboardTop/DashboardTop";
import MembersTop from "../../components/members/MembersTop/MembersTop";
import TopBar from "../../components/layout/TopBar/TopBar";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import AdminGuard from "../../components/auth/AdminGuard";
import styles from "./layout.module.css";

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, isMobile, toggle, close } = useSidebar();
  const pathname = usePathname();
  
  // Determine which top bar component to use based on pathname
  const renderTopBar = () => {
    if (pathname === '/admin/dashboard') {
      return <DashboardTop onMenuClick={toggle} />;
    }
    if (pathname.startsWith('/admin/members')) {
      return <MembersTop onMenuClick={toggle} />;
    }
    // For other pages, use TopBar with appropriate title and icon
    if (pathname.startsWith('/admin/academic')) {
      return <TopBar title="Academic" icon="/icons/academic.svg" iconWidth={22} iconHeight={22} onMenuClick={toggle} />;
    }
    if (pathname.startsWith('/admin/settings')) {
      return <TopBar title="Settings" icon="/icons/settings.svg" iconWidth={24} iconHeight={24} onMenuClick={toggle} />;
    }
    if (pathname.startsWith('/admin/attendance')) {
      return <TopBar title="Attendance" icon="/icons/attendance.svg" iconWidth={24} iconHeight={24} onMenuClick={toggle} />;
    }
    if (pathname.startsWith('/admin/analytics')) {
      return <TopBar title="Analytics" icon="/icons/analytics.svg" iconWidth={24} iconHeight={24} onMenuClick={toggle} />;
    }
    if (pathname.startsWith('/admin/announcements')) {
      return <TopBar title="Announcements" icon="/icons/announcements.svg" iconWidth={24} iconHeight={24} onMenuClick={toggle} />;
    }
    // Default
    return <DashboardTop onMenuClick={toggle} />;
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isOpen} onClose={close} />
      <div className={`${styles.mainContent} ${isMobile && !isOpen ? styles.sidebarClosed : ''}`}>
        {renderTopBar()}
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
    <AdminGuard>
      <SidebarProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </SidebarProvider>
    </AdminGuard>
  );
}