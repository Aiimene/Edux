import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form}>
          <input type="email" placeholder="Email" className={styles.input} />
          <input type="password" placeholder="Password" className={styles.input} />
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <p className={styles.linkText}>
          Don't have an account? <Link href="/register" className={styles.link}>Sign Up</Link>
        </p>
        <Link href="/" className={styles.backLink}>Back to Home</Link>
      </div>
    </div>
  );
}

