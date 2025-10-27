/**
 * Authentication Service
 * Handles user authentication and token management
 */

import { apiService } from './api.service';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AuthResponse {
  uid: string;
  email: string;
  displayName?: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  displayName?: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'currentUser';

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    const response = await apiService.post<AuthResponse>('/api/auth/register', data);

    if (response.success && response.data) {
      // Save token and user data
      this.saveToken(response.data.token);
      this.saveUser({
        uid: response.data.uid,
        email: response.data.email,
        displayName: response.data.displayName,
      });

      return {
        success: true,
        user: {
          uid: response.data.uid,
          email: response.data.email,
          displayName: response.data.displayName,
        },
      };
    }

    return {
      success: false,
      error: response.error?.message || 'Registration failed',
    };
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    const response = await apiService.post<AuthResponse>('/api/auth/login', credentials);

    if (response.success && response.data) {
      // Save token and user data
      this.saveToken(response.data.token);
      this.saveUser({
        uid: response.data.uid,
        email: response.data.email,
        displayName: response.data.displayName,
      });

      return {
        success: true,
        user: {
          uid: response.data.uid,
          email: response.data.email,
          displayName: response.data.displayName,
        },
      };
    }

    return {
      success: false,
      error: response.error?.message || 'Login failed',
    };
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Verify if user is authenticated
   */
  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const response = await apiService.post<{ uid: string; email: string; valid: boolean }>(
      '/api/auth/verify-token'
    );

    return response.success && response.data?.valid === true;
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Save token to localStorage
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Save user to localStorage
   */
  private saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

// Export singleton instance
export const authService = new AuthService();
