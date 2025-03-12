import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Fetch Dog Finder
          </Typography>
          <Typography variant="body1">
            Welcome to the Fetch Dog Finder application. This app will help you find your perfect dog companion.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 