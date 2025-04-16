// import api from './api'; // No longer needed

// Mock authentication services
const authService = {
  // Mock Login - returns a successful promise with mock user data
  login: async (name, email) => {
    console.log(`Mock Login attempt: name=${name}, email=${email}`);
    // Basic validation simulation
    if (!name || !email || !email.includes('@')) {
      throw new Error('Mock Error: Invalid name or email');
    }
    // Return mock user data on success
    return { name: name, email: email }; 
  },
  
  // Mock Logout - returns a successful promise
  logout: async () => {
    console.log('Mock Logout successful');
    return Promise.resolve(); // Indicate success
  }
};

export default authService; 