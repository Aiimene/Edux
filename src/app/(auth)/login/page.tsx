"use client";
import Link from "next/link";
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { authService, type LoginData, type GoogleLoginData } from "@/lib/api/auth.service";
import styles from "./login.module.css";
import { getRoleBasedRedirect } from "@/lib/authUtils";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function LoginPage() {
  // Check if Google Client ID is configured
  if (!GOOGLE_CLIENT_ID) {
    console.error("Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.");
  }
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

    // Validation
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
      // Use authService instead of direct fetch
      const loginData: LoginData = {
        school_name: schoolName,
        identifier,
        password
      };

      const response = await authService.login(loginData);

      // Store JWT token if provided in response (some backends return tokens)
      // Tokens are also automatically stored in HTTP-only cookies
      if ((response as any).access_token) {
        localStorage.setItem('access_token', (response as any).access_token);
      }
      if ((response as any).refresh_token) {
        localStorage.setItem('refresh_token', (response as any).refresh_token);
      }
      if ((response as any).token) {
        localStorage.setItem('token', (response as any).token);
      }

      // Store user metadata
      localStorage.setItem('user_role', response.role || '');
      localStorage.setItem('school_name', response.workspace.name);
      localStorage.setItem('user_id', response.user.id.toString());
      localStorage.setItem('username', response.user.username);
      localStorage.setItem('workspace_display_name', response.workspace.display_name);

      // Optional: Store full user data as JSON
      localStorage.setItem('user_data', JSON.stringify({
        user: response.user,
        role: response.role,
        profile: response.profile,
        workspace: response.workspace
      }));

      // Redirect based on role
      const redirectPath = getRoleBasedRedirect(response.role || '');
      window.location.href = redirectPath;

    } catch (err: any) {
      // authService already formatted the error
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setError("");
    setLoading(true);

    if (!schoolName.trim()) {
      setError("Please enter your school name first");
      setLoading(false);
      return;
    }

    try {
      const googleData: GoogleLoginData = {
        access_token: credentialResponse.credential,
        school_name: schoolName
      };

      const response = await authService.googleLogin(googleData);

      // Store user metadata (tokens are in cookies)
      localStorage.setItem('user_role', response.role || '');
      localStorage.setItem('school_name', response.workspace.name);
      localStorage.setItem('user_id', response.user.id.toString());
      localStorage.setItem('username', response.user.username);
      localStorage.setItem('workspace_display_name', response.workspace.display_name);

      localStorage.setItem('user_data', JSON.stringify({
        user: response.user,
        role: response.role,
        profile: response.profile,
        workspace: response.workspace
      }));

      // Redirect based on role
      const redirectPath = getRoleBasedRedirect(response.role || '');
      window.location.href = redirectPath;

    } catch (err: any) {
      setError(err.message || 'Google login failed');
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

              {GOOGLE_CLIENT_ID ? (
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
              ) : (
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffc107', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#856404',
                  width: '100%'
                }}>
                  <p>Google Sign-In is not configured. Please contact the administrator.</p>
                </div>
              )}

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