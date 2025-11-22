"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Divide as Hamburger } from 'hamburger-react';
import styles from './navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMenuOpen(false);
    
    if (href.startsWith('/#')) {
      const targetId = href.substring(2);
      
      // If we're on the home page, scroll smoothly
      if (window.location.pathname === '/') {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for navbar height
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
      // If we're on another page, let Next.js handle navigation
      // The smooth scroll will work after navigation due to globals.css
    }
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
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
            <Link href="/#hero" className={styles.navLink} onClick={(e) => handleLinkClick(e, '/#hero')}>الرئيسية</Link>
          </li>
          <li>
            <Link href="/#services" className={styles.navLink} onClick={(e) => handleLinkClick(e, '/#services')}>الخدمات</Link>
          </li>
          <li>
            <Link href="/#pricing" className={styles.navLink} onClick={(e) => handleLinkClick(e, '/#pricing')}>الأسعار</Link>
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

