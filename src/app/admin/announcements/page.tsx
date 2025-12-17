"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import AnnouncementsTop from "@/components/academic/AnnouncementsTop/AnnouncementsTop";

type Announcement = {
  id: string;
  sender: string;
  role: "Teacher" | "Admin";
  title: string;
  message: string;
  date: string;
};

const announcements: Announcement[] = [
  {
    id: "1",
    sender: "Mohamed",
    role: "Teacher",
    title: "Tomorrow's Mathematics Quiz",
    message: "A short quiz will be held tomorrow during the first period. Please review Chapter 4",
    date: "12/12/2024",
  },
  {
    id: "2",
    sender: "Mohamed",
    role: "Admin",
    title: "School is closed",
    message: "Please be informed that the school will be closed tomorrow from 10AM to 5PM",
    date: "12/12/2024",
  },
  {
    id: "3",
    sender: "Mohamed",
    role: "Teacher",
    title: "Tomorrow's Mathematics Quiz",
    message: "A short quiz will be held tomorrow during the first period. Please review Chapter 4",
    date: "12/12/2024",
  },
  {
    id: "4",
    sender: "Sarah Johnson",
    role: "Teacher",
    title: "Science Fair Next Week",
    message: "Don't forget to prepare your science projects. The fair will be held next Friday in the main hall.",
    date: "12/11/2024",
  },
  {
    id: "5",
    sender: "Admin Office",
    role: "Admin",
    title: "Parent-Teacher Meeting",
    message: "The monthly parent-teacher meeting is scheduled for December 20th at 3:00 PM. All parents are encouraged to attend.",
    date: "12/10/2024",
  },
];

export default function AnnouncementsPage() {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleSeeAll = () => {
    setVisibleCount(announcements.length);
  };

  return (
    <>
      <AnnouncementsTop />
      <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <div className={styles.titleRow}>
            <Image src="/icons/announcement.svg" alt="Announcements" width={20} height={20} />
            <h1 className={styles.title}>Recent Updates</h1>
          </div>
          <p className={styles.subtitle}>View all recent updates and important communications</p>
        </div>
      </div>

      <div className={styles.announcementsWrapper}>
        {announcements.slice(0, visibleCount).map((announcement) => (
          <div key={announcement.id} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.row}>
                <Image
                  src="/icons/teachers.svg"
                  alt={announcement.role}
                  width={18}
                  height={18}
                  className={styles.icon}
                />
                <span className={styles.label}>{announcement.role}:</span>
                <span className={styles.value}>{announcement.sender}</span>
              </div>

              <div className={styles.row}>
                <Image
                  src="/icons/levels.svg"
                  alt="Title"
                  width={18}
                  height={18}
                  className={styles.icon}
                />
                <span className={styles.label}>Title:</span>
                <span className={styles.value}>{announcement.title}</span>
              </div>

              <div className={styles.row}>
                <Image
                  src="/icons/announcement.svg"
                  alt="Message"
                  width={18}
                  height={18}
                  className={styles.icon}
                />
                <span className={styles.label}>Message:</span>
                <span className={styles.messageValue}>{announcement.message}</span>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.dateLabel}>Date:</span>
              <span className={styles.dateValue}>{announcement.date}</span>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < announcements.length && (
        <div className={styles.seeAllWrapper}>
          <button onClick={handleSeeAll} className={styles.seeAllButton}>
            See all
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      )}
    </div>
    </>
  );
}
