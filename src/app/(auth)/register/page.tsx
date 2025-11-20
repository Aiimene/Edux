"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "../login/login.module.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [hideNewLeft, setHideNewLeft] = useState(false);
  function handleInformation(){
    setHideNewLeft(true); 
    setShowPersonalInfo(false);
  }

  function handleBackToPersonalInfo(){
    setHideNewLeft(true);
    setShowPersonalInfo(true);
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setEmailError("");
    setError("");
    if (!email || email.length === 0) {
      setEmailError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!password || password.length === 0) {
      setError("Password is required");
      return;
    }

    // Check minimum password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Check if passwords match
    if (password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    // If validation passes, clear error and move black block
    setError("");
    setEmailError("");
    setShowPersonalInfo(true);
    console.log("Registration successful:", { email, password });
    // Add your registration logic here
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSide}>
        <div className={styles.backButton}>
          <Link href="/">
            <img src="/icons/arrow-left.svg" alt="arrow-left" />
          </Link>
        </div>

        <div className={styles.logo}>
          <img src="/images/logo.png" alt="register-left" />
        </div>
        <div className={styles.loginForm}>
          <h1 className={styles.title}>Register</h1>
          <h3 className={styles.subtitle}>Create your account</h3>

          <form action="" className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldHolder}>
              <div className={styles.label}>
                <img src="/icons/envelope.svg" alt="email" />
                <label htmlFor="email">Email</label>
              </div>
              <input 
                type="email" 
                id="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className={styles.error}>{emailError}</p>}
            </div>

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

            <button type="submit">Sign Up</button>

            <div className={styles.divider}>
              <div className={styles.dividerLine}></div>
              <span className={styles.dividerText}>Or register with</span>
              <div className={styles.dividerLine}></div>
            </div>

            <button type="button" className={styles.googleButton}>
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with google</span>
            </button>

            <p>
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.backButton} onClick={() => { setShowPersonalInfo(false); setHideNewLeft(false); }}>
          <img src="/icons/arrow-left.svg" alt="arrow-left" />
        </div>

        <div className={styles.logo}>
          <img src="/images/logo.png" alt="register-right" />
        </div>
        <div className={styles.loginForm}>
          <h1 className={styles.title}>Personal Information</h1>
          <h3 className={styles.subtitle}>Complete your profile</h3>

          <form action="" className={styles.form} onSubmit={(e) => { e.preventDefault(); handleInformation()}}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div className={styles.fieldHolder} style={{ flex: 1 }}>
                <div className={styles.label}>
                  <img src="/icons/envelope.svg" alt="first-name" />
                  <label htmlFor="firstName">First Name</label>
                </div>
                <input 
                  type="text" 
                  id="firstName" 
                  placeholder="First Name" 
                />
              </div>

              <div className={styles.fieldHolder} style={{ flex: 1 }}>
                <div className={styles.label}>
                  <img src="/icons/envelope.svg" alt="last-name" />
                  <label htmlFor="lastName">Last Name</label>
                </div>
                <input 
                  type="text" 
                  id="lastName" 
                  placeholder="Last Name" 
                />
              </div>
            </div>

            <div className={styles.fieldHolder}>
              <div className={styles.label}>
                <img src="/icons/mortarboard-fill.svg" alt="school-name" />
                <label htmlFor="schoolName">School Name</label>
              </div>
              <input 
                type="text" 
                id="schoolName" 
                placeholder="School Name" 
              />
            </div>

            <div className={styles.fieldHolder}>
              <div className={styles.label}>
                <img src="/icons/envelope.svg" alt="username" />
                <label htmlFor="username">Username</label>
              </div>
              <input 
                type="text" 
                id="username" 
                placeholder="Username" 
              />
            </div>

            <button type="submit">Continue</button>
          </form>
        </div>
      </div>

      <div className={`${styles.black} ${showPersonalInfo ? styles.moveLeft : ""} `}>
      </div>


      <div className={`${styles.newleft} ${hideNewLeft ? styles.none : ""}`}>
        <div className={styles.backButton} onClick={handleBackToPersonalInfo}>
          <img src="/icons/arrow-left.svg" alt="arrow-left" />
        </div>

        <div className={styles.logo}>
          <img src="/images/logo.png" alt="location-left" />
        </div>
        <div className={styles.loginForm}>
          <h1 className={styles.title}>Location Information</h1>
          <h3 className={styles.subtitle}>Complete your address</h3>

          <form action="" className={styles.form}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div className={styles.fieldHolder} style={{ flex: 1 }}>
                <div className={styles.label}>
                  <img src="/icons/envelope.svg" alt="wilaya" />
                  <label htmlFor="wilaya">Wilaya</label>
                </div>
                <input 
                  type="text" 
                  id="wilaya" 
                  placeholder="Wilaya" 
                />
              </div>

              <div className={styles.fieldHolder} style={{ flex: 1 }}>
                <div className={styles.label}>
                  <img src="/icons/envelope.svg" alt="commune" />
                  <label htmlFor="commune">Commune</label>
                </div>
                <input 
                  type="text" 
                  id="commune" 
                  placeholder="Commune" 
                />
              </div>
            </div>

            <div className={styles.fieldHolder}>
              <div className={styles.label}>
                <img src="/icons/envelope.svg" alt="zip-code" />
                <label htmlFor="zipCode">Zip Code</label>
              </div>
              <input 
                type="text" 
                id="zipCode" 
                placeholder="Zip Code" 
              />
            </div>

            <div className={styles.fieldHolder}>
              <div className={styles.label}>
                <img src="/icons/envelope.svg" alt="street" />
                <label htmlFor="street">Street</label>
              </div>
              <input 
                type="text" 
                id="street" 
                placeholder="Street" 
              />
            </div>

            <button type="submit">Continue</button>
          </form>
        </div>
      </div>
    </div>
  );
}
