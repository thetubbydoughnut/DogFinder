import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/slice'; // Adjust path as needed

const useInactivityLogout = (timeout = 600000) => { // Default to 10 minutes (10 * 60 * 1000 ms)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const timerRef = useRef(null);

  const handleLogout = useCallback(() => {
    if (isAuthenticated) {
      console.log(`Inactivity detected. Logging out user after ${timeout / 60000} minutes.`);
      dispatch(logout()).then(() => {
        navigate('/'); // Redirect to login page after logout
      });
    }
  }, [dispatch, navigate, isAuthenticated, timeout]);

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
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize the timer when the hook mounts or auth state changes
    resetTimer();

    // Cleanup function to remove listeners and clear timeout
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]); // Rerun effect if resetTimer changes (due to dependencies changing)

  // No return value needed, the hook just performs actions
};

export default useInactivityLogout; 