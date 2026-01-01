"use client";

import React, { useMemo, useState, useEffect } from "react";
import styles from "./page.module.css";
import { getTimetable } from "@/lib/api/timetables";

type Session = {
  id: string;
  module: string;
  level: string;
  teacher: string;
  day: string;
  start: string;
  end: string;
  room: string;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const timeSlots = [
  { label: "08:00 - 10:00", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", start: "10:00", end: "12:00" },
  { label: "12:00 - 14:00", start: "12:00", end: "14:00" },
  { label: "14:00 - 16:00", start: "14:00", end: "16:00" },
  { label: "16:00 - 18:00", start: "16:00", end: "18:00" },
];

const dayNumberToName: Record<number, string> = {
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
  6: "Sunday",
};

const uniqueValues = (arr: string[]) => Array.from(new Set(arr));

export default function TimetablePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [moduleFilter, setModuleFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [teacherFilter, setTeacherFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTimetable({
          level: levelFilter !== "All" ? levelFilter : undefined,
          module: moduleFilter !== "All" ? moduleFilter : undefined,
          teacher: teacherFilter !== "All" ? teacherFilter : undefined,
        });
        
        const timetableData = response.timetable || response.sessions || response || [];
        const transformed: Session[] = timetableData.map((s: any) => ({
          id: s.id?.toString() || '',
          module: s.module?.name || s.course?.name || s.module || '',
          level: s.level?.name || s.course?.level?.name || s.level || '',
          teacher: s.teacher?.name || s.teacher || '',
          day: dayNumberToName[s.day_of_week] || s.day || '',
          start: s.start_time || s.start || '',
          end: s.end_time || s.end || '',
          room: s.room || 'N/A',
        }));
        
        setSessions(transformed);
      } catch (err: any) {
        console.error('Failed to fetch timetable:', err);
        setError(err.message || 'Failed to load timetable.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [moduleFilter, levelFilter, teacherFilter]);

  const moduleOptions = useMemo(() => ["All", ...uniqueValues(sessions.map((s) => s.module))], [sessions]);
  const levelOptions = useMemo(() => ["All", ...uniqueValues(sessions.map((s) => s.level))], [sessions]);
  const teacherOptions = useMemo(() => ["All", ...uniqueValues(sessions.map((s) => s.teacher))], [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const moduleOk = moduleFilter === "All" || session.module === moduleFilter;
      const levelOk = levelFilter === "All" || session.level === levelFilter;
      const teacherOk = teacherFilter === "All" || session.teacher === teacherFilter;
      return moduleOk && levelOk && teacherOk;
    });
  }, [sessions, moduleFilter, levelFilter, teacherFilter]);

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
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Planner</p>
          <h1 className={styles.title}>Weekly Timetable</h1>
          <p className={styles.subtitle}>View sessions by day and slot, filter by module, level, or teacher.</p>
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
                    (session) => session.day === day && session.start === slot.start && session.end === slot.end
                  );

                  return (
                    <td key={`${day}-${slot.label}`} className={styles.cell}>
                      {cellSessions.length === 0 ? (
                        <span className={styles.empty}>—</span>
                      ) : (
                        <div className={styles.sessionStack}>
                          {cellSessions.map((session) => (
                            <div key={session.id} className={styles.sessionCard}>
                              <div className={styles.sessionTop}>
                                <span className={styles.sessionModule}>{session.module}</span>
                                <span className={styles.sessionRoom}>{session.room}</span>
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
    </div>
  );
}
