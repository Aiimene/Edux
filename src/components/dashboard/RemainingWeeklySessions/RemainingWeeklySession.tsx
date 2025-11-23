import React from "react";
import styles from "./RemainingWeeklySession.module.css";

type Session = {
  rank: string;
  teacher: string;
  students: number;
  date: string; // ISO string
};

type Props = {
  title: string;
  icon: string;       // e.g. "/icons/time.svg"
  sessions: Session[];
  remainingSessionsCount: number;
  remainingSessionsHours: number;
  remainingSessionsDays: number;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getHours()}:00   ${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
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
            <div className={styles.rank}>{session.rank}</div>
            <div><span className={styles.label}>Teacher :</span> {session.teacher}</div>
            <div><span className={styles.label}>Students :</span> {session.students}</div>
            <div>
              <span className={styles.label}>Date:</span> {formatDate(session.date)}
            </div>
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

