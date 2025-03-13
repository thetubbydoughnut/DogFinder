import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Paper, Typography, useTheme, Grid } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import LoginForm from '../features/auth/components/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to search page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/search');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(45deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
          : `linear-gradient(45deg, #f5f5f5 0%, #ffffff 100%)`,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.substring(1)}' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={4} 
          alignItems="center"
          justifyContent="center"
          sx={{ py: 4 }}
        >
          <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <PetsIcon 
                sx={{ 
                  fontSize: 48, 
                  color: theme.palette.primary.main,
                  mr: 2,
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                  },
                }} 
              />
              <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
                Fetch Dog Finder
              </Typography>
            </Box>
            <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
              Find your perfect canine companion
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 3,
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
              }}
            >
              <LoginForm />
            </Paper>
          </Grid>
          
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              position: 'relative',
              height: '100%',
              minHeight: '500px',
            }}
          >
            <Paper
              elevation={8}
              sx={{
                position: 'relative',
                height: '100%',
                minHeight: '500px',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                transform: 'perspective(1000px) rotateY(-5deg)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'perspective(1000px) rotateY(0deg)',
                },
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                alt="Happy dog with owner"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 3,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Ready to Meet Your New Best Friend?
                </Typography>
                <Typography variant="body1">
                  Sign in to browse our database of lovable dogs looking for a forever home.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage; 