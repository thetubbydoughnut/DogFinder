import { configureStore } from '@reduxjs/toolkit';

// Store setup with placeholders for reducers that will be added later
const store = configureStore({
  reducer: {
    // Reducers will be added as development progresses
    // auth: authReducer,
    // dogs: dogsReducer,
    // favorites: favoritesReducer,
    // ui: uiReducer
  }
});

// Export store hooks for typing
export * from './hooks';
export default store; 