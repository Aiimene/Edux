"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import AnnouncementsTop from "@/components/academic/AnnouncementsTop/AnnouncementsTop";
import { getAnnouncements } from "@/lib/api/announcements";

type Announcement = {
  id: string;
  sender: string;
  role: "Teacher" | "Admin";
  title: string;
  message: string;
  date: string;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAnnouncements();
        const apiData = Array.isArray(response) ? response : (response.results || []);
        
        const transformed: Announcement[] = apiData.map((a: any) => ({
          id: a.id?.toString() || '',
          sender: a.created_by?.name || a.created_by?.username || a.sender || 'Unknown',
          role: a.created_by?.role === 'admin' ? 'Admin' : 'Teacher',
          title: a.title || '',
          message: a.message || '',
          date: a.created_at ? new Date(a.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        }));
        
        setAnnouncements(transformed);
      } catch (err: any) {
        console.error('Failed to fetch announcements:', err);
        setError(err.message || 'Failed to load announcements.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleSeeAll = () => {
    setVisibleCount(announcements.length);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Retry
        </button>
      </div>
    );
  }

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
        {announcements.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No announcements found.</p>
        ) : (
          announcements.slice(0, visibleCount).map((announcement) => (
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
          ))
        )}
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
