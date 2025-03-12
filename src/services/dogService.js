import api from './api';

// Dog services
const dogService = {
  // Get all dog breeds
  getBreeds: async () => {
    try {
      const response = await api.get('/dogs/breeds');
      return response.data;
    } catch (error) {
      console.error('Error fetching dog breeds:', error);
      throw error;
    }
  },
  
  // Search dogs with filters
  searchDogs: async (filters = {}, page = 0, size = 25, sort = '') => {
    try {
      // Convert filters to query params
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
      
      const response = await api.get('/dogs/search', { params });
      
      return {
        resultIds: response.data.resultIds,
        total: response.data.total,
        next: response.data.next,
        prev: response.data.prev
      };
    } catch (error) {
      console.error('Error searching dogs:', error);
      throw error;
    }
  },
  
  // Get dogs by IDs
  getDogsByIds: async (ids) => {
    try {
      if (!ids || ids.length === 0) {
        return [];
      }
      const response = await api.post('/dogs', ids);
      return response.data;
    } catch (error) {
      console.error('Error fetching dogs by IDs:', error);
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
      const response = await api.post('/locations', zipCodes);
      return response.data;
    } catch (error) {
      console.error('Error fetching locations by ZIP:', error);
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
  }
};

export default dogService; 