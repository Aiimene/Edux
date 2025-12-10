"use client";

import React from "react";
import TopBar from "../../layout/TopBar/TopBar";
import { usePathname } from "next/navigation";
import styles from "./DashboardTop.module.css";
import Image from "next/image";
import enterpriseData from "../../../data/enterprise.json";
import { useSidebar } from "../../../contexts/SidebarContext";

type DashboardTopProps = {
  onMenuClick?: () => void;
};

export default function DashboardTop({ onMenuClick }: DashboardTopProps) {
  return <TopBar title="Dashboard" icon="/icons/dashboard2.svg" iconWidth={20} iconHeight={20} onMenuClick={onMenuClick} />;
}

