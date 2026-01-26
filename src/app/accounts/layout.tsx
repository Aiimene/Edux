'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth.service';

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated with JWT token
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          // Verify token - any authenticated user can access now
          const profile = await authService.getProfile();
          if (profile && profile.user) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        // Not authenticated
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For admin login, we need to try with a default workspace or find the user's workspace
      // Since the backend requires school_name, we'll use the username as a fallback
      const response = await authService.login({
        school_name: username, // Use username as school_name for admin login
        identifier: username,
        password: password,
      });

      // Store tokens if provided
      if ((response as any).access_token) {
        localStorage.setItem('access_token', (response as any).access_token);
      }
      if ((response as any).refresh_token) {
        localStorage.setItem('refresh_token', (response as any).refresh_token);
      }

      // Wait a moment for cookies to be set, then verify authentication
      await new Promise(resolve => setTimeout(resolve, 100));
      const profile = await authService.getProfile();
      if (profile && profile.user) {
        setIsAuthenticated(true);
      } else {
        setError('Authentication failed. Please check your credentials.');
        // Clear tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore logout errors
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    router.push('/accounts');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(166, 228, 251, 0.1) 0%, rgba(30, 125, 189, 0.2) 100%)',
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px',
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              />
            </div>
            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: isLoading ? '#ccc' : '#a6e4fb',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = '#8dd4f0')}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = '#a6e4fb')}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        background: '#f8f9fa',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e1e7f0',
      }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Account Management Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}


