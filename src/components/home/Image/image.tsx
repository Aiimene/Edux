import styles from './image.module.css';

export default function Image() {
  return (
    <section className={styles.container}>
        <div className={styles.image}>
        <div className={styles.imageContainer}>
            <img src="/images/Dashboard.png" alt="Hero" width={1000} height={1000} />
        </div>
            <div className={styles.blueShadow}></div>
            <div className={styles.purpleShadow}></div>
            <div className={styles.whiteShadow}></div>

        </div>
       
    </section>
  );
}
