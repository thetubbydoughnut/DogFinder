import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Define props interface with children
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const location = useLocation();

  // If not authenticated, redirect to login page, passing the current location
  if (!isAuthenticated) {
    // Log the redirection
    console.log('ProtectedRoute: User not authenticated. Redirecting to login from:', location.pathname);
    // Pass the location state to the login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 