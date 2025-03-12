import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dogService from '../../services/dogService';

// Initial state
const initialState = {
  dogs: [],
  breeds: [],
  totalDogs: 0,
  currentPage: 1,
  searchParams: {
    breeds: [],
    ageMin: null,
    ageMax: null,
    zipCodes: [],
    size: 25,
    from: null,
    sort: 'breed:asc'
  },
  isLoading: false,
  error: null,
  cursor: {
    next: null,
    prev: null
  }
};

// Get all breeds
export const getBreeds = createAsyncThunk(
  'dogs/getBreeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dogService.getBreeds();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch breeds'
      );
    }
  }
);

// Search dogs
export const searchDogs = createAsyncThunk(
  'dogs/searchDogs',
  async (searchParams, { rejectWithValue }) => {
    try {
      const searchResponse = await dogService.searchDogs(searchParams);
      if (!searchResponse.data.resultIds.length) {
        return {
          dogs: [],
          totalDogs: 0,
          cursor: {
            next: null,
            prev: null
          }
        };
      }
      
      // Fetch dogs by IDs
      const dogsResponse = await dogService.getDogsByIds(
        searchResponse.data.resultIds
      );
      
      return {
        dogs: dogsResponse.data,
        totalDogs: searchResponse.data.total,
        cursor: {
          next: searchResponse.data.next,
          prev: searchResponse.data.prev
        }
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search dogs'
      );
    }
  }
);

// Dogs slice
const dogsSlice = createSlice({
  name: 'dogs',
  initialState,
  reducers: {
    // Update search params
    updateSearchParams: (state, action) => {
      state.searchParams = {
        ...state.searchParams,
        ...action.payload
      };
    },
    // Clear search params
    clearSearchParams: (state) => {
      state.searchParams = initialState.searchParams;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get breeds cases
      .addCase(getBreeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBreeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.breeds = action.payload;
      })
      .addCase(getBreeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search dogs cases
      .addCase(searchDogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchDogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dogs = action.payload.dogs;
        state.totalDogs = action.payload.totalDogs;
        state.cursor = action.payload.cursor;
      })
      .addCase(searchDogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { updateSearchParams, clearSearchParams } = dogsSlice.actions;
export default dogsSlice.reducer; 