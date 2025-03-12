import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import theme from './theme';
import store from './store';
import { Box } from '@mui/material';

// Pages
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

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
                        <SearchPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/favorites"
                    element={
                      <Layout>
                        <FavoritesPage />
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