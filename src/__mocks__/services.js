// Mock API service
const api = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
};

// Mock auth service
const authService = {
  login: jest.fn(() => Promise.resolve({ data: {} })),
  logout: jest.fn(() => Promise.resolve({ data: {} })),
};

// Mock dog service
const dogService = {
  getBreeds: jest.fn(() => Promise.resolve([])),
  searchDogs: jest.fn(() => Promise.resolve({ resultIds: [], total: 0 })),
  getDogsByIds: jest.fn(() => Promise.resolve([])),
  generateMatch: jest.fn(() => Promise.resolve('')),
  getLocationsByZip: jest.fn(() => Promise.resolve([])),
};

module.exports = {
  api,
  authService,
  dogService,
}; 