import api from './api';

// Authentication services
const authService = {
  // Login with name and email
  login: async (name, email) => {
    return api.post('/auth/login', { name, email });
  },
  
  // Logout - invalidate the auth cookie
  logout: async () => {
    return api.post('/auth/logout');
  }
};

export default authService; 