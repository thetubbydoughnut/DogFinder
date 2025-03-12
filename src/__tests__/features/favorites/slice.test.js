import favoritesReducer, { 
  addToFavorites, 
  removeFromFavorites,
  clearFavorites,
  clearMatch,
  getFavoriteDogs,
  generateMatch
} from '../../../features/favorites/slice';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock dogService
jest.mock('../../../services/dogService', () => ({
  getDogsByIds: jest.fn(),
  generateMatch: jest.fn(),
}));

describe('Favorites Slice', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should return the initial state', () => {
    // Mock localStorage to return null (no favorites)
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    const initialState = {
      favorites: [],
      favoriteDogs: [],
      match: null,
      isLoading: false,
      error: null,
    };
    
    expect(favoritesReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle addToFavorites action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2'],
      favoriteDogs: [],
      match: null,
      isLoading: false,
      error: null,
    };
    
    const newDogId = 'dog3';
    
    expect(favoritesReducer(previousState, addToFavorites(newDogId))).toEqual({
      ...previousState,
      favorites: ['dog1', 'dog2', 'dog3'],
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'fetch_dog_finder_favorites',
      JSON.stringify(['dog1', 'dog2', 'dog3'])
    );
  });

  it('should not add duplicate to favorites', () => {
    const previousState = {
      favorites: ['dog1', 'dog2'],
      favoriteDogs: [],
      match: null,
      isLoading: false,
      error: null,
    };
    
    const existingDogId = 'dog1';
    
    expect(favoritesReducer(previousState, addToFavorites(existingDogId))).toEqual({
      ...previousState,
      favorites: ['dog1', 'dog2'], // Should remain unchanged
    });
  });

  it('should handle removeFromFavorites action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2', 'dog3'],
      favoriteDogs: [],
      match: null,
      isLoading: false,
      error: null,
    };
    
    const dogIdToRemove = 'dog2';
    
    expect(favoritesReducer(previousState, removeFromFavorites(dogIdToRemove))).toEqual({
      ...previousState,
      favorites: ['dog1', 'dog3'],
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'fetch_dog_finder_favorites',
      JSON.stringify(['dog1', 'dog3'])
    );
  });

  it('should handle clearFavorites action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2', 'dog3'],
      favoriteDogs: [{ id: 'dog1' }, { id: 'dog2' }, { id: 'dog3' }],
      match: 'dog1',
      isLoading: false,
      error: null,
    };
    
    expect(favoritesReducer(previousState, clearFavorites())).toEqual({
      ...previousState,
      favorites: [],
      favoriteDogs: [],
      match: null,
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('fetch_dog_finder_favorites');
  });

  it('should handle clearMatch action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2', 'dog3'],
      favoriteDogs: [],
      match: 'dog1',
      isLoading: false,
      error: null,
    };
    
    expect(favoritesReducer(previousState, clearMatch())).toEqual({
      ...previousState,
      match: null,
    });
  });

  it('should handle getFavoriteDogs.pending action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2', 'dog3'],
      favoriteDogs: [],
      match: null,
      isLoading: false,
      error: null,
    };
    
    expect(favoritesReducer(previousState, { type: getFavoriteDogs.pending.type })).toEqual({
      ...previousState,
      isLoading: true,
      error: null,
    });
  });

  it('should handle getFavoriteDogs.fulfilled action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2', 'dog3'],
      favoriteDogs: [],
      match: null,
      isLoading: true,
      error: null,
    };
    
    const dogs = [
      { id: 'dog1', name: 'Rex' },
      { id: 'dog2', name: 'Buddy' },
      { id: 'dog3', name: 'Max' }
    ];
    
    expect(
      favoritesReducer(previousState, { 
        type: getFavoriteDogs.fulfilled.type, 
        payload: dogs 
      })
    ).toEqual({
      ...previousState,
      favoriteDogs: dogs,
      isLoading: false,
    });
  });

  it('should handle getFavoriteDogs.rejected action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2', 'dog3'],
      favoriteDogs: [],
      match: null,
      isLoading: true,
      error: null,
    };
    
    const errorMessage = 'Failed to fetch favorite dogs';
    
    expect(
      favoritesReducer(previousState, { 
        type: getFavoriteDogs.rejected.type, 
        payload: errorMessage 
      })
    ).toEqual({
      ...previousState,
      isLoading: false,
      error: errorMessage,
    });
  });

  it('should handle generateMatch.pending action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2', 'dog3'],
      favoriteDogs: [],
      match: null,
      isLoading: false,
      error: null,
    };
    
    expect(favoritesReducer(previousState, { type: generateMatch.pending.type })).toEqual({
      ...previousState,
      isLoading: true,
      error: null,
    });
  });

  it('should handle generateMatch.fulfilled action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2', 'dog3'],
      favoriteDogs: [],
      match: null,
      isLoading: true,
      error: null,
    };
    
    const matchedDogId = 'dog2';
    
    expect(
      favoritesReducer(previousState, { 
        type: generateMatch.fulfilled.type, 
        payload: matchedDogId 
      })
    ).toEqual({
      ...previousState,
      match: matchedDogId,
      isLoading: false,
    });
  });

  it('should handle generateMatch.rejected action', () => {
    const previousState = {
      favorites: ['dog1', 'dog2', 'dog3'],
      favoriteDogs: [],
      match: null,
      isLoading: true,
      error: null,
    };
    
    const errorMessage = 'Failed to generate match';
    
    expect(
      favoritesReducer(previousState, { 
        type: generateMatch.rejected.type, 
        payload: errorMessage 
      })
    ).toEqual({
      ...previousState,
      isLoading: false,
      error: errorMessage,
    });
  });
}); 