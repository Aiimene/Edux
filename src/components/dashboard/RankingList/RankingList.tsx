import React from "react";
import styles from "./RankingList.module.css";

type Teacher = {
  name: string;
  sessions: number;
  percentage: number;
};

type Props = {
  title: string;
  icon: string;     // e.g. "/icons/list.svg"
  teachers: Teacher[];
};

const RankingList: React.FC<Props> = ({ title, icon, teachers }) => {
  // Static paths for avatar and medal
  const avatarPath = "/icons/profile.svg";
  const medalPath = "/icons/medal.svg";

  // Defensive: Ensure teachers is always an array
  const safeTeachers = Array.isArray(teachers) ? teachers : [];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={icon} alt="Ranking Icon" width={22} height={22} />
        <h3 className={styles.title}>{title}</h3>
      </div>
      <ul className={styles.list}>
        {safeTeachers.map((teacher, index) => (
          <li className={styles.item} key={index + 1}>
            <img src={medalPath} alt="Ranking" className={styles.medal} width={20} height={20} />
            <img src={avatarPath} alt="Teacher Avatar" className={styles.avatar} width={35} height={35} />
            <div className={styles.info}>
              <span className={styles.name}>{teacher.name}</span>
              <span className={styles.sessions}>Sessions :{teacher.sessions}</span>
            </div>
            <div className={styles.percentage}>{teacher.percentage}%</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingList;

