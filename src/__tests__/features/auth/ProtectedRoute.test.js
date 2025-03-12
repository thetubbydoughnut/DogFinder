import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../test-utils';
import ProtectedRoute from '../../../features/auth/components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';

// Mock the Navigate component from react-router-dom
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    Navigate: () => <div data-testid="navigate-mock">Redirected to login</div>,
  };
});

// Mock child component for testing purposes
const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute Component', () => {
  it('renders children when user is authenticated', () => {
    // Set up authenticated state
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: { name: 'Test User', email: 'test@example.com' },
      },
    };
    
    render(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TestComponent />} />
        </Route>
      </Routes>,
      { preloadedState: initialState }
    );
    
    // Verify that the protected content is rendered
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
  
  it('redirects to login when user is not authenticated', () => {
    // Set up unauthenticated state
    const initialState = {
      auth: {
        isAuthenticated: false,
        user: null,
      },
    };
    
    render(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TestComponent />} />
        </Route>
      </Routes>,
      { preloadedState: initialState }
    );
    
    // Check for the redirected component
    expect(screen.getByTestId('navigate-mock')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
}); 