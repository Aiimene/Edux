import styles from './footer.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.container}>
      
      <div className={styles.content}>
      <div className={styles.divider}></div>
        <div className={styles.contentContainer}>
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <img 
              src="/images/logo.png" 
              alt="Edux Logo" 
              className={styles.logo}
            />
          </div>
          <p className={styles.tagline}>Education Tracking & Attendance System</p>
        </div>
        
        <div className={styles.linksSection}>
          <div className={styles.linksColumn}>
            <h3 className={styles.linksTitle}>روابط سريعة</h3>
            <ul className={styles.linksList}>
              <li><Link href="/">الرئيسية</Link></li>
              <li><Link href="/#services">الخدمات</Link></li>
              <li><Link href="/#how-it-works">كيف تعمل المنصة</Link></li>
              <li><Link href="/#pricing">الأسعار</Link></li>
              <li><Link href="/#experience">تجربة المنصة</Link></li>
            </ul>
          </div>
          
          <div className={styles.linksColumn}>
            <h3 className={styles.linksTitle}>روابط سريعة</h3>
            <ul className={styles.linksList}>
              <li><Link href="/">الرئيسية</Link></li>
              <li><Link href="/#services">الخدمات</Link></li>
              <li><Link href="/#how-it-works">كيف تعمل المنصة</Link></li>
              <li><Link href="/#pricing">الأسعار</Link></li>
              <li><Link href="/confidentiality">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          
          <div className={styles.linksColumn}>
            <h3 className={styles.linksTitle}>روابط سريعة</h3>
            <ul className={styles.linksList}>
              <li><Link href="/">الرئيسية</Link></li>
              <li><Link href="/#services">الخدمات</Link></li>
              <li><Link href="/#how-it-works">كيف تعمل المنصة</Link></li>
              <li><Link href="/#pricing">الأسعار</Link></li>
              <li><Link href="/#experience">تجربة المنصة</Link></li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}

