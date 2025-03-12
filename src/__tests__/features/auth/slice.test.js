import authReducer, { login, logout, clearError } from '../../../features/auth/slice';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock authService
jest.mock('../../../services/authService', () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

describe('Auth Slice', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should return the initial state', () => {
    // Mock localStorage to return null (no user)
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    const initialState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
    
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle clearError action', () => {
    const previousState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Some error',
    };
    
    expect(authReducer(previousState, clearError())).toEqual({
      ...previousState,
      error: null,
    });
  });

  it('should handle login.pending action', () => {
    const previousState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
    
    expect(authReducer(previousState, { type: login.pending.type })).toEqual({
      ...previousState,
      isLoading: true,
    });
  });

  it('should handle login.fulfilled action', () => {
    const previousState = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
    };
    
    const user = { name: 'Test User', email: 'test@example.com' };
    
    expect(
      authReducer(previousState, { 
        type: login.fulfilled.type, 
        payload: user
      })
    ).toEqual({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'fetch_dog_finder_user',
      JSON.stringify(user)
    );
  });

  it('should handle login.rejected action', () => {
    const previousState = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
    };
    
    const errorMessage = 'Invalid credentials';
    
    expect(
      authReducer(previousState, { 
        type: login.rejected.type, 
        payload: errorMessage
      })
    ).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: errorMessage,
    });
  });

  it('should handle logout.pending action', () => {
    const previousState = {
      user: { name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    
    expect(authReducer(previousState, { type: logout.pending.type })).toEqual({
      ...previousState,
      isLoading: true,
    });
  });

  it('should handle logout.fulfilled action', () => {
    const previousState = {
      user: { name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: true,
      error: null,
    };
    
    expect(authReducer(previousState, { type: logout.fulfilled.type })).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('should handle logout.rejected action', () => {
    const previousState = {
      user: { name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: true,
      error: null,
    };
    
    const errorMessage = 'Logout failed';
    
    expect(
      authReducer(previousState, { 
        type: logout.rejected.type, 
        payload: errorMessage
      })
    ).toEqual({
      ...previousState,
      isLoading: false,
      error: errorMessage,
    });
  });
}); 