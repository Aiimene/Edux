import React from "react";
import styles from "./RemainingWeeklySession.module.css";

type Session = {
  Module: string;
  teacher: string;
  students: number;
  date: string; // ISO string
  time: string;
};

type Props = {
  title: string;
  icon: string;       // e.g. "/icons/time.svg"
  sessions: Session[];
  remainingSessionsCount: number;
  remainingSessionsHours: number;
  remainingSessionsDays: number;
};

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
}

const RemainingWeeklySessions: React.FC<Props> = ({
  title,
  icon,
  sessions,
  remainingSessionsCount,
  remainingSessionsHours,
  remainingSessionsDays
}) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <img src={icon} alt="Remaining Icon" width={22} height={22} />
      <h3 className={styles.title}>{title}</h3>
    </div>
    <div className={styles.gridAndStats}>
      <div className={styles.grid}>
        {sessions.map((session, idx) => (
          <div className={styles.sessionCard} key={idx}>
            <div className={styles.rank}>#{idx + 1}</div>
            <div><span className={styles.label}>Module:</span> {session.Module}</div>
            <div><span className={styles.label}>Teacher :</span> {session.teacher}</div>
            <div><span className={styles.label}>Students :</span> {session.students}</div>
            <div>
              <span className={styles.label}>Date:</span> {formatDate(session.date)}
            </div>
            <div><span className={styles.label}>Time:</span> {session.time}</div>
          </div>
        ))}
      </div>
      <div className={styles.stats}>
        <div>Remaining sessions :<br /><b>{remainingSessionsCount}</b></div>
        <div>Remaining hours:<br /><b>{remainingSessionsHours} hours</b></div>
        <div>Remaining days :<br /><b>{remainingSessionsDays} days</b></div>
      </div>
    </div>
  </div>
);

export default RemainingWeeklySessions;

