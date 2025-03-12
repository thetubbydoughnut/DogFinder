import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDogsByIds } from '../../api/dogsApi';

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

// Thunk to fetch dogs by IDs
export const getFavoriteDogs = createAsyncThunk(
  'favorites/getFavoriteDogs',
  async (dogIds, { rejectWithValue }) => {
    try {
      const dogs = await getDogsByIds(dogIds);
      return dogs;
    } catch (error) {
      return rejectWithValue('Failed to fetch favorite dogs. Please try again later.');
    }
  }
);

// Thunk to generate a match from favorite dogs
export const generateMatch = createAsyncThunk(
  'favorites/generateMatch',
  async (favoriteIds, { rejectWithValue }) => {
    try {
      // If there are no favorites, reject
      if (!favoriteIds || favoriteIds.length === 0) {
        return rejectWithValue('No favorite dogs to match with.');
      }

      // Need at least 2 dogs to generate a match
      if (favoriteIds.length < 2) {
        return rejectWithValue('Need at least 2 favorite dogs to generate a match.');
      }

      // Simulate a backend match generation by selecting a random dog from favorites
      const randomIndex = Math.floor(Math.random() * favoriteIds.length);
      const matchedDogId = favoriteIds[randomIndex];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return matchedDogId;
    } catch (error) {
      return rejectWithValue('Failed to generate match. Please try again later.');
    }
  }
);

// Favorites slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Add dog to favorites
    addToFavorites: (state, action) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        // Store in localStorage
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
      }
    },
    // Remove dog from favorites
    removeFromFavorites: (state, action) => {
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
        state.error = action.payload || 'Failed to load favorite dogs';
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
        state.error = action.payload || 'Failed to generate match';
      });
  },
});

// Export actions and reducer
export const {
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  clearMatch,
} = favoritesSlice.actions;
export default favoritesSlice.reducer; 