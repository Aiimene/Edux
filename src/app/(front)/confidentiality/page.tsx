import Footer from '@/components/layout/footer/footer';
import styles from './confidentiality.module.css';

export default function Confidentiality() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content} dir="rtl">
          <h1 className={styles.title}>سياسة الخصوصية والسرية</h1>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. مقدمة</h2>
            <p className={styles.paragraph}>
              نحن ملتزمون بحماية خصوصيتك وسرية معلوماتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصة Edux.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. المعلومات التي نجمعها</h2>
            <p className={styles.paragraph}>
              نجمع أنواعًا مختلفة من المعلومات لتوفير وتحسين خدماتنا. قد تشمل هذه المعلومات:
            </p>
            <ul className={styles.list}>
              <li>المعلومات الشخصية مثل الاسم وعنوان البريد الإلكتروني ورقم الهاتف</li>
              <li>معلومات المؤسسة التعليمية مثل اسم المدرسة وعدد الطلاب</li>
              <li>معلومات الحضور والغياب للطلاب</li>
              <li>معلومات الاستخدام مثل عنوان IP ونوع المتصفح</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. كيفية استخدام المعلومات</h2>
            <p className={styles.paragraph}>
              نستخدم المعلومات التي نجمعها لـ:
            </p>
            <ul className={styles.list}>
              <li>توفير وصيانة وتحسين خدماتنا</li>
              <li>إدارة حسابات المستخدمين والمؤسسات التعليمية</li>
              <li>تتبع حضور الطلاب وإنشاء التقارير</li>
              <li>التواصل معك بشأن خدماتنا والتحديثات</li>
              <li>ضمان أمان منصتنا ومنع الاحتيال</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. حماية المعلومات</h2>
            <p className={styles.paragraph}>
              نطبق تدابير أمنية تقنية وإدارية صارمة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. نستخدم التشفير وبروتوكولات الأمان الحديثة لضمان سرية بياناتك.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. مشاركة المعلومات</h2>
            <p className={styles.paragraph}>
              لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط في الحالات التالية:
            </p>
            <ul className={styles.list}>
              <li>عند الحصول على موافقتك الصريحة</li>
              <li>للمتطلبات القانونية أو عند استدعاء قضائي</li>
              <li>مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل منصتنا</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. حقوقك</h2>
            <p className={styles.paragraph}>
              لديك الحق في:
            </p>
            <ul className={styles.list}>
              <li>الوصول إلى معلوماتك الشخصية التي نحتفظ بها</li>
              <li>طلب تصحيح أو تحديث معلوماتك</li>
              <li>طلب حذف معلوماتك الشخصية</li>
              <li>الاعتراض على معالجة معلوماتك</li>
              <li>طلب نقل بياناتك إلى خدمة أخرى</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. التغييرات على سياسة الخصوصية</h2>
            <p className={styles.paragraph}>
              قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات من خلال نشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث" في الأسفل.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. الاتصال بنا</h2>
            <p className={styles.paragraph}>
              إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا عبر:
            </p>
            <p className={styles.paragraph}>
              البريد الإلكتروني: privacy@edux.com<br />
              الهاتف: +213 555 123 456
            </p>
          </div>

          <div className={styles.footerNote}>
            <p>آخر تحديث: {new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

