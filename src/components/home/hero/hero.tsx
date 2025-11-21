import styles from './hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
        <h1 className={styles.title}>
        منصّة ذكية لإدارة الحضور والأداء في
        </h1>
            <h1 className={styles.titleSecondary}>
            مؤسستك التعليمية
            </h1>
            <p className={styles.description}>
            إدارة ذكية للحضور وأداء المعلّمين والفصول من لوحة تحكم واحدة.
            </p>
    </section>
  );
}
