import api from './api';

// Dog services
const dogService = {
  // Get all dog breeds
  getBreeds: async () => {
    return api.get('/dogs/breeds');
  },
  
  // Search dogs with filters
  searchDogs: async (params) => {
    return api.get('/dogs/search', { params });
  },
  
  // Get dogs by IDs
  getDogsByIds: async (ids) => {
    return api.post('/dogs', ids);
  },
  
  // Generate a match
  generateMatch: async (favoriteIds) => {
    return api.post('/dogs/match', favoriteIds);
  },
  
  // Get locations by ZIP codes
  getLocationsByZip: async (zipCodes) => {
    return api.post('/locations', zipCodes);
  },
  
  // Search locations
  searchLocations: async (searchParams) => {
    return api.post('/locations/search', searchParams);
  }
};

export default dogService; 