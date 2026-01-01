import { authApi } from './apiConfig';
import { handleApiError } from './apiConfig';

export interface RegisterData {
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

export interface LoginData {
  school_name: string;
  identifier: string;
  password: string;
}

export interface GoogleLoginData {
  access_token: string;
  school_name: string;
}

export interface GoogleRegisterData {
  google_access_token: string;
  username: string;
  display_name: string;
  wilaya: string;
  commune: string;
  zip_code: string;
  street: string;
  phone_number?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface Profile {
  id: number;
  name?: string;
  email?: string;
  phone_number?: string;
  total_owed?: string;
  total_paid?: string;
}

export interface Workspace {
  id: number;
  name: string;
  display_name: string;
  wilaya?: string;
  commune?: string;
  is_active?: boolean;
}

export interface AuthResponse {
  message: string;
  school_name?: string;
  display_name?: string;
  user: User;
  role?: 'admin' | 'teacher' | 'parent' | 'student';
  profile?: Profile;
  workspace: Workspace;
  instructions?: string;
}

export interface PasswordResetRequestData {
  email: string;
  school_name: string;
}

export interface PasswordResetConfirmData {
  uid: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

// Authentication Service Class

class AuthService {

   // Register new admin with school
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/register/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Register');
    }
  }

   // Login (unified for all user types)

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/login/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Login');
    }
  }

  /**
   * Google OAuth login
   * Requires school_name + Google access token
   */
  async googleLogin(data: GoogleLoginData): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/google/login/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Google Login');
    }
  }

  /**
   * Complete Google registration with additional info
   */
  async googleRegisterComplete(data: GoogleRegisterData): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/google/register/complete/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Google Register');
    }
  }

    // Logout current device
  async logout(): Promise<{ message: string }> {
    try {
      const response = await authApi.post('/logout/');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Logout');
    }
  }

    // Logout all devices
  async logoutAll(): Promise<{ message: string }> {
    try {
      const response = await authApi.post('/logout-all/');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Logout All');
    }
  }

  /*
   - Verify current access token
   - Returns user data if token is valid.
   */
  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    try {
      const response = await authApi.post('/verify/');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Verify Token');
    }
  }

  /**
   - Get current user profile 
   - Returns user data with role and profile information.
   */
  async getProfile(): Promise<{
    user: User;
    role: string;
    profile: Profile;
    workspace: Workspace;
  }> {
    try {
      const response = await authApi.get('/me/');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get Profile');
    }
  }

  /*
   - Refresh access token
   */
  async refreshToken(): Promise<{ message: string }> {
    try {
      const response = await authApi.post('/token/refresh/');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Refresh Token');
    }
  }

  /*
   - Request password reset email
   */
  async passwordResetRequest(data: PasswordResetRequestData): Promise<{
    message: string;
    has_email: boolean;
  }> {
    try {
      const response = await authApi.post('/password-reset/request/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Password Reset Request');
    }
  }


   //- Validate password reset token
   
  async passwordResetValidate(uid: string, token: string): Promise<{
    valid: boolean;
    user: User;
  }> {
    try {
      const response = await authApi.post('/password-reset/validate-token/', {
        uid,
        token,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Password Reset Validate');
    }
  }


   // Confirm password reset with new password

  async passwordResetConfirm(data: PasswordResetConfirmData): Promise<{
    message: string;
  }> {
    try {
      const response = await authApi.post('/password-reset/confirm/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Password Reset Confirm');
    }
  }

  /**
   * Change password (when user is already authenticated)
   * Uses dj-rest-auth standard endpoint
   */
  async changePassword(data: {
    old_password: string;
    new_password1: string;
    new_password2: string;
  }): Promise<{ detail: string }> {
    try {
      const response = await authApi.post('/password/change/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Change Password');
    }
  }

   // Check if user is authenticated

  async isAuthenticated(): Promise<boolean> {
    try {
      await this.verifyToken();
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();

export default AuthService;
