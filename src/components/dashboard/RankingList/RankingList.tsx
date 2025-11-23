import React from "react";
import styles from "./RankingList.module.css";

type Teacher = {
  id: number;
  name: string;
  sessions: number;
  percentage: number;
  avatar: string; // e.g. "/icons/teacher.svg"
  medal: string;  // e.g. "/icons/medal-1.svg"
};

type Props = {
  title: string;
  icon: string;     // e.g. "/icons/list.svg"
  teachers: Teacher[];
};

const RankingList: React.FC<Props> = ({ title, icon, teachers }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <img src={icon} alt="Ranking Icon" width={22} height={22} />
      <h3 className={styles.title}>{title}</h3>
    </div>
    <ul className={styles.list}>
      {teachers.map((teacher) => (
        <li className={styles.item} key={teacher.id}>
          <img src={teacher.medal} alt="Ranking" className={styles.medal} width={20} height={20} />
          <img src={teacher.avatar} alt="Teacher Avatar" className={styles.avatar} width={35} height={35} />
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

export default RankingList;

