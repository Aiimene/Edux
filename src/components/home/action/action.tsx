import styles from './action.module.css';
import styles2 from '../service/service.module.css';
export default function Action() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
          <div className={styles.ceil}>
            <div className={styles.ceilHeader}></div>
          </div>

        <div className={styles.header}>
          <h1 className={styles2.title}>رحلتك معنا خطوة بخطوة</h1>
          <p className={styles2.subtitle}>
            من تسجيل مؤسستك إلى متابعة حضور طلابك في لوحة تحكم واحدة، اتبع هذه الخطوات البسيطة للانطلاق مع المنصة.
          </p>
          <button className={styles.button}>
        ابدأ التجربة 
        </button>
        </div>
       
      </div>
      
    </div>
  );
}

