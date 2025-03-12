import React, { lazy, Suspense, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { createAppTheme } from './theme';
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import LoadingScreen from './components/layout/LoadingScreen';

// Lazy load other pages
const SearchPage = lazy(() => import('./pages/SearchPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const DogDetailsPage = lazy(() => import('./pages/DogDetailsPage'));

// Loading component for Suspense
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// App with theme support
function AppWithTheme() {
  // Get theme mode from context
  const { mode } = useTheme();
  
  // Create theme based on current mode
  const theme = createAppTheme(mode);
  
  // State to track if the app is loading
  const [isLoading, setIsLoading] = useState(true);

  // Simulate app initialization
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show loading screen for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen during initial load
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/search"
                element={
                  <Layout>
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <SearchPage />
                      </Suspense>
                    </ErrorBoundary>
                  </Layout>
                }
              />
              <Route
                path="/favorites"
                element={
                  <Layout>
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <FavoritesPage />
                      </Suspense>
                    </ErrorBoundary>
                  </Layout>
                }
              />
              <Route
                path="/dogs/:id"
                element={
                  <Layout>
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <DogDetailsPage />
                      </Suspense>
                    </ErrorBoundary>
                  </Layout>
                }
              />
            </Route>
          </Routes>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Main App component wrapped with ThemeContext
function App() {
  return (
    <CustomThemeProvider>
      <AppWithTheme />
    </CustomThemeProvider>
  );
}

export default App; 