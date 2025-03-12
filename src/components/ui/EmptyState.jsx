import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchIcon from '@mui/icons-material/Search';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PropTypes from 'prop-types';

/**
 * A reusable empty state component for displaying when no data is available.
 */
const EmptyState = ({ 
  type = 'general', 
  title, 
  message, 
  primaryAction,
  primaryActionText,
  secondaryAction,
  secondaryActionText,
  elevation = 2,
  showIcon = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Define empty state types with default messages and icons
  const emptyStateTypes = {
    general: {
      icon: <InboxIcon sx={{ fontSize: 60, color: theme.palette.text.secondary }} />,
      defaultTitle: 'No Data Available',
      defaultMessage: 'There is no data to display at this time.'
    },
    search: {
      icon: <SearchIcon sx={{ fontSize: 60, color: theme.palette.text.secondary }} />,
      defaultTitle: 'No Results Found',
      defaultMessage: 'We couldn\'t find any results for your search. Try adjusting your filters.'
    },
    dogs: {
      icon: <PetsIcon sx={{ fontSize: 60, color: theme.palette.text.secondary }} />,
      defaultTitle: 'No Dogs Found',
      defaultMessage: 'We couldn\'t find any dogs matching your criteria. Try different search parameters.'
    },
    favorites: {
      icon: <FavoriteIcon sx={{ fontSize: 60, color: theme.palette.text.secondary }} />,
      defaultTitle: 'No Favorites Yet',
      defaultMessage: 'You haven\'t added any dogs to your favorites list yet. Browse dogs and click the heart icon to add them here.'
    }
  };
  
  const emptyType = emptyStateTypes[type] || emptyStateTypes.general;
  const displayTitle = title || emptyType.defaultTitle;
  const displayMessage = message || emptyType.defaultMessage;
  
  return (
    <Paper 
      elevation={elevation} 
      sx={{ 
        p: { xs: 3, sm: 4 },
        borderRadius: 2,
        width: '100%',
        mb: 3,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: 200,
      }}
    >
      {showIcon && (
        <Box 
          sx={{ 
            mb: 2,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {emptyType.icon}
        </Box>
      )}
      
      <Typography variant="h5" component="h2" gutterBottom>
        {displayTitle}
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 3, 
          color: theme.palette.text.secondary,
          maxWidth: 600,
          mx: 'auto' 
        }}
      >
        {displayMessage}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        justifyContent: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        width: isMobile ? '100%' : 'auto',
      }}>
        {primaryAction && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={primaryAction}
            fullWidth={isMobile}
          >
            {primaryActionText || 'Try Again'}
          </Button>
        )}
        
        {secondaryAction && (
          <Button 
            variant="outlined"
            onClick={secondaryAction}
            fullWidth={isMobile}
          >
            {secondaryActionText || 'Go Back'}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

EmptyState.propTypes = {
  /** The type of empty state to display */
  type: PropTypes.oneOf(['general', 'search', 'dogs', 'favorites']),
  /** Custom title to override the default for the empty state type */
  title: PropTypes.string,
  /** Custom message to override the default for the empty state type */
  message: PropTypes.string,
  /** Function to call when the primary action button is clicked */
  primaryAction: PropTypes.func,
  /** Custom text for the primary action button */
  primaryActionText: PropTypes.string,
  /** Function to call when the secondary action button is clicked */
  secondaryAction: PropTypes.func,
  /** Custom text for the secondary action button */
  secondaryActionText: PropTypes.string,
  /** Paper elevation */
  elevation: PropTypes.number,
  /** Whether to show the icon */
  showIcon: PropTypes.bool,
};

export default EmptyState; 