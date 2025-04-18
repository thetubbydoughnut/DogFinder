// --- Data Storage (Loaded from Static JSON) ---
let allBreeds = [];
let allDogs = [];
let isDataLoaded = false;
let isDataLoading = false; // Flag to prevent multiple loads
let dataLoadPromise = null; // Promise to await ongoing load

/**
 * Fetches and caches the mock data from static JSON files.
 * @returns {Promise<void>} A promise that resolves when data is loaded.
 */
const loadMockData = async () => {
  if (isDataLoaded) return Promise.resolve(); // Already loaded
  if (isDataLoading) return dataLoadPromise; // Already loading, return existing promise

  isDataLoading = true;
  dataLoadPromise = (async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100)); 

      // Attempt to load static data first
      if (!allDogs || !allBreeds) {
        // console.log('Attempting to load mock data from static JSON...');
        await loadMockData();
      }

      // Use fetch API to load files from the /public directory
      const [breedsResponse, dogsResponse] = await Promise.all([
        fetch('/mock-data/breeds.json'),
        fetch('/mock-data/dogs.json')
      ]);

      if (!breedsResponse.ok) throw new Error(`Failed to load breeds.json: ${breedsResponse.statusText} (Status: ${breedsResponse.status})`);
      if (!dogsResponse.ok) throw new Error(`Failed to load dogs.json: ${dogsResponse.statusText} (Status: ${dogsResponse.status})`);

      allBreeds = await breedsResponse.json();
      allDogs = await dogsResponse.json();
      isDataLoaded = true; // Mark as loaded AFTER successful parsing
      // console.log(`Mock data loaded successfully: ${allBreeds.length} breeds, ${allDogs.length} dogs.`);

    } catch (error) {
      console.error('Error loading or accessing mock data:', error);
      // If loading fails, ensure we don't return partial data
      allDogs = [];
      allBreeds = [];
      throw new Error('Failed to load dog data. Please try again later.'); 
    } finally {
      isDataLoading = false; // Reset loading flag regardless of outcome
    }
  })();

  return dataLoadPromise;
};

// --- Dog Data Services using Static JSON ---

const dogService = {
  // Get list of breeds from loaded static JSON
  getBreeds: async () => {
    await loadMockData(); // Ensure data is loaded/loading completes
    return [...allBreeds]; // Return a copy
  },

  /**
   * Search dogs from loaded static JSON with filters/sorting/pagination.
   * @param {Object} filters - The search filters (breeds, ageMin, ageMax, zipCodes)
   * @param {number} page - The page number (0-indexed)
   * @param {number} size - The page size
   * @param {string} sort - Sort field and direction (e.g., 'breed:asc')
   * @returns {Promise<Object>} Object containing resultIds, total, and next/prev (mocked)
   */
  searchDogs: async (filters = {}, page = 0, size = 25, sort = '') => {
    await loadMockData(); // Ensure data is loaded/loading completes
    let dogs = [...allDogs]; // Work with a copy

    // Apply filters
    if (filters.breeds && filters.breeds.length > 0) {
      const breedSet = new Set(filters.breeds);
      dogs = dogs.filter(dog => dog && breedSet.has(dog.breed)); // Added check for dog object
    }
    if (filters.ageMin !== undefined) {
      dogs = dogs.filter(dog => dog && dog.age >= filters.ageMin);
    }
    if (filters.ageMax !== undefined) {
      dogs = dogs.filter(dog => dog && dog.age <= filters.ageMax);
    }
    if (filters.zipCodes && filters.zipCodes.length > 0) {
      const zipSet = new Set(filters.zipCodes);
      dogs = dogs.filter(dog => dog && zipSet.has(dog.zip_code));
    }

    // Apply sorting
    if (sort) {
      const [field, direction] = sort.split(':');
      dogs.sort((a, b) => {
        // Handle cases where dogs might be null/undefined if filtering failed unexpectedly
        if (!a) return 1;
        if (!b) return -1;

        let comparison = 0;
        const valA = a[field] ?? ''; 
        const valB = b[field] ?? '';

        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else {
          // Basic numeric comparison, assumes age is number
          if (valA < valB) comparison = -1;
          else if (valA > valB) comparison = 1;
        }
        return direction === 'desc' ? comparison * -1 : comparison;
      });
    }

    // Apply pagination
    const total = dogs.length;
    const start = page * size;
    const end = start + size;
    const paginatedDogs = dogs.slice(start, end);
    // Ensure dogs in the slice are valid before mapping
    const resultIds = paginatedDogs.filter(dog => dog && dog.id).map(dog => dog.id);

    // Mock API response structure (next/prev are simplified)
    return {
      resultIds,
      total,
      next: end < total ? `/dogs/search?from=${end}&size=${size}` : null,
      prev: start > 0 ? `/dogs/search?from=${Math.max(0, start - size)}&size=${size}` : null,
    };
  },

  /**
   * Get dog details by IDs from loaded static JSON.
   * @param {string[]} ids - Array of dog IDs to fetch
   * @returns {Promise<Array>} Array of dog objects
   */
  getDogsByIds: async (ids) => {
    await loadMockData(); // Ensure data is loaded/loading completes
    if (!ids || ids.length === 0) {
      return [];
    }
    
    // Create a map for efficient lookup
    const dogMap = new Map(allDogs.map(dog => [dog.id, dog]));
    
    // Map the input IDs to dog objects, preserving the order of IDs
    const orderedDogs = ids
      .map(id => dogMap.get(id)) // Get dog object from map using the ID
      .filter(dog => dog !== undefined); // Filter out any potential undefined if an ID wasn't found

    return orderedDogs;
  },

  // No cache methods needed anymore
};

export default dogService; // Export the direct service