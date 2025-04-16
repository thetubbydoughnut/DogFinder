import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const LoginForm = () => {
  const { loginWithRedirect, isLoading, error } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
    } catch (err) {
      // Errors during redirect initiation are less common but possible
      console.error('Failed to initiate login redirect:', err);
    }
  };

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        maxWidth: 400, 
        mx: 'auto' 
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
        Welcome Back!
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Please log in or sign up to continue.
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Login Error: {error.message}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
        onClick={handleLogin}
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? 'Loading...' : 'Log In / Sign Up'}
      </Button>
    </Paper>
  );
};

export default LoginForm; 