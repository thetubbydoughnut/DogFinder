import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  AlertTitle,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import PropTypes from 'prop-types';

/**
 * A reusable error state component that handles different types of errors
 * with appropriate messaging and actions.
 */
const ErrorState = ({ 
  type = 'general', 
  title, 
  message, 
  errorDetails, 
  onRetry, 
  onGoBack,
  actionText,
  elevation = 2,
  showIcon = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Define error types with default messages and icons
  const errorTypes = {
    general: {
      icon: <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />,
      defaultTitle: 'Something went wrong',
      defaultMessage: 'We encountered an unexpected error. Please try again or contact support.'
    },
    network: {
      icon: <WifiOffIcon color="error" sx={{ fontSize: 60 }} />,
      defaultTitle: 'Network Error',
      defaultMessage: 'Unable to connect to our servers. Please check your internet connection and try again.'
    },
    notFound: {
      icon: <SearchOffIcon color="error" sx={{ fontSize: 60 }} />,
      defaultTitle: 'Not Found',
      defaultMessage: 'The requested resource could not be found. It may have been removed or is temporarily unavailable.'
    },
    api: {
      icon: <ErrorIcon color="error" sx={{ fontSize: 60 }} />,
      defaultTitle: 'API Error',
      defaultMessage: 'There was an error communicating with our servers. Please try again later.'
    }
  };
  
  const errorType = errorTypes[type] || errorTypes.general;
  const displayTitle = title || errorType.defaultTitle;
  const displayMessage = message || errorType.defaultMessage;
  
  return (
    <Paper 
      elevation={elevation} 
      sx={{ 
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        width: '100%',
        mb: 3,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        {showIcon && (
          <Box 
            sx={{ 
              mr: isMobile ? 0 : 3, 
              mb: isMobile ? 2 : 0,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {errorType.icon}
          </Box>
        )}
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom color="error">
            {displayTitle}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
            {displayMessage}
          </Typography>
          
          {errorDetails && (
            <Alert severity="error" sx={{ mb: 3, maxWidth: '100%', overflow: 'auto' }}>
              <AlertTitle>Error Details</AlertTitle>
              <Typography variant="body2" component="pre" 
                sx={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  maxHeight: '150px',
                  overflow: 'auto',
                  fontSize: '0.8rem'
                }}
              >
                {typeof errorDetails === 'object' 
                  ? JSON.stringify(errorDetails, null, 2) 
                  : errorDetails}
              </Typography>
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            {onRetry && (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<RefreshIcon />}
                onClick={onRetry}
              >
                {actionText || 'Try Again'}
              </Button>
            )}
            
            {onGoBack && (
              <Button 
                variant="outlined"
                onClick={onGoBack}
              >
                Go Back
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

ErrorState.propTypes = {
  /** The type of error to display */
  type: PropTypes.oneOf(['general', 'network', 'notFound', 'api']),
  /** Custom title to override the default for the error type */
  title: PropTypes.string,
  /** Custom message to override the default for the error type */
  message: PropTypes.string,
  /** Additional error details to display in a collapsible section */
  errorDetails: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Function to call when the retry button is clicked */
  onRetry: PropTypes.func,
  /** Function to call when the go back button is clicked */
  onGoBack: PropTypes.func,
  /** Custom text for the action button */
  actionText: PropTypes.string,
  /** Paper elevation */
  elevation: PropTypes.number,
  /** Whether to show the error icon */
  showIcon: PropTypes.bool,
};

export default ErrorState; 