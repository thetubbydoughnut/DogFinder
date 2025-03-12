import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PetsIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}{' '}
            <Link color="inherit" href="https://fetch.com/" target="_blank" rel="noopener">
              Fetch Dog Finder
            </Link>{' '}
            - A React Project for dog lovers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 