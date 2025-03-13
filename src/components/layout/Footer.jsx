import React from 'react';
import { Box, Container, Typography, Link, useTheme, IconButton, Tooltip } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import GitHubIcon from '@mui/icons-material/GitHub';
import CachedIcon from '@mui/icons-material/Cached';
import CacheManager from '../ui/CacheManager';

const Footer = () => {
  const theme = useTheme();
  const [showCacheManager, setShowCacheManager] = React.useState(false);
  
  const toggleCacheManager = () => {
    setShowCacheManager(prev => !prev);
  };
  
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: { xs: 2, sm: 0 },
          }}>
            <PetsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="body2" color="text.secondary">
              {'© '}
              {new Date().getFullYear()}{' '}
              <Link 
                color="inherit" 
                href="https://fetch.com/" 
                target="_blank" 
                rel="noopener"
                sx={{ 
                  textDecoration: 'none', 
                  fontWeight: 'medium',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Fetch Dog Finder
              </Link>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" mr={1}>
              Built with React & Material UI
            </Typography>
            
            {/* Cache Manager Button */}
            <Tooltip title="Cache Manager">
              <IconButton 
                color="primary" 
                size="small" 
                onClick={toggleCacheManager}
                sx={{ 
                  mx: 1,
                  backgroundColor: showCacheManager ? 'rgba(63, 81, 181, 0.1)' : 'transparent',
                }}
              >
                <CachedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Link
              href="https://github.com/thetubbydoughnut/FetchRewardsDogFinder"
              target="_blank"
              rel="noopener"
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700],
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <GitHubIcon fontSize="small" />
            </Link>
          </Box>
        </Box>
        
        {/* Include the cache manager with custom styling to fit in the footer */}
        {showCacheManager && (
          <Box 
            sx={{ 
              mt: 2, 
              border: `1px solid ${theme.palette.divider}`, 
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <CacheManager inFooter={true} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Footer; 