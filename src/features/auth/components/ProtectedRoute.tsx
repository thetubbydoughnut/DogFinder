import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress } from '@mui/material';

// Define props interface with children
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  // Show loading indicator while Auth0 is checking authentication state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to Auth0 login page
  if (!isAuthenticated) {
    // console.log('ProtectedRoute: User not authenticated. Redirecting to Auth0 login from:', location.pathname);
    // Auth0 handles storing the return path automatically when using loginWithRedirect
    // No need to pass state={{ from: location }}
    // We can call loginWithRedirect here, or let the app redirect to the login page
    // which now contains the Auth0 login button. Let's choose the latter for simplicity.
    // Alternatively, could call loginWithRedirect() here directly.
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 