import React, { lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import theme from './theme';
import Layout from './components/layout/Layout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';

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

function App() {
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

export default App; 