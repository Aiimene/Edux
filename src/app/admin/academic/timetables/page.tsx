"use client";

import React, { useMemo, useState } from "react";
import styles from "./page.module.css";

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

const sessions: Session[] = [
  { id: "1", module: "Mathematics", level: "Level 1", teacher: "Alice Gray", day: "Monday", start: "08:00", end: "10:00", room: "A1" },
  { id: "2", module: "Physics", level: "Level 2", teacher: "John Carter", day: "Monday", start: "10:00", end: "12:00", room: "B2" },
  { id: "3", module: "Chemistry", level: "Level 1", teacher: "Nora Hayes", day: "Tuesday", start: "12:00", end: "14:00", room: "Lab 1" },
  { id: "4", module: "English", level: "Level 3", teacher: "Emma Stone", day: "Wednesday", start: "14:00", end: "16:00", room: "C1" },
  { id: "5", module: "Mathematics", level: "Level 2", teacher: "Alice Gray", day: "Thursday", start: "08:00", end: "10:00", room: "A2" },
  { id: "6", module: "History", level: "Level 1", teacher: "Michael Lee", day: "Friday", start: "10:00", end: "12:00", room: "D1" },
  { id: "7", module: "Physics", level: "Level 3", teacher: "John Carter", day: "Friday", start: "14:00", end: "16:00", room: "B1" },
  { id: "8", module: "Biology", level: "Level 2", teacher: "Sophia Kim", day: "Tuesday", start: "08:00", end: "10:00", room: "Lab 2" },
  { id: "9", module: "Design", level: "Level 4", teacher: "Luis Perez", day: "Wednesday", start: "10:00", end: "12:00", room: "Studio" },
  { id: "10", module: "Mathematics", level: "Level 1", teacher: "Alice Gray", day: "Monday", start: "08:00", end: "10:00", room: "A3" },
];

const uniqueValues = (arr: string[]) => Array.from(new Set(arr));

export default function TimetablePage() {
  const [moduleFilter, setModuleFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [teacherFilter, setTeacherFilter] = useState("All");

  const moduleOptions = useMemo(() => ["All", ...uniqueValues(sessions.map((s) => s.module))], []);
  const levelOptions = useMemo(() => ["All", ...uniqueValues(sessions.map((s) => s.level))], []);
  const teacherOptions = useMemo(() => ["All", ...uniqueValues(sessions.map((s) => s.teacher))], []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const moduleOk = moduleFilter === "All" || session.module === moduleFilter;
      const levelOk = levelFilter === "All" || session.level === levelFilter;
      const teacherOk = teacherFilter === "All" || session.teacher === teacherFilter;
      return moduleOk && levelOk && teacherOk;
    });
  }, [moduleFilter, levelFilter, teacherFilter]);

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
