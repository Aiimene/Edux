"use client";

import React from "react";
import TopBar from "../../layout/TopBar/TopBar";

type AnnouncementsTopProps = {
  onMenuClick?: () => void;
};

export default function AnnouncementsTop({ onMenuClick }: AnnouncementsTopProps) {
  return (
    <TopBar title="Announcements" icon="/icons/announcement.svg" iconWidth={30} iconHeight={30} onMenuClick={onMenuClick} />
  );
}
