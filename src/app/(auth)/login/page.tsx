"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [regular, setRegular] = useState(true);
  function handleLoginType(type: "regular" | "admin") {
    setRegular(type === "regular");
  }
  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSide}>
        <div className={styles.backButton}>
          <Link href="/">
            <img src="/icons/arrow-left.svg" alt="arrow-left" />
          </Link>
        </div>

        <div className={styles.logo}>
          <img src="/images/logo.png" alt="login-left" />
        </div>
        <div className={styles.loginForm}>
          <h1 className={styles.title}>Welcome Back!</h1>
          <h3 className={styles.subtitle}>la page de login not sign up</h3>

          <div className={styles.loginTypes}>
            <div
              className={`${styles.loginTypeButton} ${regular ? styles.active : ""}`}
              onClick={() => handleLoginType("regular")}
            >
              Regular
            </div>
            <div
              className={`${styles.loginTypeButton} ${regular ?  "" : styles.active}`}
              onClick={() => handleLoginType("admin")}
            >
              Admin
            </div>
            <div className={`${styles.placeholder} ${!regular ? styles.right : ""}`}></div>
          </div>
          <form action="" className={styles.form}>
          <div className={`${styles.fieldHolder} ${regular ? ""  : styles.hidden} `}>
            <div className={styles.label}>
              <img src="/icons/mortarboard-fill.svg" alt="user" />
              <label htmlFor="">Society username</label>
            </div>
            <input type="text" placeholder="Username" />
          </div>
          <div className={`${styles.fieldHolder} ${regular ? ""  : styles.up}`}>
            <div className={styles.label}>
              <img src="/icons/envelope.svg" alt="user" />
              <label htmlFor="">Username/Eamil</label>
            </div>
            <input type="text" placeholder="Username/Email" />
          </div>
          <div className={`${styles.fieldHolder} ${regular ? ""  : styles.up}`}>
            <div className={styles.label}>
              <img src="/icons/fingerprint.svg" alt="user" />
              <label htmlFor="">Password</label>
            </div>
            <input type="password" placeholder="Password" />
          </div>


          <button>Login</button>

          <div className={`${styles.divider}  ${regular ? styles.hidden : ""}`}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>Or login with</span>
            <div className={styles.dividerLine}></div>
          </div>

          <button className={`${styles.googleButton} ${regular ? styles.hidden : ""}`}>
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with google</span>
          </button>

          <p>
            Don't have an account? <Link href="/signup">Sign up</Link>
          </p>
          </form>
        </div>
      </div>
      <div className={styles.rightSide}></div>
    </div>
  );
}
