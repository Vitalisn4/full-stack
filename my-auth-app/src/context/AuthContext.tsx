import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../services/api-types';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Start as false
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // This effect runs once on app load to check for an existing session
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('authToken');
      const expiryTime = localStorage.getItem('sessionExpiry');

      // Check if token exists AND if it has not expired
      if (storedToken && expiryTime && Date.now() < Number(expiryTime)) {
        try {
          const profile = await apiService.getProfile(storedToken);
          setUser(profile);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Session validation failed:', error);
          logout(); // Clears invalid token and expiry
        }
      } else {
        // If no token or if expired, ensure logged out state
        logout();
      }
      setIsLoading(false);
    };
    validateToken();
  }, []); // The empty dependency array ensures this runs only once on mount

  const login = async (newToken: string) => {
    try {
      const profile = await apiService.getProfile(newToken);
      localStorage.setItem('authToken', newToken);
      
      // *** NEW: Set the session expiry time on login ***
      const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
      localStorage.setItem('sessionExpiry', String(expiryTime));

      setUser(profile);
      setToken(newToken);
      setIsAuthenticated(true);
      navigate('/profile');
    } catch (error) {
      console.error('Failed to fetch profile after login:', error);
      // Ensure we clean up if login fails
      logout();
    }
  };

  const logout = () => {
    // *** NEW: Clear the session expiry time on logout ***
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionExpiry');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    // Only navigate if we are not already on the login page
    if (window.location.pathname !== '/login') {
      navigate('/login');
    }
  };

  const value = { user, token, isAuthenticated, login, logout, isLoading };

  if (isLoading) {
    return <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading Session...</div>;
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