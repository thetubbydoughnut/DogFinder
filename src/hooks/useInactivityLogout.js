import { useEffect, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0

const useInactivityLogout = (timeout = 600000) => { // Default to 10 minutes (10 * 60 * 1000 ms)
  const { isAuthenticated, logout } = useAuth0(); // Get Auth0 state and logout function
  const timerRef = useRef(null);

  const handleLogout = useCallback(async () => {
    if (isAuthenticated) {
      // console.log(`Inactivity detected. Logging out user after ${timeout / 60000} minutes.`);
      try {
        await logout({ logoutParams: { returnTo: window.location.origin } });
        // Redirect is handled by Auth0 after logout
      } catch (error) {
        console.error('Error during inactivity logout:', error);
      }
    }
  }, [isAuthenticated, logout, timeout]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (isAuthenticated) { // Only set the timer if the user is logged in
      timerRef.current = setTimeout(handleLogout, timeout);
    }
  }, [handleLogout, timeout, isAuthenticated]);

  useEffect(() => {
    // Events that indicate user activity
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    // Add event listeners to reset the timer on activity
    const handleActivity = () => resetTimer(); // Renamed for clarity
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize the timer when the hook mounts or auth state changes
    resetTimer();

    // Cleanup function to remove listeners and clear timeout
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]); // Rerun effect if resetTimer changes (due to dependencies changing)

  // No return value needed, the hook just performs actions
};

export default useInactivityLogout; 