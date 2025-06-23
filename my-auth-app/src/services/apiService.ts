import type { LoginRequest, RegisterRequest, User } from './api-types';

class ApiService {
  // Mock login function
  async login(credentials: LoginRequest): Promise<{ token: string }> {
    console.log('Mock Login with:', credentials.email);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
          resolve({ token: 'mock-jwt-token-for-admin-user' });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  }

  // Mock register function
  async register(data: RegisterRequest): Promise<User> {
    console.log('Mock Register with:', data.email);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: Date.now(), email: data.email, role: 'User' });
      }, 1000);
    });
  }

  // Mock getProfile function
  async getProfile(token: string): Promise<User> {
    console.log('Mock Get Profile with token:', token);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token === 'mock-jwt-token-for-admin-user') {
          resolve({ id: 1, email: 'admin@example.com', role: 'Admin' });
        } else {
          reject(new Error('Invalid or expired token'));
        }
      }, 500);
    });
  }
}

// Export a singleton instance
export const apiService = new ApiService();