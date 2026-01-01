import axios, { AxiosInstance, AxiosError } from 'axios';

// Backend API base URL - uses environment variable or defaults to localhost
const API_BASE = process.env.NEXT_PUBLIC_API_URL ;

// Base URLs
export const API_BASE_URLS = {
  AUTH: `${API_BASE}/auth`,
  MEMBERS: `${API_BASE}/members`,
  DASHBOARD: `${API_BASE}/dashboard`,
  ACADEMIC: `${API_BASE}/academic`,
  SETTINGS: `${API_BASE}/settings`,
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

    if (axiosError.response) {Most Likely Problem:
    The timetables page (src/app/admin/academic/timetables/page.tsx) has a useEffect that depends on filters, which updates the options, causing an infinite loop of API calls.
    Quick Fix Options:
    Option 1: Disable problematic pages (fastest)
    cd /home/edux-manager/htdocs/edux-manager.online/frontend/src/app/admin
    mv attendance/page.tsx attendance/page.tsx.disabled
    mv academic/timetables/page.tsx academic/timetables/page.tsx.disabled
    mv announcements/page.tsx announcements/page.tsx.disabled
    cd /home/edux-manager/htdocs/edux-manager.online/frontend/src/app/adminmv attendance/page.tsx attendance/page.tsx.disabledmv academic/timetables/page.tsx academic/timetables/page.tsx.disabledmv announcements/page.tsx announcements/page.tsx.disabled
    Option 2: Delete new API files
    cd /home/edux-manager/htdocs/edux-manager.online/frontend
    rm -f src/lib/api/settings.ts src/lib/api/attendance.ts src/lib/api/announcements.ts src/lib/api/timetables.ts
    cd /home/edux-manager/htdocs/edux-manager.online/frontendrm -f src/lib/api/settings.ts src/lib/api/attendance.ts src/lib/api/announcements.ts src/lib/api/timetables.ts
    
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      // For validation errors (400), return the actual error data
      if (status === 400 && data) {
        return {
          message: 'Validation error',
          status,
          data,
        };
      }

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
          // Return the actual error message from the server if available
          const errorMessage = (data as any)?.error || 
                              (data as any)?.detail || 
                              (data as any)?.message || 
                              'An error occurred.';
          return {
            message: errorMessage,
            status,
            data,
          };
      }
    }

    if (axiosError.request) {
      return {
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  return {
    message: error.message || 'An unexpected error occurred.',
  };
};

// Create API Instance (HTTP-only Cookies + JWT Token Support)
export const createApiInstance = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true, // Automatically sends HttpOnly cookies
  });

  // Request interceptor to add JWT token if available
  api.interceptors.request.use(
    (config) => {
      // Check for JWT token in localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token') || 
                     localStorage.getItem('authToken') ||
                     localStorage.getItem('token');
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized (token expired)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await axios.post(
            `${API_BASE_URLS.AUTH}/token/refresh/`,
            {},
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
export const settingsApi = createApiInstance(API_BASE_URLS.SETTINGS);

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