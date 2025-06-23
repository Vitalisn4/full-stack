// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiService';
// MODIFICATION: UserProfileResponse is the correct type for our user state
import type { UserProfileResponse } from '../services/generated';

interface AuthContextType {
  // The user object will conform to the API's response shape
  user: UserProfileResponse | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Session expiry check effect
  useEffect(() => {
    const checkSessionExpiry = () => {
      const expiry = localStorage.getItem('sessionExpiry');
      if (expiry && Date.now() > Number(expiry)) {
        logout();
      }
    };

    // Check every 5 seconds
    const interval = setInterval(checkSessionExpiry, 5000);

    // Also check on mount
    checkSessionExpiry();

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []); // Only run once on mount

  useEffect(() => {
    const validateCurrentSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // On app load, we ask the backend for the current user's profile
          const response = await api.profile();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          // If the token is invalid, the /profile call will fail.
          // The interceptor in apiService will handle a 401 and try to refresh.
          // If refresh also fails, it will reject, and we land here.
          console.error('Session validation failed. User is not authenticated.', error);
          localStorage.removeItem('authToken');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      // Finished checking, no longer loading.
      setIsLoading(false);
    };
    
    validateCurrentSession();
  }, []); // The empty dependency array ensures this runs only once on mount.

  const login = async (newToken: string) => {
    // 1. Store the new token immediately
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('sessionExpiry', String(Date.now() + 10 * 60 * 1000));

    try {
      // 2. Fetch the user's profile with the new token
      const response = await api.profile();
      setUser(response.data);
      setIsAuthenticated(true);
      navigate('/profile');
    } catch (error) {
      console.error('Failed to fetch profile after login:', error);
      // If fetching the profile fails even with a new token, something is wrong. Log out.
      await logout();
    }
  };

  const logout = async (): Promise<void> => {
    // We want to try to log out from the backend, but always log out from the frontend.
    try {
      // The interceptor will add the token to this request
      await api.logout();
      console.log('Successfully logged out from backend.');
    } catch (error) {
      console.error('Backend logout failed, proceeding with frontend logout.', error);
    } finally {
      // This block runs regardless of whether the `try` or `catch` block executed.
      localStorage.removeItem('authToken');
      localStorage.removeItem('sessionExpiry');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };
  
  const value = { user, isAuthenticated, login, logout, isLoading };

  // Render a loading state while we check the session
  if (isLoading) {
    return <div style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center', width: '100%' }}>Loading Session...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};