import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

// List of events that signal user activity
const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

export const useSessionTimeout = () => {
  const { isAuthenticated, logout } = useAuth();

  // The function to reset the timer, wrapped in useCallback for performance
  const resetTimer = useCallback(() => {
    if (isAuthenticated) {
      const newExpiryTime = Date.now() + INACTIVITY_TIMEOUT;
      localStorage.setItem('sessionExpiry', String(newExpiryTime));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // If user is not authenticated, we don't need to do anything
    if (!isAuthenticated) {
      return;
    }

    // --- Inactivity Timer Logic ---
    // Add event listeners for user activity
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // --- Polling Logic ---
    // Set an interval to check if the session has expired
    const intervalId = setInterval(() => {
      const expiryTime = localStorage.getItem('sessionExpiry');
      if (expiryTime && Date.now() > Number(expiryTime)) {
        console.log('Session expired due to timeout. Logging out.');
        logout();
      }
    }, 5000); // Check every 5 seconds

    // --- Cleanup Function ---
    // This is crucial to prevent memory leaks. It runs when the component
    // unmounts or when the dependency array (isAuthenticated) changes.
    return () => {
      // Clear the interval
      clearInterval(intervalId);
      // Remove all the event listeners
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, logout, resetTimer]); // Dependencies for the effect
};