"use client";
import Link from 'next/link';
import Image from 'next/image';
import styles from './navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image 
              src="/images/logo.png" 
              alt="Edux Logo" 
              width={120} 
              height={40}
              priority
            />
          </Link>
        </div>
        
        <ul className={styles.navLinks}>
          <li>
            <Link href="/" className={styles.navLink}>الرئيسية</Link>
          </li>
          <li>
            <Link href="/services" className={styles.navLink}>الخدمات</Link>
          </li>
          <li>
            <Link href="/pricing" className={styles.navLink}>الأسعار</Link>
          </li>
          <li>
            <Link href="/contact" className={styles.navLink}>تواصل معنا</Link>
          </li>
        </ul>

        <div className={styles.actions}>
          <Link href="/login" className={styles.signUpButton}>Sign Up</Link>
          <Link href="/register" className={styles.loginLink}>Login</Link>
        </div>
      </div>
    </nav>
  );
}

