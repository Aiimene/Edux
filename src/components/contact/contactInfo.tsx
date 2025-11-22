import Image from 'next/image';
import styles from './contactInfo.module.css';

export default function ContactInfo() {
  return (
    <div className={styles.infoContainer}>
      <div className={styles.infoCard}>
        <div className={styles.headerRow}>
          <Image 
            src="/icons/envelope.svg" 
            alt="Email" 
            width={24} 
            height={24}
            className={styles.icon}
          />
          <h3 className={styles.title}>البريد الإلكتروني</h3>
        </div>
        <div className={styles.divider}></div>
        <p className={styles.text}>info@edux.com</p>
        <p className={styles.text}>support@edux.com</p>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.headerRow}>
          <Image 
            src="/icons/telephone-fill.svg" 
            alt="Phone" 
            width={24} 
            height={24}
            className={styles.icon}
          />
          <h3 className={styles.title}>الهاتف</h3>
        </div>
        <div className={styles.divider}></div>
        <p className={styles.text}>+213 555 123 456</p>
        <p className={styles.text}>+213 555 789 012</p>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.headerRow}>
          <Image 
            src="/icons/geo-fill.svg" 
            alt="Location" 
            width={24} 
            height={24}
            className={styles.icon}
          />
          <h3 className={styles.title}>العنوان</h3>
        </div>
        <div className={styles.divider}></div>
        <p className={styles.text}>الجزائر العاصمة</p>
        <p className={styles.text}>الجزائر</p>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.headerRow}>
          <Image 
            src="/icons/stopwatch-fill.svg" 
            alt="Working Hours" 
            width={24} 
            height={24}
            className={styles.icon}
          />
          <h3 className={styles.title}>ساعات العمل</h3>
        </div>
        <div className={styles.divider}></div>
        <p className={styles.text}>الأحد - الخميس: 9:00 - 17:00</p>
        <p className={styles.text}>الجمعة - السبت: مغلق</p>
      </div>
    </div>
  );
}

