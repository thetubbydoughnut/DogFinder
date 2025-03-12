import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import LoginForm from '../../../features/auth/components/LoginForm';

// Mock the login thunk
jest.mock('../../../features/auth/slice', () => {
  const originalModule = jest.requireActual('../../../features/auth/slice');
  
  return {
    __esModule: true,
    ...originalModule,
    login: jest.fn(() => {
      return { type: 'auth/login/fulfilled', payload: { name: 'Test User', email: 'test@example.com' } };
    }),
    clearError: jest.fn(),
  };
});

describe('LoginForm Component', () => {
  it('renders the form correctly', () => {
    render(<LoginForm />);
    
    // Check for heading and text
    expect(screen.getByText(/Welcome to Fetch Dog Finder/i)).toBeInTheDocument();
    expect(screen.getByText(/Please log in to find your perfect dog companion/i)).toBeInTheDocument();
    
    // Check for form elements
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });
  
  it('validates form inputs', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    // Submit without filling in fields
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    await user.click(submitButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
    
    // Fill in name field only
    const nameInput = screen.getByLabelText(/Name/i);
    await user.type(nameInput, 'Test User');
    await user.click(submitButton);
    
    // Should still show email error
    await waitFor(() => {
      expect(screen.queryByText(/Name is required/i)).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
    
    // Fill in email field with invalid email
    const emailInput = screen.getByLabelText(/Email/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    // Should show invalid email error
    await waitFor(() => {
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
    });
    
    // Fill in with valid email
    await user.clear(emailInput);
    await user.type(emailInput, 'test@example.com');
    
    // Form should be valid now
    await waitFor(() => {
      expect(screen.queryByText(/Invalid email/i)).not.toBeInTheDocument();
    });
  });
  
  it('submits the form with valid data', async () => {
    const login = require('../../../features/auth/slice').login;
    const user = userEvent.setup();
    
    render(<LoginForm />);
    
    // Fill in form
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    // Check if login was called with correct data
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
      });
    });
  });
  
  it('shows loading state during submission', async () => {
    // Mock the login thunk to be pending
    const login = require('../../../features/auth/slice').login;
    login.mockImplementationOnce(() => ({
      type: 'auth/login/pending'
    }));
    
    const user = userEvent.setup();
    
    const { store } = render(<LoginForm />);
    
    // Set loading state in store
    store.dispatch({ type: 'auth/login/pending' });
    
    // Fill in form
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    // Should show loading state (CircularProgress)
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Submit button should be disabled
    expect(submitButton).toBeDisabled();
  });
}); 