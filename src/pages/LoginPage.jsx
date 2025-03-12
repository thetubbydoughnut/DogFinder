import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import LoginForm from '../features/auth/components/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to search page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/search');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage; 