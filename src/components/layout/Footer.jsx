import React from 'react';
import { Box, Container, Typography, Link, useTheme, IconButton, Tooltip, Fade } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  const theme = useTheme();
  
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
            
            <Link
              href="https://github.com/thetubbydoughnut/FetchRewardsDogFinder"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project on GitHub <GitHubIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 