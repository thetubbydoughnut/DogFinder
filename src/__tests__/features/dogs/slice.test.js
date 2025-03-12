import dogsReducer, { 
  fetchDogs, 
  getBreeds,
  setFilters,
  setPage,
  setPageSize,
  setSortOption
} from '../../../features/dogs/slice';

// Mock dogService
jest.mock('../../../services/dogService', () => ({
  getBreeds: jest.fn(),
  searchDogs: jest.fn(),
  getDogsByIds: jest.fn(),
}));

describe('Dogs Slice', () => {
  it('should return the initial state', () => {
    const initialState = {
      dogs: [],
      breeds: [],
      resultIds: [],
      sortOption: '',
      filters: {
        breeds: [],
        ageMin: undefined,
        ageMax: undefined,
        zipCodes: undefined,
      },
      isLoading: false,
      isLoadingBreeds: false,
      error: null,
      total: 0,
      page: 0,
      pageSize: 25,
      prev: null,
      next: null
    };
    
    expect(dogsReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle setFilters action', () => {
    const previousState = {
      dogs: [],
      breeds: [],
      total: 0,
      page: 1, // This should be reset to 0 when filters change
      pageSize: 25,
      filters: { breed: 'Labrador' },
      sortOption: '',
      isLoading: false,
      error: null,
      resultIds: [],
      next: null,
      prev: null,
    };
    
    const newFilters = { 
      breed: 'Golden Retriever',
      ageMin: 1,
      ageMax: 5
    };
    
    expect(dogsReducer(previousState, setFilters(newFilters))).toEqual({
      ...previousState,
      filters: newFilters,
      page: 0, // Reset to first page
    });
  });

  it('should handle setPage action', () => {
    const previousState = {
      dogs: [],
      breeds: [],
      total: 100,
      page: 0,
      pageSize: 25,
      filters: {},
      sortOption: '',
      isLoading: false,
      error: null,
      resultIds: [],
      next: null,
      prev: null,
    };
    
    expect(dogsReducer(previousState, setPage(2))).toEqual({
      ...previousState,
      page: 2,
    });
  });

  it('should handle setPageSize action', () => {
    const previousState = {
      dogs: [],
      breeds: [],
      total: 100,
      page: 2,
      pageSize: 25,
      filters: {},
      sortOption: '',
      isLoading: false,
      error: null,
      resultIds: [],
      next: null,
      prev: null,
    };
    
    expect(dogsReducer(previousState, setPageSize(50))).toEqual({
      ...previousState,
      pageSize: 50,
      page: 0, // Should reset to first page
    });
  });

  it('should handle setSortOption action', () => {
    const previousState = {
      dogs: [],
      breeds: [],
      total: 100,
      page: 0,
      pageSize: 25,
      filters: {},
      sortOption: 'breed:asc',
      isLoading: false,
      error: null,
      resultIds: [],
      next: null,
      prev: null,
    };
    
    expect(dogsReducer(previousState, setSortOption('age:desc'))).toEqual({
      ...previousState,
      sortOption: 'age:desc',
    });
  });

  it('should handle fetchDogs.pending action', () => {
    const previousState = {
      dogs: [{ id: '1', name: 'Rex' }],
      breeds: [],
      total: 1,
      page: 0,
      pageSize: 25,
      filters: {},
      sortOption: '',
      isLoading: false,
      error: null,
      resultIds: [],
      next: null,
      prev: null,
    };
    
    expect(dogsReducer(previousState, { type: fetchDogs.pending.type })).toEqual({
      ...previousState,
      isLoading: true,
      error: null,
    });
  });

  it('should handle fetchDogs.fulfilled action', () => {
    const previousState = {
      dogs: [],
      total: 0,
      page: 0,
      pageSize: 25,
      filters: {},
      sortOption: '',
      isLoading: true,
      error: null,
      resultIds: [],
      prev: null,
      next: null
    };
    
    const payload = {
      dogs: [
        { id: '1', name: 'Max', breed: 'Labrador' },
        { id: '2', name: 'Buddy', breed: 'Golden Retriever' }
      ],
      total: 2,
      resultIds: [],
      page: 0,
      prev: null,
      next: null
    };
    
    expect(
      dogsReducer(previousState, { 
        type: fetchDogs.fulfilled.type, 
        payload
      })
    ).toEqual({
      ...previousState,
      dogs: payload.dogs,
      total: payload.total,
      resultIds: payload.resultIds,
      page: payload.page,
      prev: payload.prev,
      next: payload.next,
      isLoading: false
    });
  });

  it('should handle fetchDogs.rejected action', () => {
    const previousState = {
      dogs: [],
      breeds: [],
      total: 0,
      page: 0,
      pageSize: 25,
      filters: {},
      sortOption: '',
      isLoading: true,
      error: null,
      resultIds: [],
      next: null,
      prev: null,
    };
    
    const errorMessage = 'Failed to fetch dogs';
    
    expect(
      dogsReducer(previousState, { 
        type: fetchDogs.rejected.type, 
        payload: errorMessage 
      })
    ).toEqual({
      ...previousState,
      isLoading: false,
      error: errorMessage,
    });
  });

  it('should handle getBreeds.fulfilled action', () => {
    const previousState = {
      dogs: [],
      total: 0,
      page: 0,
      pageSize: 25,
      filters: {},
      sortOption: '',
      isLoading: false,
      error: null,
      resultIds: [],
      next: null,
      prev: null,
    };
    
    const breeds = ['Labrador', 'Golden Retriever', 'Poodle'];
    
    expect(
      dogsReducer(previousState, { 
        type: getBreeds.fulfilled.type, 
        payload: breeds 
      })
    ).toEqual({
      ...previousState,
      breeds,
      isLoadingBreeds: false
    });
  });
}); 