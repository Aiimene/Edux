import styles from './steps.module.css';
import styles2 from '../service/service.module.css';

export default function Steps() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles2.title}>رحلتك معنا خطوة بخطوة</h1>
        <p className={styles2.subtitle}>
          من تسجيل مؤسستك إلى متابعة حضور طلابك في لوحة تحكم واحدة، اتبع هذه الخطوات البسيطة للانطلاق مع المنصة.
        </p>
      </div>

      <div className={styles.stepsContainer}>
        <div className={styles.stepBox}>
          <div className={styles.stepNumber}>1</div>
          <h3 className={styles.stepTitle}>إنشاء حساب للمؤسسة</h3>
          <p className={styles.stepDescription}>
            سجل بيانات مؤسستك التعليمية وفعّل لوحة التحكم في دقائق.
          </p>
          <div className={styles.connector}></div>
        </div>

        <div className={styles.stepBox}>
          <div className={styles.stepNumber}>2</div>
          <h3 className={styles.stepTitle}>إضافة المعلمين والطلاب</h3>
          <p className={styles.stepDescription}>
            أضف حسابات المعلمين والطلاب، ورتبهم حسب الفصول والمستويات.
          </p>
          <div className={styles.connector}></div>
        </div>

        <div className={styles.stepBox}>
          <div className={styles.stepNumber}>3</div>
          <h3 className={styles.stepTitle}>متابعة الحضور والتقارير</h3>
          <p className={styles.stepDescription}>
            راقب الحضور والأداء في الوقت الحقيقي مع تقارير جاهزة.
          </p>
        </div>
      </div>
    </section>
  );
}


