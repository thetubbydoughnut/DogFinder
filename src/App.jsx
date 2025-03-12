import React, { lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import theme from './theme';
import store from './store';
import LoginPage from './pages/LoginPage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy load pages for better performance
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
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <SearchPage />
                        </Suspense>
                      </Layout>
                    }
                  />
                  <Route
                    path="/favorites"
                    element={
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <FavoritesPage />
                        </Suspense>
                      </Layout>
                    }
                  />
                  <Route
                    path="/dogs/:id"
                    element={
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <DogDetailsPage />
                        </Suspense>
                      </Layout>
                    }
                  />
                </Route>
              </Routes>
            </Box>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App; 