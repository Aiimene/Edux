"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import AnnouncementsTop from "@/components/academic/AnnouncementsTop/AnnouncementsTop";
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from "@/lib/api/announcements";
import { authService } from "@/lib/api/auth.service";
import ConfirmModal from "@/components/UI/ConfirmModal/ConfirmModal";

type Announcement = {
  id: string;
  sender: string;
  role: string;
  title: string;
  message: string;
  date: string;
};

const normalizeAnnouncement = (a: any): Announcement => {
  const created = a?.created_at || a?.date || a?.updated_at || '';
  return {
    id: (a?.id ?? Math.random().toString(36).slice(2)) + '',
    sender: a?.name || a?.sender || a?.created_by?.name || a?.author || '',
    role: a?.role || a?.created_by?.role || 'Admin',
    title: a?.title || a?.subject || '',
    message: a?.message || a?.body || a?.content || '',
    date: created ? new Date(created).toLocaleDateString() : '',
  };
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [role, setRole] = useState<string>('Admin');
  const [sending, setSending] = useState<boolean>(false);
  const [announcementSenders, setAnnouncementSenders] = useState<Record<string, string>>({});
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string>('');

  const visibleAnnouncements = useMemo(() => announcements, [announcements]);

  useEffect(() => {
    // Fetch admin profile to get username
    const fetchAdminProfile = async () => {
      try {
        const profile = await authService.getProfile();
        const username = profile?.user?.username || localStorage.getItem('username') || localStorage.getItem('display_name') || 'Admin';
        setAdminUsername(username);
        localStorage.setItem('username', username);
      } catch (err) {
        // Fallback to localStorage if API fails
        const username = localStorage.getItem('username') || localStorage.getItem('display_name') || 'Admin';
        setAdminUsername(username);
      }
    };
    fetchAdminProfile();

    // Load stored sender names FIRST
    let loadedSenders: Record<string, string> = {};
    try {
      const stored = localStorage.getItem('announcement_senders');
      if (stored) {
        loadedSenders = JSON.parse(stored);
        setAnnouncementSenders(loadedSenders);
      }
    } catch (_) {}
    
    // THEN fetch announcements with loaded senders
    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAnnouncements();
        const data = Array.isArray(res) ? res : res?.results || [];
        console.log('Initial load - fetched announcements:', data);
        console.log('Initial load - stored senders:', loadedSenders);
        // Merge with stored sender names in case backend didn't return them
        const normalized = data.map((a: any) => {
          const norm = normalizeAnnouncement(a);
          const storedName = loadedSenders[norm.id];
          console.log(`Initial load - Announcement ${norm.id}: backend="${norm.sender}", stored="${storedName}"`);
          return {
            ...norm,
            sender: storedName || norm.sender,
          };
        });
        setAnnouncements(normalized);
      } catch (err: any) {
        const msg = err?.response?.data?.error || err?.message || 'Failed to load announcements';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnnouncements();
  }, []);

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setRole('Admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError('Title and message are required.');
      return;
    }
    setSending(true);
    try {
      // Create announcement via API
      const response = await createAnnouncement({
        title: title.trim(),
        message: message.trim(),
        name: adminUsername,
        sender: adminUsername,
        role,
      });
      // Use returned ID or fallback
      const announcementId = (response?.id || response?.data?.id || response?.announcement?.id || Date.now()).toString();
      // Add optimistically
      const newAnnouncement: Announcement = {
        id: announcementId,
        sender: adminUsername,
        role,
        title: title.trim(),
        message: message.trim(),
        date: new Date().toLocaleDateString(),
      };
      setAnnouncements((prev: Announcement[]) => [newAnnouncement, ...prev]);
      // Store sender for this announcement
      const newSenders = { ...announcementSenders, [announcementId]: adminUsername };
      setAnnouncementSenders(newSenders);
      try {
        localStorage.setItem('announcement_senders', JSON.stringify(newSenders));
      } catch (_) {}
      resetForm();
      setShowForm(false);
      // Refresh to sync with backend and apply stored names
      setLoading(true);
      try {
        const res = await getAnnouncements();
        const data = Array.isArray(res) ? res : res?.results || [];
        const currentSenders: Record<string, string> = { ...announcementSenders, [announcementId]: adminUsername };
        const normalized = data.map((a: any) => {
          const norm = normalizeAnnouncement(a);
          const storedName = currentSenders[norm.id];
          return {
            ...norm,
            sender: storedName || norm.sender,
          };
        });
        setAnnouncements(normalized);
      } catch (_) {}
      setLoading(false);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to send announcement';
      setError(msg);
    }
    setSending(false);
  };

  const handleDeleteClick = (id: string) => {
    setAnnouncementToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAnnouncement(announcementToDelete);
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementToDelete));
      // Also remove from localStorage
      const newSenders = { ...announcementSenders };
      delete newSenders[announcementToDelete];
      setAnnouncementSenders(newSenders);
      try {
        localStorage.setItem('announcement_senders', JSON.stringify(newSenders));
      } catch (_) {}
      setIsDeleteModalOpen(false);
      setAnnouncementToDelete('');
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to delete announcement';
      setError(msg);
      setIsDeleteModalOpen(false);
      setAnnouncementToDelete('');
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setAnnouncementToDelete('');
  };

  return (
    <>
      <div className={styles.container}>
        <AnnouncementsTop />
        <div className={styles.header}> 
          <button className={styles.primaryBtn} onClick={() => setShowForm((v) => !v)}>
            <Image src="/icons/add.svg" alt="Add" width={18} height={18} />
            Add Announcement
          </button>
          {error && (
            <div className={styles.errorBanner}>
              <span>{error}</span>
              <button onClick={() => setError(null)} aria-label="Dismiss">×</button>
            </div>
          )}
        </div>

        {showForm && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Write the announcement message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => { resetForm(); setShowForm(false); }}>
                Cancel
              </button>
              <button type="submit" className={styles.primaryBtn} disabled={sending}>
                {sending ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={{ padding: '16px 0' }}>Loading announcements…</div>
        ) : (
          <div className={styles.announcementsWrapper}>
            {visibleAnnouncements.length === 0 && (
              <div className={styles.emptyState}>No announcements yet.</div>
            )}
            {visibleAnnouncements.map((announcement) => (
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
                  <div>
                    <span className={styles.dateLabel}>Date:</span>
                    <span className={styles.dateValue}>{announcement.date}</span>
                  </div>
                  <button 
                    className={styles.deleteBtn} 
                    onClick={() => handleDeleteClick(announcement.id)}
                    title="Delete announcement"
                  >
                    <Image src="/icons/delete.svg" alt="Delete" width={16} height={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        open={isDeleteModalOpen}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}