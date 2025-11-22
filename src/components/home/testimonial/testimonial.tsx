import styles from './testimonial.module.css';
import styles2 from '../service/service.module.css';
import Card from './card';

export default function Testimonial() {
  return (
    <div className={styles.container}>
                <div className={styles.header}>
        <h1 className={styles2.title}>  ماذا يقول عملاؤنا؟ </h1>
        <p className={styles2.subtitle}>
        مؤسسات تعليمية اعتمدت منصّتنا لتحسين إدارة الحضور والأداء.
        </p>
      </div>
        <div className={styles.content}>

      <div className={styles.cardsContainer}>
        <div className={styles.leftGradient + ' ' + styles.shadowBox}></div>
        <div className={styles.rightGradient + ' ' + styles.shadowBox  }></div>
        <div className={styles.cardsRow1 + ' ' + styles.cardsRowWrapper}>
          <div className={styles.cardsTrack}>
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
        <div className={styles.cardsRow2 + ' ' + styles.cardsRowWrapper}>
          <div className={styles.cardsTrack + ' ' + styles.cardsTrackReverse}>
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </div>
        </div>
    </div>
  );
}