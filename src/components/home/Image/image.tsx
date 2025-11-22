import styles from './image.module.css';

export default function Image() {
  return (
    <section className={styles.container}>
        <div className={styles.image}>
        <div className={styles.imageContainer}>
            <img src="/images/Dashboard.png" alt="Hero"  />
        </div>
            <div className={styles.blueShadow}></div>
            <div className={styles.purpleShadow}></div>
            <div className={styles.whiteShadow}></div>

        </div>
       
    </section>
  );
}
