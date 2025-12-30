import axios, { AxiosInstance, AxiosError } from 'axios';

// Base URLs
export const API_BASE_URLS = {
  AUTH: 'http://localhost:8000/api/auth',
  MEMBERS: 'http://localhost:8000/api/members',
  DASHBOARD: 'http://localhost:8000/api/dashboard',
  ACADEMIC: 'http://localhost:8000/api/academic',
} as const;

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export const handleApiError = (error: any, context: string): ApiError => {
  console.error(`[${context}]:`, error);

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      switch (status) {
        case 401:
          return {
            message: 'Session expired. Please login again.',
            status,
            data,
          };
        case 403:
          return {
            message: 'You do not have permission to perform this action.',
            status,
            data,
          };
        case 404:
          return {
            message: 'Resource not found.',
            status,
            data,
          };
        case 500:
          return {
            message: 'Server error. Please try again later.',
            status,
            data,
          };
        default:
          return {
            message: (data as any)?.error || 'An error occurred.',
            status,
            data,
          };
      }
    }

    if (axiosError.request) {
      return {
        message: 'Network error. Please check your connection.',
      };
    }
  }

  return {
    message: error.message || 'An unexpected error occurred.',
  };
};

// Create API Instance (HTTP-only Cookies)
export const createApiInstance = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Automatically sends HttpOnly cookies
  });

  // Attach Authorization header from localStorage tokens when available
  api.interceptors.request.use((config) => {
    try {
      const token =
        (typeof window !== 'undefined' && (localStorage.getItem('access_token') || localStorage.getItem('authToken'))) || '';
      if (token) {
        config.headers = config.headers || {};
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
      }
    } catch (_) {}
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized (token expired)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Prefer cookie-based refresh; fallback to stored refresh token
          const refresh =
            (typeof window !== 'undefined' && (localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken'))) || undefined;
          await axios.post(
            `${API_BASE_URLS.AUTH}/token/refresh/`,
            refresh ? { refresh } : {},
            { withCredentials: true }
          );
          return api(originalRequest);
        } catch (refreshError) {
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export const authApi = createApiInstance(API_BASE_URLS.AUTH);
export const membersApi = createApiInstance(API_BASE_URLS.MEMBERS);
export const dashboardApi = createApiInstance(API_BASE_URLS.DASHBOARD);
export const academicApi = createApiInstance(API_BASE_URLS.ACADEMIC);

export const api = {
  // GET request
  get: async <T = any>(url: string, config?: any): Promise<T> => {
    try {
      const response = await authApi.get(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'GET ' + url);
    }
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    try {
      const response = await authApi.post(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'POST ' + url);
    }
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    try {
      const response = await authApi.put(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'PUT ' + url);
    }
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    try {
      const response = await authApi.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'PATCH ' + url);
    }
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: any): Promise<T> => {
    try {
      const response = await authApi.delete(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'DELETE ' + url);
    }
  },
};