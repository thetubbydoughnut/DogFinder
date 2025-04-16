import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import dogService from '../../services/dogService';

// Fetch dogs with filters
export const fetchDogs = createAsyncThunk(
  'dogs/fetchDogs',
  async ({ filters, page, size, sort }, { rejectWithValue }) => { // Removed getState if not needed
    try {
      const sortOption = sort || 'breed:asc';
      const searchResults = await dogService.searchDogs(filters, page, size, sortOption);
      
      if (!searchResults.resultIds || searchResults.resultIds.length === 0) {
        return { dogs: [], total: 0, resultIds: [], next: null, prev: null, usingCachedData: false };
      }
      
      const dogs = await dogService.getDogsByIds(searchResults.resultIds);
      
      return {
        dogs,
        total: searchResults.total,
        resultIds: searchResults.resultIds,
        next: searchResults.next,
        prev: searchResults.prev,
        usingCachedData: false // Cache fallback removed
      };
    } catch (error) {
      console.error('Error in fetchDogs thunk:', error);
      // Simplified error handling without cache fallback
      return rejectWithValue(
        error.message || 'Failed to fetch dogs. Please try again later.'
      );
    }
  }
);

// Fetch all available dog breeds
export const getBreeds = createAsyncThunk(
  'dogs/getBreeds',
  async (_, { rejectWithValue }) => {
    try {
      const breeds = await dogService.getBreeds();
      return breeds;
    } catch (error) {
      console.error('Error fetching breeds:', error);
      // Simplified error handling without cache fallback
      return rejectWithValue(
        error.message || 'Failed to fetch breeds. Please try again later.'
      );
    }
  }
);

const dogsSlice = createSlice({
  name: 'dogs',
  initialState: {
    dogs: [],
    resultIds: [],
    total: 0,
    breeds: [],
    filters: {
      breeds: [],
      ageMin: undefined,
      ageMax: undefined,
      zipCodes: undefined,
    },
    sortOption: '',
    dogStatus: 'idle',
    breedStatus: 'idle',
    error: null,
    page: 0,
    next: null,
    prev: null,
    pageSize: 25,
    usingCachedData: false
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...action.payload };
      state.page = 0;
      state.dogStatus = 'idle';
    },
    clearFilters: (state) => {
      state.filters = {
        breeds: [],
        ageMin: undefined,
        ageMax: undefined,
        zipCodes: undefined,
      };
      state.page = 0;
      state.dogStatus = 'idle';
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
      state.dogStatus = 'idle';
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 0;
      state.dogStatus = 'idle';
    },
    clearCachedDataFlag: (state) => {
      state.usingCachedData = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDogs.pending, (state) => {
        state.dogStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.dogStatus = 'succeeded';
        state.dogs = action.payload.dogs;
        state.total = action.payload.total;
        state.resultIds = action.payload.resultIds;
        state.next = action.payload.next;
        state.prev = action.payload.prev;
        state.usingCachedData = action.payload.usingCachedData || false;
        state.error = null;
      })
      .addCase(fetchDogs.rejected, (state, action) => {
        state.dogStatus = 'failed';
        state.error = action.payload || action.error.message || 'Failed to fetch dogs';
      })
      .addCase(getBreeds.pending, (state) => {
        state.breedStatus = 'loading';
        state.error = null;
      })
      .addCase(getBreeds.fulfilled, (state, action) => {
        state.breedStatus = 'succeeded';
        state.breeds = action.payload;
        state.error = null;
      })
      .addCase(getBreeds.rejected, (state, action) => {
        state.breedStatus = 'failed';
        state.error = action.payload || action.error.message || 'Failed to fetch breeds';
      });
  }
});

export const { 
  setFilters, 
  clearFilters, 
  setSortOption, 
  setPage, 
  setPageSize,
  clearCachedDataFlag,
} = dogsSlice.actions;

export default dogsSlice.reducer;

// Selectors
const selectDogsState = (state) => state.dogs;

// Basic selectors for parts of the state
export const selectAllDogItems = (state) => state.dogs.dogs;
export const selectDogFilters = (state) => state.dogs.filters;
export const selectDogPagination = (state) => ({
  page: state.dogs.page,
  pageSize: state.dogs.pageSize,
  total: state.dogs.total,
});
export const selectDogSortOption = (state) => state.dogs.sortOption;
export const selectIsLoadingDogs = (state) => state.dogs.dogStatus === 'loading';
export const selectIsLoadingBreeds = (state) => state.dogs.breedStatus === 'loading';
export const selectDogError = (state) => state.dogs.error;
export const selectUsingCachedData = (state) => state.dogs.usingCachedData;
export const selectAllBreeds = (state) => state.dogs.breeds;
export const selectBreedStatus = (state) => state.dogs.breedStatus;

// Memoized selector for combined loading and error status
export const selectDogLoadingState = createSelector(
  [selectIsLoadingDogs, selectDogError],
  (isLoading, error) => ({
    isLoading,
    error,
  })
);

// Memoized selector for filtered dogs (example - logic might need refinement based on actual state)
export const selectFilteredDogs = createSelector(
  [selectAllDogItems],
  (items) => {
    return items; 
  }
);

// Memoized selector for pagination state.
export const selectPagination = createSelector(
  [selectDogsState],
  (dogsState) => ({
    page: dogsState.page,
    pageSize: dogsState.pageSize,
    total: dogsState.total, 
  })
); 