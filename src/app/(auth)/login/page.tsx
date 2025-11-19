'use client';
import Link from 'next/link';
import { useState } from 'react';
import styles from './login.module.css';

export default function LoginPage() {
    const [regular , setRegular] = useState(true);
  return(
    <div className={styles.loginContainer}>
        <div className={styles.leftSide}>
            <div className={styles.loginForm}>
                <div className={styles.backButton}>
                    <Link href="/">
                    <img src="/icons/arrow-left.svg" alt="arrow-left" />
                    </Link>
                </div>
                <h1 className={styles.title}>
                    Welcome Back!
                </h1>
                <h3 className={styles.subtitle}>
                la page de login not sign up 
                </h3>

                <div className={styles.loginTypes}>
                    <div className={`${styles.loginTypeButton} ${styles.active}`} onClick={() => setRegular(true)}>
                        Regular
                    </div>
                    <div className={styles.loginTypeButton} onClick={() => setRegular(false)}>
                        Admin
                    </div>
                    <div className={styles.placeholder}>
                    
                    </div>
                </div>

                <div className={styles.fieldHolder}>
                    <div className={styles.label}>
                        <img src="/icons/mortarboard-fill.svg" alt="user" />
                        <label htmlFor="">Society username</label>
                    </div>
                    <input type="text" placeholder='Username' />
                </div>
                <div className={styles.fieldHolder}>
                    <div className={styles.label}>
                        <img src="/icons/envelope.svg" alt="user" />
                        <label htmlFor="">Username/Eamil</label>
                    </div>
                    <input type="text" placeholder='Username/Email' />
                </div>
                <div className={styles.fieldHolder}>
                    <div className={styles.label}>
                        <img src="/icons/fingerprint.svg" alt="user" />
                        <label htmlFor="">Password</label>
                    </div>
                    <input type="password" placeholder='Password' />
                </div>

                <button>Login</button>
                <p>
                    Don't have an account? <Link href="/signup">Sign up</Link>
                </p>

            </div>
        </div>
        <div className={styles.rightSide}>

        </div>

    </div>
  );
}

