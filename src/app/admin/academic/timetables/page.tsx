"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { getSessions } from "@/lib/api/sessions";

type TimetableSession = {
  id: string;
  sessionName: string;
  module: string;
  level: string;
  teacher: string;
  day: string; // e.g., Monday
  start: string; // HH:MM
  end: string; // HH:MM
  room?: string;
};

const dayNumberToName = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const uniqueValues = (arr: string[]) => Array.from(new Set(arr));

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map((v) => parseInt(v, 10));
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
};

export default function TimetablePage() {
  const [sessions, setSessions] = useState<TimetableSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [moduleFilter, setModuleFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [teacherFilter, setTeacherFilter] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getSessions();
        const data = Array.isArray(res) ? res : (res?.results || []);
        const mapped: TimetableSession[] = [];
        for (const s of data) {
          const base = {
            id: (s.id ?? "").toString(),
            sessionName: s.name || s.session_name || "",
            module: s.course_name || s.module_name || s.course?.name || s.module?.name || "",
            level: s.level_name || s.course?.level?.name || s.level?.name || "",
            teacher: s.teacher_name || s.teacher?.name || "",
            start: s.start_time || "",
            end: s.end_time || "",
            room: s.room || s.classroom || s.location || undefined,
          } as Omit<TimetableSession, "day"> & { room?: string };

          if (Array.isArray(s.days_of_week) && s.days_of_week.length) {
            for (const d of s.days_of_week) {
              mapped.push({ ...base, day: dayNumberToName[d] || "" });
            }
          } else {
            mapped.push({ ...base, day: s.day_name || dayNumberToName[s.day_of_week] || "" });
          }
        }
        setSessions(mapped);
      } catch (err) {
        console.error("Failed to load timetable sessions:", err);
        setError("Failed to load timetable. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const moduleOptions = useMemo(
    () => ["All", ...uniqueValues(sessions.map((s) => s.module).filter(Boolean))],
    [sessions]
  );
  const levelOptions = useMemo(
    () => ["All", ...uniqueValues(sessions.map((s) => s.level).filter(Boolean))],
    [sessions]
  );
  const teacherOptions = useMemo(
    () => ["All", ...uniqueValues(sessions.map((s) => s.teacher).filter(Boolean))],
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const moduleOk = moduleFilter === "All" || session.module === moduleFilter;
      const levelOk = levelFilter === "All" || session.level === levelFilter;
      const teacherOk = teacherFilter === "All" || session.teacher === teacherFilter;
      return moduleOk && levelOk && teacherOk;
    });
  }, [sessions, moduleFilter, levelFilter, teacherFilter]);

  const days = useMemo(() => {
    const found = uniqueValues(filteredSessions.map((s) => s.day).filter(Boolean));
    const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const sorted = order.filter((d) => found.includes(d));
    return sorted.length ? sorted : order.slice(0, 6);
  }, [filteredSessions]);

  const timeSlots = useMemo(() => {
    const pairs = uniqueValues(
      filteredSessions
        .map((s) => `${s.start}|${s.end}`)
        .filter((x) => x.includes("|"))
    );
    return pairs
      .map((p) => {
        const [start, end] = p.split("|");
        return { start, end, label: `${start} - ${end}` };
      })
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  }, [filteredSessions]);

  const sessionFitsSlot = (session: TimetableSession, slot: { start: string; end: string }) => {
    // Only show session in the slot that exactly matches its time range
    return session.start === slot.start && session.end === slot.end;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Planner</p>
          <h1 className={styles.title}>Weekly Timetable</h1>
          <p className={styles.subtitle}>View sessions by day and time; filter by module, level, or teacher.</p>
        </div>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="module">Module</label>
            <select id="module" value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
              {moduleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="level">Level</label>
            <select id="level" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              {levelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="teacher">Teacher</label>
            <select id="teacher" value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
              {teacherOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && <div style={{ padding: "20px", textAlign: "center" }}>Loading timetable...</div>}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
            color: "#c33",
            fontSize: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{ background: "none", border: "none", color: "#c33", cursor: "pointer", fontSize: "18px", fontWeight: "bold" }}
          >
            ×
          </button>
        </div>
      )}

      {!loading && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.timeCol}>Time</th>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot.label}>
                  <td className={styles.timeCol}>{slot.label}</td>
                  {days.map((day) => {
                    const cellSessions = filteredSessions.filter(
                      (session) => session.day === day && sessionFitsSlot(session, slot)
                    );
                    const overlap = cellSessions.length > 1;
                    return (
                      <td key={`${day}-${slot.label}`} className={styles.cell}>
                        {cellSessions.length === 0 ? (
                          <span className={styles.empty}>—</span>
                        ) : (
                          <div className={styles.sessionStack}>
                            {cellSessions.map((session) => (
                              <div
                                key={session.id}
                                className={overlap ? `${styles.sessionCard} ${styles.sessionCardOverlap}` : styles.sessionCard}
                              >
                                <div className={styles.sessionTop}>
                                  <span className={styles.sessionModule}>{session.sessionName || session.module}</span>
                                  {session.room ? <span className={styles.sessionRoom}>{session.room}</span> : null}
                                </div>
                                <div className={styles.sessionMeta}>
                                  <span>{session.level}</span>
                                  <span>•</span>
                                  <span>{session.teacher}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
