import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dogService from '../../services/dogService';

// Local storage key for favorites
const FAVORITES_KEY = 'fetch_dog_finder_favorites';

// Get favorites from localStorage
const getStoredFavorites = () => {
  const storedFavorites = localStorage.getItem(FAVORITES_KEY);
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

// Initial state
const initialState = {
  favorites: getStoredFavorites(),
  favoriteDogs: [],
  match: null,
  isLoading: false,
  error: null,
};

// Get favorite dogs by IDs
export const getFavoriteDogs = createAsyncThunk(
  'favorites/getFavoriteDogs',
  async (favoriteIds, { rejectWithValue }) => {
    try {
      // If no favorites, return empty array
      if (!favoriteIds.length) return [];
      
      const response = await dogService.getDogsByIds(favoriteIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch favorite dogs'
      );
    }
  }
);

// Generate match
export const generateMatch = createAsyncThunk(
  'favorites/generateMatch',
  async (favoriteIds, { rejectWithValue }) => {
    try {
      const response = await dogService.generateMatch(favoriteIds);
      return response.data.match;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to generate match'
      );
    }
  }
);

// Favorites slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Add dog to favorites
    addFavorite: (state, action) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        // Store in localStorage
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
      }
    },
    // Remove dog from favorites
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
      // Store in localStorage
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
    },
    // Clear all favorites
    clearFavorites: (state) => {
      state.favorites = [];
      state.favoriteDogs = [];
      state.match = null;
      // Clear from localStorage
      localStorage.removeItem(FAVORITES_KEY);
    },
    // Clear match
    clearMatch: (state) => {
      state.match = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get favorite dogs cases
      .addCase(getFavoriteDogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFavoriteDogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteDogs = action.payload;
      })
      .addCase(getFavoriteDogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Generate match cases
      .addCase(generateMatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.match = action.payload;
      })
      .addCase(generateMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {
  addFavorite,
  removeFavorite,
  clearFavorites,
  clearMatch,
} = favoritesSlice.actions;
export default favoritesSlice.reducer; 