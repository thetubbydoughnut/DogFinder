import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Fade, 
  useTheme 
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { keyframes } from '@mui/system';

// Define animations
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

const fadeInOut = keyframes`
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
`;

const LoadingScreen = ({ message = "Loading your pawsome experience..." }) => {
  const theme = useTheme();
  const [loadingDots, setLoadingDots] = useState('.');
  const [showAdditionalText, setShowAdditionalText] = useState(false);

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev.length >= 3) return '.';
        return prev + '.';
      });
    }, 500);

    // Show additional text after 2 seconds
    const timer = setTimeout(() => {
      setShowAdditionalText(true);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '80%',
          textAlign: 'center',
        }}
      >
        <PetsIcon 
          sx={{ 
            fontSize: { xs: 60, md: 80 },
            color: theme.palette.primary.main,
            animation: `${bounce} 2s infinite ease`,
            mb: 3,
          }} 
        />
        
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="600"
          color="primary"
          gutterBottom
          sx={{ 
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Fetch Dog Finder
        </Typography>
        
        <Box 
          sx={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 40,
            mb: 3,
          }}
        >
          <CircularProgress 
            size={40} 
            thickness={4} 
            sx={{
              color: theme.palette.primary.main,
              mb: 2,
            }} 
          />
        </Box>
        
        <Typography 
          variant="body1" 
          color="textSecondary"
          sx={{ 
            animation: `${fadeInOut} 2s infinite ease-in-out`,
            fontFamily: 'Open Sans, sans-serif',
          }}
        >
          {message}{loadingDots}
        </Typography>
        
        <Fade in={showAdditionalText} timeout={1000}>
          <Typography 
            variant="body2" 
            color="textSecondary" 
            sx={{ 
              mt: 5, 
              maxWidth: 400,
              opacity: 0.8,
            }}
          >
            Finding your perfect furry companion...
          </Typography>
        </Fade>
      </Box>
    </Box>
  );
};

export default LoadingScreen; 