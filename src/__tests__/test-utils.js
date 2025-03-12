import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';

// Import reducers - we'll directly import to avoid circular dependencies
const authReducer = (state = { isAuthenticated: false, user: null, isLoading: false, error: null }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const dogsReducer = (state = { dogs: [], isLoading: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const favoritesReducer = (state = { favorites: [], favoriteDogs: [], match: null, isLoading: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

function render(
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        auth: authReducer,
        dogs: dogsReducer,
        favorites: favoritesReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
  }
  return {
    store,
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything from react-testing-library
export * from '@testing-library/react';

// Override render method
export { render }; 