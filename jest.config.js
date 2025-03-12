module.exports = {
  // The root of your source code, typically /src
  roots: ['<rootDir>/src'],
  
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest and babel for JSX
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Test spec file resolution pattern
  testMatch: ['**/__tests__/**/*.test.(js|jsx|ts|tsx)'],
  
  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Module name mapper for CSS imports
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^axios$': '<rootDir>/src/__mocks__/axios.js',
  },
  
  // Mock axios
  modulePathIgnorePatterns: ['node_modules'],
  
  // Environment setup file
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  
  // Skip node_modules, but make exception for Axios
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)',
  ],
}; 