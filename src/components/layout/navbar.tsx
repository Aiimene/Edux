"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Divide as Hamburger } from 'hamburger-react';
import styles from './navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        
        <div className={styles.mobileMenuButton}>
          <Hamburger toggled={isMenuOpen} toggle={setIsMenuOpen} />
        </div>
        
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <li>
            <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>الرئيسية</Link>
          </li>
          <li>
            <Link href="/services" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>الخدمات</Link>
          </li>
          <li>
            <Link href="/pricing" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>الأسعار</Link>
          </li>
          <li>
            <Link href="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>تواصل معنا</Link>
          </li>
        </ul>

        <div className={`${styles.actions} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link href="/login" className={styles.signUpButton} onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
          <Link href="/register" className={styles.loginLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
        </div>
      </div>
    </nav>
  );
}

