import styles from './billing.module.css';
import styles2 from '../service/service.module.css';

export default function Billing() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles2.title}>رحلتك معنا خطوة بخطوة</h1>
        <p className={styles2.subtitle}>
          من تسجيل مؤسستك إلى متابعة حضور طلابك في لوحة تحكم واحدة، اتبع هذه الخطوات البسيطة للانطلاق مع المنصة.
        </p>
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardHeaderContainer}>
            <div className={styles.discountTag}>-10%</div>
            
            <div className={styles.cardHeader}>
              <h2 className={styles.planTitle}>خطة البداية</h2>
            </div>
          </div>
          
          <div className={styles.audience}>
            <p className={styles.audienceText}>لمدارس الصغيرة / المراكز بعدد طلاب</p>
            <p className={styles.audienceSubtext}>محدود</p>
          </div>
          
          
          <div className={styles.pricing}>
            <div className={styles.priceContainer}>
              <span className={styles.price}>1,900</span>
              <span className={styles.currency}>دج</span>
            </div>
            <p className={styles.billingPeriod}>شهريا</p>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>حتى 100 طالب</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>إدارة الحضور الأساسي</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>تقارير يومية وبسيطة</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>مستخدم إداري واحد</span>
            </div>
          </div>
          
          <button className={styles.ctaButton}>بدأ مع هذه الخطة</button>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeaderContainer}>
            <div className={styles.discountTag}>-10%</div>
            
            <div className={styles.cardHeader}>
              <h2 className={styles.planTitle}>خطة البداية</h2>
            </div>
          </div>
          
          <div className={styles.audience}>
            <p className={styles.audienceText}>لمدارس الصغيرة / المراكز بعدد طلاب</p>
            <p className={styles.audienceSubtext}>محدود</p>
          </div>
          
          
          <div className={styles.pricing}>
            <div className={styles.priceContainer}>
              <span className={styles.price}>1,900</span>
              <span className={styles.currency}>دج</span>
            </div>
            <p className={styles.billingPeriod}>شهريا</p>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>حتى 100 طالب</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>إدارة الحضور الأساسي</span>
            </div><div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>إدارة الحضور الأساسي</span>
            </div><div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>إدارة الحضور الأساسي</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>تقارير يومية وبسيطة</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>مستخدم إداري واحد</span>
            </div>
          </div>
          
          <button className={styles.ctaButton}>بدأ مع هذه الخطة</button>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeaderContainer}>
            <div className={styles.discountTag}>-10%</div>
            
            <div className={styles.cardHeader}>
              <h2 className={styles.planTitle}>خطة البداية</h2>
            </div>
          </div>
          
          <div className={styles.audience}>
            <p className={styles.audienceText}>لمدارس الصغيرة / المراكز بعدد طلاب</p>
            <p className={styles.audienceSubtext}>محدود</p>
          </div>
          
          
          <div className={styles.pricing}>
            <div className={styles.priceContainer}>
              <span className={styles.price}>1,900</span>
              <span className={styles.currency}>دج</span>
            </div>
            <p className={styles.billingPeriod}>شهريا</p>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>حتى 100 طالب</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>إدارة الحضور الأساسي</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>تقارير يومية وبسيطة</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkmark}></div>
              <span>مستخدم إداري واحد</span>
            </div>
          </div>
          
          <button className={styles.ctaButton}>بدأ مع هذه الخطة</button>
        </div>
      </div>
    </div>
  );
}

