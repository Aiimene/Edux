import axios, { AxiosInstance } from 'axios';

// Backend API base URLs
export const API_BASE_URLS = {
  AUTH: 'http://127.0.0.1:8000/api/auth',
  MEMBERS: 'http://127.0.0.1:8000/api/members',
  DASHBOARD: 'http://127.0.0.1:8000/api/dashboard',
  ACADEMIC: 'http://127.0.0.1:8000/api/academic',
};

// Common error handler
export const handleApiError = (error: any, context: string) => {
  console.error(`${context}:`, error);
  
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 401) {
      console.error('Unauthorized - Token may be expired');
      // Optionally trigger logout
    } else if (status === 403) {
      console.error('Forbidden - Insufficient permissions');
    } else if (status === 404) {
      console.error('Not found');
    } else if (status >= 500) {
      console.error('Server error');
    }
    
    throw error;
  } else if (error.request) {
    // Request made but no response
    console.error('No response from server');
    throw new Error('Network error - please check your connection');
  } else {
    // Something else happened
    console.error('Error:', error.message);
    throw error;
  }
};

// Create a configured axios instance
export const createApiInstance = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Add JWT token to every request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      // Avoid infinite loops
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Try to refresh access token.
          // Prefer cookie-based refresh via withCredentials.
          const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');
          const payload = refreshToken ? { refresh: refreshToken } : {};

          const refreshResponse = await axios.post(
            `${API_BASE_URLS.AUTH}/token/refresh/`,
            payload,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );

          const newAccess = refreshResponse.data?.access || refreshResponse.data?.token || refreshResponse.data?.access_token;
          if (newAccess) {
            // Persist new access token for header-based auth, if applicable
            localStorage.setItem('authToken', newAccess);
            localStorage.setItem('access_token', newAccess);

            // Update header and retry original request
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          console.error('Token refresh failed:', refreshErr);
          // Don't auto-redirect - let the individual pages handle auth errors
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

// Export pre-configured instances
export const membersApi = createApiInstance(API_BASE_URLS.MEMBERS);
export const dashboardApi = createApiInstance(API_BASE_URLS.DASHBOARD);
export const authApi = createApiInstance(API_BASE_URLS.AUTH);
export const academicApi = createApiInstance(API_BASE_URLS.ACADEMIC);
