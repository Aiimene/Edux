import styles from './service.module.css';

export default function Service() {
  return (
    <section className={styles.container}>
        <div className={styles.serviceContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>خدمات منصتنا</h1>  
                <p className={styles.subtitle}>كل ما تحتاجه إدارة المؤسسة التعليمية في مكان واحد</p>
            </div>
            <div className={styles.servicesGrid}>
                <div className={`${styles.serviceBox} ${styles.notificationsBox}`}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src="/icons/bell.png" alt="Notifications Icon" />
                        <h2 className={styles.iconTitle}>تنبيهات ورسائل فورية</h2>
                    </div>
                    <h3 className={styles.serviceTitle}>تنبيهات ورسائل فورية</h3>
                </div>
                <div className={`${styles.serviceBox} ${styles.attendanceBox}`}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src="/icons/brain.png" alt="Attendance Management Icon" />
                        <h2 className={styles.iconTitle}>إدارة الحضور الذكية</h2>
                    </div>
                    <h3 className={styles.serviceTitle}>إدارة الحضور الذكية</h3>
                </div>
                <div className={`${styles.serviceBox} ${styles.reportsBox}`}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src="/icons/graph.png" alt="Reports Icon" />
                        <h2 className={styles.iconTitle}>تقارير ولوحات تحكم فورية</h2>
                    </div>
                    <h3 className={styles.serviceTitle}>تقارير ولوحات تحكم فورية</h3>
                </div>
                <div className={`${styles.serviceBox} ${styles.permissionsBox}`}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src="/icons/configuration.png" alt="Permissions Icon" />
                        <h2 className={styles.iconTitle}>صلاحيات مختلفة للمستخدمين</h2>
                    </div>
                    <h3 className={styles.serviceTitle}>صلاحيات مختلفة للمستخدمين</h3>
                </div>
            </div>
        </div>
    </section>
  );
}
