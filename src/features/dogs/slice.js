import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import dogService from '../../services/dogService';
import cacheService from '../../services/cacheService';

// Fetch dogs with filters
export const fetchDogs = createAsyncThunk(
  'dogs/fetchDogs',
  async ({ filters, page, size, sort }, { rejectWithValue, getState }) => {
    try {
      // Ensure sort has a default value if not provided
      const sortOption = sort || 'breed:asc';
      
      // Call the search API to get dog IDs
      const searchResults = await dogService.searchDogs(filters, page, size, sortOption);
      
      if (!searchResults.resultIds || searchResults.resultIds.length === 0) {
        return {
          dogs: [],
          total: 0,
          resultIds: [],
          next: null,
          prev: null,
          usingCachedData: false
        };
      }
      
      // Fetch details for each dog ID
      const dogs = await dogService.getDogsByIds(searchResults.resultIds);
      
      return {
        dogs,
        total: searchResults.total,
        resultIds: searchResults.resultIds,
        next: searchResults.next,
        prev: searchResults.prev,
        usingCachedData: false
      };
    } catch (error) {
      console.error('Error in fetchDogs thunk:', error);
      
      // Attempt to use cached data as fallback
      try {
        // First try to get the cached search results
        const params = {
          ...filters,
          size,
          from: page * size,
          sort: sort || 'breed:asc'
        };
        
        const cachedSearchResults = cacheService.getCachedDogSearch(params);
        
        if (cachedSearchResults && cachedSearchResults.resultIds && cachedSearchResults.resultIds.length > 0) {
          // If we have cached search results, try to get cached dog details
          const cachedDogs = cacheService.getCachedDogsByIds(cachedSearchResults.resultIds);
          
          if (cachedDogs && cachedDogs.length > 0) {
            console.log('Using cached dogs data as fallback due to API error');
            return {
              dogs: cachedDogs,
              total: cachedSearchResults.total || cachedDogs.length,
              resultIds: cachedSearchResults.resultIds,
              next: cachedSearchResults.next,
              prev: cachedSearchResults.prev,
              usingCachedData: true
            };
          }
        }
      } catch (cacheError) {
        console.error('Error using cache fallback:', cacheError);
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to fetch dogs. Please try again later.'
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
      // Attempt to use cached breeds as fallback
      const cachedBreeds = cacheService.getCachedBreeds();
      if (cachedBreeds && cachedBreeds.length > 0) {
        console.log('Using cached breeds as fallback due to API error');
        return cachedBreeds;
      }
      
      return rejectWithValue('Failed to fetch breeds. Please try again later.');
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
    isLoading: false,
    isLoadingBreeds: false,
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
      state.page = 0; // Reset page on filter change
    },
    clearFilters: (state) => {
      state.filters = {
        breeds: [],
        ageMin: undefined,
        ageMax: undefined,
        zipCodes: undefined,
      };
      state.page = 0;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 0; // Reset page when changing page size
    },
    clearCachedDataFlag: (state) => {
      state.usingCachedData = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchDogs reducers
      .addCase(fetchDogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dogs = action.payload.dogs;
        state.total = action.payload.total;
        state.resultIds = action.payload.resultIds;
        state.next = action.payload.next;
        state.prev = action.payload.prev;
        state.usingCachedData = action.payload.usingCachedData || false;
      })
      .addCase(fetchDogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch dogs';
        state.dogs = [];
      })
      // getBreeds reducers
      .addCase(getBreeds.pending, (state) => {
        state.isLoadingBreeds = true;
        state.error = null;
      })
      .addCase(getBreeds.fulfilled, (state, action) => {
        state.isLoadingBreeds = false;
        state.breeds = action.payload;
      })
      .addCase(getBreeds.rejected, (state, action) => {
        state.isLoadingBreeds = false;
        state.error = action.payload || 'Failed to fetch breeds';
      });
  }
});

export const { 
  setFilters, 
  clearFilters, 
  setSortOption, 
  setPage, 
  setPageSize,
  clearCachedDataFlag
} = dogsSlice.actions;

export default dogsSlice.reducer;

// Selectors
export const selectDogs = state => state.dogs.dogs;
export const selectBreeds = state => state.dogs.breeds;
export const selectFilters = state => state.dogs.filters;
export const selectSortOption = state => state.dogs.sortOption;
export const selectIsLoading = state => state.dogs.isLoading;
export const selectIsLoadingBreeds = state => state.dogs.isLoadingBreeds;
export const selectTotal = state => state.dogs.total;
export const selectPage = state => state.dogs.page;
export const selectPageSize = state => state.dogs.pageSize;
export const selectError = state => state.dogs.error;
export const selectUsingCachedData = state => state.dogs.usingCachedData;

export const selectPagination = state => ({
  page: state.dogs.page,
  pageSize: state.dogs.pageSize,
  total: state.dogs.total
});

// Memoized filtered and sorted dogs selector
export const selectFilteredDogs = createSelector(
  [selectDogs, selectFilters, selectSortOption],
  (dogs, filters, sortOption) => {
    // The selector will only recalculate when dogs, filters, or sortOption changes
    return dogs;
  }
); 