import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../../../features/auth/slice';
import theme from '../../../theme';
import LoginForm from '../../../features/auth/components/LoginForm';

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the auth slice module
jest.mock('../../../features/auth/slice', () => ({
  ...jest.requireActual('../../../features/auth/slice'),
  login: jest.fn(() => ({ type: 'auth/login/pending' })),
  clearError: jest.fn()
}));

// Custom render function that wraps components in necessary providers
function render(ui, { ...options } = {}) {
  function Wrapper({ children }) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {children} 
        </BrowserRouter>
      </ThemeProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

describe('LoginForm Component', () => {
  // Setup default mocks before each test
  beforeEach(() => {
    // Mock useSelector to return default auth state
    useSelector.mockImplementation(selector => 
      selector({
        auth: {
          isAuthenticated: false,
          isLoading: false,
          error: null
        }
      })
    );
    
    // Mock useDispatch to return a jest function
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    
    // Mock useNavigate
    useNavigate.mockReturnValue(jest.fn());
    
    // Reset mock calls
    login.mockClear();
    clearError.mockClear();
  });

  it('renders the form correctly', () => {
    render(<LoginForm />);
    
    // Check for welcoming text (updated)
    expect(screen.getByText(/Welcome to Find-a-Friend Dog Finder/i)).toBeInTheDocument();
    expect(screen.getByText(/Find your perfect canine companion/i)).toBeInTheDocument();
    
    // Check for form elements
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });
  
  it('validates form inputs', async () => {
    render(<LoginForm />);
    
    // Try to submit the form without filling it
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
    
    // Fill in invalid email
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'invalid-email' },
    });
    
    // Check for email validation message
    await waitFor(() => {
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
    });
  });
  
  it('submits the form with valid data', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    
    render(<LoginForm />);
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Test User' },
    });
    
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Check if login action was dispatched with correct data
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(login).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
      });
    });
  });
  
  it('shows loading state during submission', async () => {
    // Mock loading state
    useSelector.mockImplementation(selector => 
      selector({
        auth: {
          isAuthenticated: false,
          isLoading: true,
          error: null
        }
      })
    );
    
    render(<LoginForm />);
    
    // Check if the button is disabled and shows loading state
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
}); 