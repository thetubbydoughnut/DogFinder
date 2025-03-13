import api from './api';
import cacheService from './cacheService';

// Dog services
const dogService = {
  // Get all dog breeds
  getBreeds: async () => {
    try {
      // Check cache first
      const cachedBreeds = cacheService.getCachedBreeds();
      if (cachedBreeds) {
        return cachedBreeds;
      }
      
      // If not in cache, fetch from API
      const response = await api.get('/dogs/breeds');
      const breeds = response.data;
      
      // Store in cache
      cacheService.storeBreeds(breeds);
      
      return breeds;
    } catch (error) {
      console.error('Error fetching dog breeds:', error);
      
      // Check cache again for fallback on API error
      const cachedBreeds = cacheService.getCachedBreeds();
      if (cachedBreeds) {
        console.log('Using cached breeds data due to API error');
        return cachedBreeds;
      }
      
      throw error;
    }
  },
  
  // Search dogs with filters
  searchDogs: async (filters = {}, page = 0, size = 25, sort = '') => {
    // Prepare search params for cache key and API
    const params = {
      size,
      from: page * size
    };
    
    // Add filter parameters if present
    if (filters.breeds && filters.breeds.length > 0) {
      params.breeds = filters.breeds;
    }
    
    if (filters.zipCodes && filters.zipCodes.length > 0) {
      params.zipCodes = filters.zipCodes;
    }
    
    if (filters.ageMin !== undefined) {
      params.ageMin = filters.ageMin;
    }
    
    if (filters.ageMax !== undefined) {
      params.ageMax = filters.ageMax;
    }
    
    // Add sort parameter, defaulting to breed:asc if not provided
    params.sort = sort || 'breed:asc';
    
    try {
      // Check cache first
      const cachedSearchResults = cacheService.getCachedDogSearch(params);
      if (cachedSearchResults) {
        return cachedSearchResults;
      }
      
      // If not in cache, fetch from API
      const response = await api.get('/dogs/search', { params });
      
      const searchResults = {
        resultIds: response.data.resultIds,
        total: response.data.total,
        next: response.data.next,
        prev: response.data.prev
      };
      
      // Store in cache
      cacheService.storeDogSearch(params, searchResults);
      
      return searchResults;
    } catch (error) {
      console.error('Error searching dogs:', error);
      
      // Check cache again for fallback on API error
      const cachedSearchResults = cacheService.getCachedDogSearch(params);
      if (cachedSearchResults) {
        console.log('Using cached search results due to API error');
        return cachedSearchResults;
      }
      
      throw error;
    }
  },
  
  // Get dogs by IDs
  getDogsByIds: async (ids) => {
    try {
      if (!ids || ids.length === 0) {
        return [];
      }
      
      // Check cache first
      const cachedDogs = cacheService.getCachedDogsByIds(ids);
      if (cachedDogs) {
        return cachedDogs;
      }
      
      // If not in cache, fetch from API
      const response = await api.post('/dogs', ids);
      const dogs = response.data;
      
      // Store in cache
      cacheService.storeDogsByIds(ids, dogs);
      
      return dogs;
    } catch (error) {
      console.error('Error fetching dogs by IDs:', error);
      
      // Check cache again for fallback on API error
      const cachedDogs = cacheService.getCachedDogsByIds(ids);
      if (cachedDogs) {
        console.log('Using cached dogs data due to API error');
        return cachedDogs;
      }
      
      throw error;
    }
  },
  
  // Generate a match
  generateMatch: async (favoriteIds) => {
    try {
      const response = await api.post('/dogs/match', favoriteIds);
      return response.data;
    } catch (error) {
      console.error('Error generating match:', error);
      throw error;
    }
  },
  
  // Get locations by ZIP codes
  getLocationsByZip: async (zipCodes) => {
    try {
      if (!zipCodes || zipCodes.length === 0) {
        return [];
      }
      
      // Check cache first
      const cachedLocations = cacheService.getCachedLocations(zipCodes);
      if (cachedLocations) {
        return cachedLocations;
      }
      
      // If not in cache, fetch from API
      const response = await api.post('/locations', zipCodes);
      const locations = response.data;
      
      // Store in cache
      cacheService.storeLocations(zipCodes, locations);
      
      return locations;
    } catch (error) {
      console.error('Error fetching locations by ZIP:', error);
      
      // Check cache again for fallback on API error
      const cachedLocations = cacheService.getCachedLocations(zipCodes);
      if (cachedLocations) {
        console.log('Using cached locations data due to API error');
        return cachedLocations;
      }
      
      throw error;
    }
  },
  
  // Search locations
  searchLocations: async (searchParams) => {
    try {
      const response = await api.post('/locations/search', searchParams);
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },
  
  // Clear all dog-related caches
  clearCache: () => {
    cacheService.clearCache(cacheService.CACHE_CONFIG.DOGS_SEARCH);
    cacheService.clearCache(cacheService.CACHE_CONFIG.DOGS_BY_ID);
    cacheService.clearCache(cacheService.CACHE_CONFIG.BREEDS);
    console.log('Dog caches cleared');
  }
};

export default dogService; 