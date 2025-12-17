"use client";
import Link from "next/link";
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import styles from "../login/login.module.css";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/auth";

export default function RegisterPage() {
  // Step 1: Email/Password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  
  // Step 2: Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  
  // Step 3: Location Info
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Google OAuth
  const [googleToken, setGoogleToken] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);
  
  // UI State
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [hideNewLeft, setHideNewLeft] = useState(false);

  // Navigation
  function handleInformation() {
    setHideNewLeft(true);
    setShowPersonalInfo(false);
  }

  function handleBackToPersonalInfo() {
    setHideNewLeft(false);
    setShowPersonalInfo(true);
  }

  // Step 1: Email/Password Validation
  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
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

    if (password.length < 8) { // changed this from 6 to 8, bcz it should  be compatible with django
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setEmailError("");
    setShowPersonalInfo(true);
  };

  // Step 2: Personal Info Validation
  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !displayName || !username) {
      setError("All fields are required");
      return;
    }

    handleInformation();
  };

  // Step 3: Final Registration (Regular)
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!wilaya || !commune || !zipCode || !street) {
      setError("All location fields are required");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username,
        email,
        password1: password,
        password2: verifyPassword,
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        wilaya,
        commune,
        zip_code: zipCode,
        street,
        phone_number: phoneNumber
      };

      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens (use both keys for consistency)
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('authToken', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('refreshToken', data.tokens.refresh);
        localStorage.setItem('school_name', data.school_name);
        localStorage.setItem('user_role', 'admin');

        // Show success message with school_name
        alert(`Registration successful! Your school login ID is: ${data.school_name}\n\nPlease save this ID - you'll need it to login.`);
        
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        // Handle validation errors
        const errorMessage = Object.entries(data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        setError(errorMessage || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    
    // Store Google token and proceed to personal info
    setGoogleToken(credentialResponse.credential);
    setIsGoogleAuth(true);
    
    // Decode JWT to get email (basic decode, no verification needed for display)
    try {
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      setGoogleEmail(decoded.email);
      setEmail(decoded.email);
      setFirstName(decoded.given_name || "");
      setLastName(decoded.family_name || "");
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
    
    setShowPersonalInfo(true);
  };

  // Google Registration Complete
const handleGoogleFinalSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (!wilaya || !commune || !zipCode || !street) {
    setError("All location fields are required");
    setLoading(false);
    return;
  }

  if (!username || !displayName) {
    setError("Username and school name are required");
    setLoading(false);
    return;
  }

  try {
    const payload = {
      google_access_token: googleToken,
      username,
      display_name: displayName,
      wilaya,
      commune,
      zip_code: zipCode,
      street,
      phone_number: phoneNumber
    };

    const response = await fetch(`${API_URL}/google/register/complete/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });


    // Get raw text to see what we actually received
    const rawText = await response.text();

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse JSON");
      setError(`Server returned invalid response. Check console for details.`);
      setLoading(false);
      return;
    }

    if (response.ok) {
      // Store tokens (use both keys for consistency)
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('authToken', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.setItem('refreshToken', data.tokens.refresh);
      localStorage.setItem('school_name', data.school_name);
      localStorage.setItem('user_role', 'admin');

      alert(`Registration successful! Your school login ID is: ${data.school_name}\n\nPlease save this ID - you'll need it to login.`);
      window.location.href = '/admin/dashboard';
    } else {
      const errorMessage = Object.entries(data)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');
      setError(errorMessage || 'Registration failed');
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
        {/* Step 1: Email/Password (Left Side) */}
        <div className={`${styles.leftSide} ${showPersonalInfo ? styles.hideOnMobile : ""} ${hideNewLeft ? styles.hideOnMobile : ""}`}>
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

            {!isGoogleAuth ? (
              <form className={styles.form} onSubmit={handleEmailPasswordSubmit}>
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

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google authentication failed')}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    text="signup_with"
                  />
                </div>

                <p>
                  Already have an account? <Link href="/login">Login</Link>
                </p>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ marginBottom: '1rem' }}>✓ Google authentication successful</p>
                <p style={{ color: '#666' }}>Email: {googleEmail}</p>
                <p style={{ marginTop: '2rem' }}>Click "Continue" to proceed →</p>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Personal Information (Right Side) */}
        <div className={`${styles.rightSide} ${showPersonalInfo ? styles.showOnMobile : ""} ${hideNewLeft ? styles.hideOnMobile : ""}`}>
          <div className={styles.backButton} onClick={() => { setShowPersonalInfo(false); setHideNewLeft(false); }}>
            <img src="/icons/arrow-left.svg" alt="arrow-left" />
          </div>

          <div className={styles.logo}>
            <img src="/images/logo.png" alt="register-right" />
          </div>
          
          <div className={styles.loginForm}>
            <h1 className={styles.title}>Personal Information</h1>
            <h3 className={styles.subtitle}>Complete your profile</h3>

            <form className={styles.form} onSubmit={handlePersonalInfoSubmit}>
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
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
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
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldHolder}>
                <div className={styles.label}>
                  <img src="/icons/mortarboard-fill.svg" alt="school-name" />
                  <label htmlFor="schoolName">School Display Name</label>
                </div>
                <input 
                  type="text" 
                  id="schoolName" 
                  placeholder="e.g., École Primaire Alger" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                  This is how your school will appear. A unique login ID will be generated.
                </small>
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit">Continue</button>
            </form>
          </div>
        </div>

        <div className={`${styles.black} ${showPersonalInfo ? styles.moveLeft : ""}`}></div>

        {/* Step 3: Location Information (New Left) */}
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

            <form className={styles.form} onSubmit={isGoogleAuth ? handleGoogleFinalSubmit : handleFinalSubmit}>
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
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    required
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
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    required
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
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
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
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldHolder}>
                <div className={styles.label}>
                  <img src="/icons/envelope.svg" alt="phone" />
                  <label htmlFor="phoneNumber">Phone Number (Optional)</label>
                </div>
                <input 
                  type="text" 
                  id="phoneNumber" 
                  placeholder="+213 555 123 456" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}