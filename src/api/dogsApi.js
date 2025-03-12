import axios from 'axios';

// Base URL for the Dogs API
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Get a list of dog breeds
 * @returns {Promise<string[]>} A list of dog breed names
 */
export const getBreeds = async () => {
  try {
    const response = await api.get('/dogs/breeds');
    return response.data;
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    throw error;
  }
};

/**
 * Search for dogs with filters
 * @param {Object} filters - The search filters
 * @param {number} page - The page number
 * @param {number} size - The page size
 * @param {string} sort - Sort field and direction (e.g., 'breed:asc')
 * @returns {Promise<Object>} Object containing ids, total, and next/prev cursor
 */
export const searchDogs = async (filters = {}, page = 0, size = 25, sort = '') => {
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
};

/**
 * Get dog details by IDs
 * @param {string[]} ids - Array of dog IDs to fetch
 * @returns {Promise<Array>} Array of dog objects
 */
export const getDogsByIds = async (ids) => {
  if (!ids || ids.length === 0) {
    return [];
  }
  
  try {
    const response = await api.post('/dogs', ids);
    return response.data;
  } catch (error) {
    console.error('Error fetching dogs by IDs:', error);
    throw error;
  }
};

/**
 * Login to the API
 * @param {Object} credentials - The user credentials
 * @returns {Promise<Object>} The user data
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Logout from the API
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export default api; 