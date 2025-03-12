import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { login, clearError } from '../slice';

// Validation schema for the login form
const LoginSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Redirect to search page if already authenticated
  useEffect(() => {
    if (isAuthenticated && formSubmitted) {
      navigate('/search');
    }
  }, [isAuthenticated, navigate, formSubmitted]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleSubmit = async (values) => {
    setFormSubmitted(true);
    await dispatch(login({ name: values.name, email: values.email }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Welcome to Fetch Dog Finder
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3 }}>
          Please log in to find your perfect dog companion
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ name: '', email: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                margin="normal"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                disabled={isLoading}
              />

              <Field
                as={TextField}
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default LoginForm; 