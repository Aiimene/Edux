import { authService } from './api/auth.service';


 //Clear all authentication data from localStorage

export const clearAuthData = () => {
  localStorage.removeItem('user_role');
  localStorage.removeItem('school_name');
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('workspace_display_name');
  localStorage.removeItem('user_data');
};


 //Logout user - clears cookies and localStorage

export const logout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthData();
    window.location.href = '/login';
  }
};


export const logoutAll = async () => {
  try {
    await authService.logoutAll();
  } catch (error) {
    console.error('Logout all error:', error);
  } finally {
    clearAuthData();
    window.location.href = '/login';
  }
};


export const getUserData = () => {
  const userDataStr = localStorage.getItem('user_data');
  if (userDataStr) {
    try {
      return JSON.parse(userDataStr);
    } catch {
      return null;
    }
  }
  return null;
};


export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('user_role');
};


export const getUserRole = (): string | null => {
  return localStorage.getItem('user_role');
};

export const getSchoolName = (): string | null => {
  return localStorage.getItem('school_name');
};


export const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'parent':
      return '/parent/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/dashboard';
  }
};