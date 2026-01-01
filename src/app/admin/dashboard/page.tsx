'use client';

import { useEffect, useState } from 'react';
import DashboardCard from '../../../components/dashboard/DashboardCard/DashboardCard';
import Chart from '../../../components/dashboard/Chart/Chart';
import RankingList from '../../../components/dashboard/RankingList/RankingList';
import RemainingWeeklySessions from '../../../components/dashboard/RemainingWeeklySessions/RemainingWeeklySession';
import {
  getDashboardOverview,
  getClassesRanking,
  getStudentsEvolvement,
  getTeachersRanking,
  getWeeklySessions,
} from '../../../lib/api/dashboard';
import styles from './page.module.css';

interface DashboardData {
  overview: any;
  classesRanking: any;
  studentsEvolvement: any;
  teachersRanking: any;
  weeklySessions: any;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = now.getFullYear();

        // Default months for charts (last 6 months)
        const defaultMonths = [1, 2, 3, 4, 5, 6];

        // Fetch all dashboard data in parallel
        const [overview, classesRanking, studentsEvolvement, teachersRanking, weeklySessions] = await Promise.all([
          getDashboardOverview(currentMonth, currentYear),
          getClassesRanking(defaultMonths, currentYear),
          getStudentsEvolvement(defaultMonths, currentYear),
          getTeachersRanking(currentMonth, currentYear),
          getWeeklySessions(),
        ]);

        setData({
          overview,
          classesRanking,
          studentsEvolvement,
          teachersRanking,
          weeklySessions,
        });
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading dashboard data...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#e74c3c', fontSize: '1.1rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Transform overview data to stats cards
  const stats = [
    {
      icon: 'monthly-profit',
      label: 'Monthly Profit',
      value: `${data.overview.monthly_profit.toLocaleString()}DZD`,
      percentage: `${data.overview.monthly_profit_percentage}%`,
      iconSize: 40,
    },
    {
      icon: 'students',
      label: 'Total Students',
      value: data.overview.students,
      percentage: `${data.overview.students_percentage}%`,
    },
    {
      icon: 'teachers',
      label: 'Total Teachers',
      value: data.overview.teachers,
      percentage: `${data.overview.teachers_percentage}%`,
    },
    {
      icon: 'total_parents',
      label: 'Total Parents',
      value: data.overview.parents,
      percentage: `${data.overview.parents_percentage}%`,
    },
  ];

  // Transform classes ranking data for Chart component
  const classesRankingChartData = {
    labels: data.classesRanking.months,
    datasets: [
      {
        label: 'Students',
        data: data.classesRanking.highest_students_per_class,
      },
    ],
  };

  // Transform students evolvement data for Chart component
  const studentsEvolvementChartData = {
    labels: data.studentsEvolvement.months,
    datasets: [
      {
        label: 'Evolvement 1',
        data: data.studentsEvolvement.students_per_month,
      },
    ],
  };

  // Transform teachers ranking data
  const teachersRankingData = data.teachersRanking.teachers.map((teacher: any) => ({
    name: teacher.name,
    sessions: teacher.sessions,
    percentage: teacher.students_increase_percentage,
  }));

  // Transform weekly sessions data
  const weeklySessionsData = data.weeklySessions.sessions || [];
  const formattedSessions = weeklySessionsData.map((session: any) => ({
    Module: session.module || session.Module || session.name || 'N/A',
    teacher: session.teacher || 'N/A',
    students: session.students || 0,
    date: session.date || session.Date || new Date().toISOString(),
    time: session.time || session.Time || 'N/A',
  }));

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
        <Chart
          type="bar"
          data={classesRankingChartData}
          title="Classes Ranking"
          seeDetailsUrl="/dashboard/classes"
        />
        <Chart
          type="line"
          data={studentsEvolvementChartData}
          title="Students Evolvement"
          seeDetailsUrl="/dashboard/students"
        />
      </div>

      {/* Teacher Ranking and Sessions */}
      <div className={styles.bottomSection}>
        <div>
          <RankingList
            title="Teachers Ranking"
            icon="/icons/teachers_ranking.svg"
            teachers={teachersRankingData}
          />
        </div>
        <div>
          <RemainingWeeklySessions
            title="Remaining weekly sessions"
            icon="/icons/remaining_weekly_sessions.svg"
            sessions={formattedSessions}
            remainingSessionsCount={data.weeklySessions.remainingSessionsCount || 0}
            remainingSessionsHours={data.weeklySessions.remainingSessionsHours || 0}
            remainingSessionsDays={data.weeklySessions.remainingSessionsDays || 0}
          />
        </div>
      </div>
    </>
  );
}
