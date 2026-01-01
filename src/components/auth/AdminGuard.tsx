'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth.service';
import { getUserRole } from '@/lib/authUtils';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has a role in localStorage
        const userRole = getUserRole();
        
        // Check if JWT token exists
        const token = localStorage.getItem('access_token');
        
        if (!userRole && !token) {
          router.push('/login');
          return;
        }

        // Verify token with backend (uses cookies or Bearer token from interceptor)
        const tokenResponse = await authService.verifyToken();
        
        if (!tokenResponse.valid) {
          // Token is invalid, clear auth data and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          localStorage.removeItem('user_role');
          router.push('/login');
          return;
        }

        // Get user profile to verify admin role
        const profile = await authService.getProfile();
        
        if (profile.role !== 'admin') {
          // User is not an admin, redirect to login
          router.push('/login');
          return;
        }

        // Store/update user role if not set
        if (!userRole) {
          localStorage.setItem('user_role', profile.role);
        }

        // User is authenticated and is an admin
        setIsAuthorized(true);
      } catch (error: any) {
        console.error('Authentication check failed:', error);
        
        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        
        // On any error, redirect to login
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Verifying authentication...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect, so show nothing
  }

  return <>{children}</>;
}

