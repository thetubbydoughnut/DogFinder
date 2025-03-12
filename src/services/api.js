import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true,
});

export default api; 