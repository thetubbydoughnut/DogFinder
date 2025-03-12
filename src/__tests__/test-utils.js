import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';

// Import the real reducer slices to make tests more accurate
import authReducer from '../features/auth/slice';
import dogsReducer from '../features/dogs/slice';
import favoritesReducer from '../features/favorites/slice';

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
      // Redux Toolkit includes thunk middleware by default
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

// Add a simple test to prevent this file from being treated as a test suite without tests
describe('test-utils', () => {
  it('exports a render function', () => {
    expect(typeof render).toBe('function');
  });
}); 