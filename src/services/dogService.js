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
      const response = await api.post('/dogs/search', {
        ...filters,
        size,
        from: page * size,
        sort: sort ? sort.split(':') : undefined
      });
      
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