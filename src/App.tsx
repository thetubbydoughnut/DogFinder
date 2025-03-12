import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import store from './store';

// Pages
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            
            {/* Protected Routes - wrapped in Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/search" element={<SearchPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App; 