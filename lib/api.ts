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
  status: number;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: result.error || 'Registration failed',
          status: response.status,
        };
      }

      return {
        data: result,
        status: response.status,
      };
    } catch (error) {
      return {
        error: 'Network error. Please try again.',
        status: 500,
      };
    }
  },

  login: async (data: LoginData): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: result.error || 'Login failed',
          status: response.status,
        };
      }

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
        error: 'Network error. Please try again.',
        status: 500,
      };
    }
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${API_BASE_URL}/auth/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: result.error || 'Failed to fetch profile',
          status: response.status,
        };
      }

      return {
        data: result,
        status: response.status,
      };
    } catch (error) {
      return {
        error: 'Network error. Please try again.',
        status: 500,
      };
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('workspace');
  },
};