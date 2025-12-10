"use client";
import Link from "next/link";
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import styles from "./login.module.css";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/auth";

// Helper function to get redirect URL based on role
const getRedirectUrl = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
    case 'teacher':
      return '/admin/dashboard';
    case 'parent':
      return '/parent/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/dashboard';
  }
};

export default function LoginPage() {
  const [schoolName, setSchoolName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Regular login handler
  const handleRegularLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!schoolName.trim()) {
      setError("School name is required");
      setLoading(false);
      return;
    }

    if (!identifier.trim()) {
      setError("Username or email is required");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: schoolName,
          identifier,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('school_name', data.workspace.name);
        
        // Redirect based on role
        const redirectUrl = getRedirectUrl(data.role);
        window.location.href = redirectUrl;
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google login handler
  // Google login handler
const handleGoogleLogin = async (credentialResponse: any) => {
  setError("");
  setLoading(true);

  if (!schoolName.trim()) {
    setError("Please enter your school name first");
    setLoading(false);
    return;
  }

  try {

    const response = await fetch(`${API_URL}/google/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: credentialResponse.credential,
        school_name: schoolName
      })
    });


    // Get raw text first
    const rawText = await response.text();


    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      setError(`Server returned invalid response. Check console.`);
      setLoading(false);
      return;
    }

    if (response.ok) {
      // Store tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('school_name', data.workspace.name);
      
      // Redirect based on role
      const redirectUrl = getRedirectUrl(data.role);
      window.location.href = redirectUrl;
    } else {
      setError(data.error || 'Google login failed');
    }
  } catch (err) {
    console.error("Network error:", err);
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
            <h3 className={styles.subtitle}>Login to your account</h3>

            {error && (
              <div className={styles.error} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleRegularLogin} className={styles.form}>
              <div className={styles.fieldHolder}>
                <div className={styles.label}>
                  <img src="/icons/mortarboard-fill.svg" alt="school" />
                  <label htmlFor="schoolName">School Name</label>
                </div>
                <input
                  type="text"
                  id="schoolName"
                  placeholder="e.g., ecole-primaire-alger"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldHolder}>
                <div className={styles.label}>
                  <img src="/icons/envelope.svg" alt="user" />
                  <label htmlFor="identifier">Username or Email</label>
                </div>
                <input
                  type="text"
                  id="identifier"
                  placeholder="Username or Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
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
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className={styles.divider}>
                <div className={styles.dividerLine}></div>
                <span className={styles.dividerText}>Or login with</span>
                <div className={styles.dividerLine}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError('Google login failed')}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  width="100%"
                />
              </div>

              <p>
                Don't have an account? <Link href="/signup">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
        <div className={styles.rightSide}></div>
      </div>
    </GoogleOAuthProvider>
  );
}