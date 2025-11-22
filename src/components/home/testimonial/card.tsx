import styles from './testimonial.module.css';

export default function Card() {
    return(
        <div className={styles.card}>
            <div className={styles.header2}>
                <img className={styles.avatar} src="/icons/person-circle.svg" alt="testimonial" />
                <div className={styles.nameContainer}>
                    <h1 className={styles.name}>اسم العميل</h1>
                    <p className={styles.job}>المؤسسة التعليمية</p>
                </div>
                
            </div>
            <div className={styles.divider}></div>
            <p className={styles.testimonial}>التعليق التعليقا لتعليقالتعليقالت عليقالت عليقال تعليقnالتعليقتع ليقالتعnليقتnعليقالتعليق التعليقالتعليق</p>
            <div className={styles.quoteContainer}>
                <img  className={styles.quoteIcon} src="/icons/quote.svg" alt="quote" />
            </div>
        </div>
    )
}