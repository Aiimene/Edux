import DashboardCard from '../../../components/dashboard/DashboardCard';
import Chart from '../../../components/dashboard/Chart';
import RankingList from '../../../components/dashboard/RankingList';
import RemainingWeeklySessions from '../../../components/dashboard/RemainingWeeklySessions';
import enterpriseData from '../../../data/enterprise.json';
import styles from './page.module.css';

export default function DashboardPage() {
  const stats = [
    { 
      icon: 'monthly-profit', 
      label: 'Monthly Profit', 
      value: `${enterpriseData["Monthly Profit"]}DZD`, 
      percentage: `${enterpriseData["monthly profit percentage"]}%`,
      iconSize: 40 // Adjust this value to make the icon bigger or smaller
    },
    { 
      icon: 'students', 
      label: 'Total Students', 
      value: enterpriseData["number of students"], 
      percentage: `${enterpriseData["students percentage"]}%` 
    },
    { 
      icon: 'teachers', 
      label: 'Total Teachers', 
      value: enterpriseData["number of teachers"], 
      percentage: `${enterpriseData["teachers percentage"]}%` 
    },
    { 
      icon: 'parents', 
      label: 'Total Parents', 
      value: enterpriseData["number of parents"], 
      percentage: `${enterpriseData["parents percentage"]}%` 
    },
  
  ];

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
          data={enterpriseData.classesRanking}
          title="Classes Ranking"
          seeDetailsUrl="/dashboard/classes"
        />
        <Chart
          type="line"
          data={enterpriseData.studentsEvolvement}
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
            teachers={enterpriseData.teachersRanking}
          />
        </div>
        <div>
          <RemainingWeeklySessions
            title="Remaining weekly sessions"
            icon="/icons/remaining_weekly_sessions.svg"
            sessions={enterpriseData.weeklySessions}
            remainingSessionsCount={enterpriseData.remainingSessionsCount}
            remainingSessionsHours={enterpriseData.remainingSessionsHours}
            remainingSessionsDays={enterpriseData.remainingSessionsDays}
          />
        </div>
      </div>
    </>
  );
}
