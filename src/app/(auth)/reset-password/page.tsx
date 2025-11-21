"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "../login/login.module.css";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");

    if (!password || password.length === 0) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    console.log("Password reset successful");
    // Add your password reset logic here
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSide}>
        <div className={styles.backButton}>
          <Link href="/login">
            <img src="/icons/arrow-left.svg" alt="arrow-left" />
          </Link>
        </div>

        <div className={styles.logo}>
          <img src="/images/logo.png" alt="reset-password" />
        </div>
        <div className={styles.loginForm}>
          <h1 className={styles.title}>Reset Password</h1>
          <h3 className={styles.subtitle}>Enter your new password</h3>

          <form action="" className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldHolder}>
              <div className={styles.label}>
                <img src="/icons/fingerprint.svg" alt="password" />
                <label htmlFor="password">Password</label>
              </div>
              <input 
                type="password" 
                id="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <div className={styles.fieldHolder}>
              <div className={styles.label}>
                <img src="/icons/fingerprint.svg" alt="verify-password" />
                <label htmlFor="verifyPassword">Verify Password</label>
              </div>
              <input 
                type="password" 
                id="verifyPassword" 
                placeholder="Verify Password" 
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)} 
              />
            </div>
            {error && <p className={styles.error} style={{ marginTop: "1rem", color: "red" }}>{error}</p>}

            <button type="submit">Reset Password</button>

            <p>
              Remember your password? <Link href="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
      <div className={styles.rightSide}></div>
    </div>
  );
}

