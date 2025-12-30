"use client";
import DashboardCard from '../../../components/dashboard/DashboardCard/DashboardCard';
import Chart from '../../../components/dashboard/Chart/Chart';
import RankingList from '../../../components/dashboard/RankingList/RankingList';
import RemainingWeeklySessions from '../../../components/dashboard/RemainingWeeklySessions/RemainingWeeklySession';
import { useEffect, useState } from 'react';
import { getDashboardOverview, getClassesRanking, getStudentsEvolvement, getTeachersRanking, getWeeklySessions } from '../../../lib/api/dashboard';
import { getStudents } from '../../../lib/api/students';
import { getTeachers } from '../../../lib/api/teachers';
import styles from './page.module.css';

export default function DashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [classesRanking, setClassesRanking] = useState<any>(null);
  const [studentsEvolvement, setStudentsEvolvement] = useState<any>(null);
  const [teachersRanking, setTeachersRanking] = useState<any>(null);
  const [weeklySessions, setWeeklySessions] = useState<any>(null);
  const [studentsCount, setStudentsCount] = useState<number | null>(null);
  const [teachersCount, setTeachersCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [overviewData, classesRankingData, studentsEvolvementData, teachersRankingData, weeklySessionsData, studentsData, teachersData] = await Promise.all([
          getDashboardOverview(),
          getClassesRanking(),
          getStudentsEvolvement(),
          getTeachersRanking(),
          getWeeklySessions(),
          getStudents(),
          getTeachers()
        ]);
        setOverview(overviewData);
        setClassesRanking(classesRankingData);
        setStudentsEvolvement(studentsEvolvementData);
        setTeachersRanking(teachersRankingData);
        setWeeklySessions(weeklySessionsData);
        setStudentsCount(
          typeof studentsData?.count === 'number'
            ? studentsData.count
            : Array.isArray(studentsData)
              ? studentsData.length
              : (studentsData?.results?.length ?? 0)
        );
        setTeachersCount(
          typeof teachersData?.count === 'number'
            ? teachersData.count
            : Array.isArray(teachersData)
              ? teachersData.length
              : (teachersData?.results?.length ?? 0)
        );
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const stats = overview ? [
    {
      icon: 'monthly-profit',
      label: 'Monthly Profit',
      value: `${overview.monthly_profit ?? 0} DZD`,
      percentage: `${overview.monthly_profit_percentage ?? 0}%`,
      iconSize: 40
    },
    {
      icon: 'students',
      label: 'Total Students',
      value: studentsCount !== null ? studentsCount : (overview.number_of_students ?? 0),
      percentage: `${overview.students_percentage ?? 0}%`
    },
    {
      icon: 'teachers',
      label: 'Total Teachers',
      value: teachersCount !== null ? teachersCount : (overview.number_of_teachers ?? 0),
      percentage: `${overview.teachers_percentage ?? 0}%`
    },
    {
      icon: 'total_parents',
      label: 'Total Parents',
      value: overview.number_of_parents ?? 0,
      percentage: `${overview.parents_percentage ?? 0}%`
    },
  ] : [];

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        {stats.map((stat) => (
          <DashboardCard key={stat.icon} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsContainer}>
        {classesRanking && (
          <Chart
            type="bar"
            data={classesRanking}
            title="Classes Ranking"
            seeDetailsUrl="/dashboard/classes"
          />
        )}
        {studentsEvolvement && (
          <Chart
            type="line"
            data={studentsEvolvement}
            title="Students Evolvement"
            seeDetailsUrl="/dashboard/students"
          />
        )}
      </div>

      {/* Teacher Ranking and Sessions */}
      <div className={styles.bottomSection}>
        <div>
          <RankingList
            title="Teachers Ranking"
            icon="/icons/teachers_ranking.svg"
            teachers={teachersRanking || []}
          />
        </div>
        <div>
          <RemainingWeeklySessions
            title="Remaining weekly sessions"
            icon="/icons/remaining_weekly_sessions.svg"
            sessions={weeklySessions?.sessions || []}
            remainingSessionsCount={weeklySessions?.remainingSessionsCount ?? 0}
            remainingSessionsHours={weeklySessions?.remainingSessionsHours ?? 0}
            remainingSessionsDays={weeklySessions?.remainingSessionsDays ?? 0}
          />
        </div>
      </div>
    </>
  );
}
