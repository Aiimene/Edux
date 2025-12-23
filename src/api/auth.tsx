import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/auth';

// Create axios instance
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests if available
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface RegisterData {
  username: string;
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  display_name: string;
  wilaya: string;
  commune: string;
  zip_code: string;
  street: string;
}

export interface LoginData {
  school_name: string;
  identifier: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  school_name: string;
  display_name: string;
  user: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  workspace: {
    id: number;
    name: string;
    display_name: string;
    wilaya: string;
    commune: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
  instructions?: string;
  role?: string;
  profile?: any;
}

export interface LogoutData {
  refresh: string;
}

// Auth API functions
export const adminRegister = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await authApi.post('/register/', data);
  return response.data;
};

export const unifiedLogin = async (data: LoginData): Promise<AuthResponse> => {
  const response = await authApi.post('/login/', data);
  return response.data;
};

export const logout = async (data: LogoutData) => {
  const response = await authApi.post('/logout/', data);
  return response.data;
};

export const logoutAll = async () => {
  const response = await authApi.post('/logout-all/');
  return response.data;
};

export const verifyToken = async () => {
  const response = await authApi.post('/token/verify/');
  return response.data;
};

export const getProfile = async () => {
  const response = await authApi.get('/profile/');
  return response.data;
};

// Helper functions
export const saveAuthTokens = (tokens: { access: string; refresh: string }) => {
  localStorage.setItem('authToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = () => {
  return localStorage.getItem('authToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};
