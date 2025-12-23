// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RegisterData {
  username: string;
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  display_name: string;
  wilaya: string;
  commune: string;
  zip_code: string;
  street: string;
}

interface LoginData {
  school_name: string;
  identifier: string;
  password: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;  // New! For field-specific errors
  status: number;
}

/**
 * Format Django validation errors into user-friendly messages
 */
const formatDjangoErrors = (errorData: any): { message: string; fieldErrors: Record<string, string[]> } => {
  const fieldErrors: Record<string, string[]> = {};
  let generalMessage = '';

  if (typeof errorData === 'string') {
    generalMessage = errorData;
  } else if (typeof errorData === 'object' && errorData !== null) {
    // Django returns errors like: { "password1": ["This password is too common."], "email": ["This field is required."] }
    
    for (const [field, messages] of Object.entries(errorData)) {
      if (Array.isArray(messages)) {
        // Clean up field names for display
        const friendlyFieldName = field
          .replace('password1', 'password')
          .replace('password2', 'password confirmation')
          .replace('_', ' ')
          .replace(/^([a-z])/, (match) => match.toUpperCase());
        
        fieldErrors[field] = messages.map(msg => 
          typeof msg === 'string' ? msg : msg.toString()
        );
      } else if (field === 'detail' || field === 'error' || field === 'message') {
        generalMessage = messages as string;
      }
    }

    // If we have field errors, create a summary message
    if (Object.keys(fieldErrors).length > 0) {
      const errorCount = Object.keys(fieldErrors).length;
      generalMessage = `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the form.`;
    }
  }

  return {
    message: generalMessage || 'An error occurred',
    fieldErrors
  };
};

export const authAPI = {
  /**
   * Register a new admin account
   */
  register: async (data: RegisterData): Promise<ApiResponse<any>> => {
    try {
      console.log('🔍 Sending registration data:', data);

      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('📦 Received response:', result);

      if (!response.ok) {
        const { message, fieldErrors } = formatDjangoErrors(result);
        
        return {
          error: message,
          fieldErrors: fieldErrors,
          status: response.status,
        };
      }

      return {
        data: result,
        status: response.status,
      };
    } catch (error) {
      console.error('💥 Network error:', error);
      return {
        error: 'Network error. Please check your connection and try again.',
        status: 500,
      };
    }
  },

  /**
   * Login with school name, username/email, and password
   */
  login: async (data: LoginData): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const { message, fieldErrors } = formatDjangoErrors(result);
        
        return {
          error: message,
          fieldErrors: fieldErrors,
          status: response.status,
        };
      }

      // Store tokens and user info
      if (result.tokens) {
        localStorage.setItem('access_token', result.tokens.access);
        localStorage.setItem('refresh_token', result.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('role', result.role);
        localStorage.setItem('workspace', JSON.stringify(result.workspace));
      }

      return {
        data: result,
        status: response.status,
      };
    } catch (error) {
      return {
        error: 'Network error. Please check your connection and try again.',
        status: 500,
      };
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return {
          error: 'Not authenticated',
          status: 401,
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        // Attempt refresh on unauthorized
        if (response.status === 401) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            const retryToken = localStorage.getItem('access_token');
            const retryRes = await fetch(`${API_BASE_URL}/auth/me/`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': retryToken ? `Bearer ${retryToken}` : undefined as any,
              },
              credentials: 'include',
            });
            const retryBody = await retryRes.json();
            if (retryRes.ok) {
              return { data: retryBody, status: retryRes.status };
            }
            return { error: retryBody.error || retryBody.detail || 'Failed to fetch profile', status: retryRes.status };
          }
        }
        return {
          error: result.error || result.detail || 'Failed to fetch profile',
          status: response.status,
        };
      }

      return {
        data: result,
        status: response.status,
      };
    } catch (error) {
      return {
        error: 'Network error. Please check your connection and try again.',
        status: 500,
      };
    }
  },

  /**
   * Logout and clear stored data
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('workspace');
  },
};

// Try to refresh the access token using cookie or stored refresh token
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refresh = localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken');
    const body = refresh ? { refresh } : {};
    const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return false;
    const newAccess = data?.access || data?.access_token || data?.token;
    if (newAccess) {
      localStorage.setItem('access_token', newAccess);
      localStorage.setItem('authToken', newAccess);
      return true;
    }
    return false;
  } catch (_err) {
    return false;
  }
};