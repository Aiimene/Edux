"use client";

import React from "react";
import TopBar from "../../layout/TopBar/TopBar";

type MembersTopProps = {
  onMenuClick?: () => void;
};

export default function MembersTop({ onMenuClick }: MembersTopProps) {
  return (
    <TopBar title="Members" icon="/icons/members2.svg" iconWidth={30} iconHeight={30} onMenuClick={onMenuClick} />
  );
}

