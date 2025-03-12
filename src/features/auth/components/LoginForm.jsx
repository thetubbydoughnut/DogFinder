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

// Dog hero image URL - you can replace this with any dog image you prefer
const DOG_HERO_IMAGE = 'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80';

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
    <Container maxWidth="md">
      <Fade in={showContent} timeout={800}>
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            minHeight: '100vh', 
            alignItems: 'center',
            py: 4,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.substring(1)}' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Left side - Form */}
          <Grid item xs={12} md={6}>
            <Zoom in={showContent} style={{ transitionDelay: showContent ? '150ms' : '0ms' }}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 3, sm: 5 },
                  borderRadius: 3,
                  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '150px',
                    height: '150px',
                    background: `radial-gradient(circle at bottom right, ${theme.palette.primary.light}15, transparent 70%)`,
                    zIndex: 0,
                  },
                }}
              >
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
              </Paper>
            </Zoom>
          </Grid>

          {/* Right side - Image */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zoom in={showContent} style={{ transitionDelay: showContent ? '300ms' : '0ms' }}>
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
                  height: '500px',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={DOG_HERO_IMAGE}
                  alt="Happy dog waiting to meet you"
                  sx={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    p: 2,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Typography variant="h6">Ready to find your new best friend?</Typography>
                  <Typography variant="body2">
                    Thousands of dogs are waiting for their forever homes
                  </Typography>
                </Box>
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Fade>
    </Container>
  );
};

export default LoginForm; 