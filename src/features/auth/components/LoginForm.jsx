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
  Grid,
  Container,
  useTheme,
  Tooltip,
  Zoom,
  Fade,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { login, clearError } from '../slice';

// Validation schema for the login form
const LoginSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const LoginForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Show content with animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
    <Fade in={showContent} timeout={800}>
      <Box>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <PetsIcon 
            sx={{ 
              fontSize: 40, 
              color: theme.palette.primary.main,
              mr: 2,
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }} 
          />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Fetch Dog Finder
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.secondary, position: 'relative', zIndex: 1 }}>
          Find your perfect canine companion
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ name: '', email: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <Box sx={{ mb: 3, position: 'relative' }}>
                <Field
                  as={TextField}
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  variant="outlined"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                    ),
                  }}
                />
              </Box>

              <Box sx={{ mb: 4, position: 'relative' }}>
                <Tooltip 
                  title="Please enter a valid email address" 
                  placement="top"
                  arrow
                >
                  <Field
                    as={TextField}
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      ),
                    }}
                  />
                </Tooltip>
              </Box>

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                disabled={isLoading || !(dirty && isValid)}
                sx={{
                  py: 1.5,
                  position: 'relative',
                  zIndex: 1,
                  fontWeight: 600,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In & Find Dogs'
                )}
              </Button>
            </Form>
          )}
        </Formik>

        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 4, 
            color: theme.palette.text.secondary,
            position: 'relative',
            zIndex: 1,
          }}
        >
          By signing in, you'll be able to browse available dogs,
          save your favorites, and find your perfect match
        </Typography>
      </Box>
    </Fade>
  );
};

export default LoginForm; 