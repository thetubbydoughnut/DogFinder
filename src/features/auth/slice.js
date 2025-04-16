import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Local storage keys
const USER_KEY = 'fetch_dog_finder_user';

// Get user from localStorage
const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

// Initial state
const initialState = {
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  isLoading: false,
  error: null,
};

// Login async thunk
export const login = createAsyncThunk(
  'auth/login',
  async ({ name, email }, { rejectWithValue }) => {
    try {
      await authService.login(name, email);
      return { name, email };
    } catch (error) {
      // Log the full error for debugging purposes
      console.error('Login failed:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Authentication failed'
      );
    }
  }
);

// Logout async thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem(USER_KEY);
      return null;
    } catch (error) {
      // Log the full error for debugging purposes
      console.error('Logout failed:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear any auth errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        // Store user in localStorage for persistence
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError } = authSlice.actions;
export default authSlice.reducer; 