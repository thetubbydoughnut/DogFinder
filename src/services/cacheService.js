/**
 * Cache Service for API responses
 * Implements both localStorage and in-memory caching strategies
 */

// Cache configuration
const CACHE_CONFIG = {
  // Cache keys
  DOGS_SEARCH: 'dogs_search_cache',
  DOGS_BY_ID: 'dogs_by_id_cache',
  BREEDS: 'breeds_cache',
  LOCATIONS: 'locations_cache',
  
  // Cache expiration times (in milliseconds)
  EXPIRATION: {
    DOGS_SEARCH: 5 * 60 * 1000, // 5 minutes
    DOGS_BY_ID: 30 * 60 * 1000, // 30 minutes
    BREEDS: 24 * 60 * 60 * 1000, // 24 hours
    LOCATIONS: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Maximum cache size
  MAX_CACHE_SIZE: {
    DOGS_SEARCH: 50, // Store up to 50 different search results
    DOGS_BY_ID: 1000, // Store up to 1000 dog objects
  }
};

// In-memory cache
const memoryCache = new Map();

/**
 * Generate a cache key from request parameters
 * @param {string} baseKey - The base cache key
 * @param {Object} params - Request parameters
 * @returns {string} - Unique cache key
 */
const generateCacheKey = (baseKey, params) => {
  if (!params) return baseKey;
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => {
      const value = params[key];
      if (Array.isArray(value)) {
        return `${key}=[${value.sort().join(',')}]`;
      }
      return `${key}=${value}`;
    })
    .join('&');
  
  return `${baseKey}_${sortedParams}`;
};

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Object|null} - Cached data or null if not found/expired
 */
const getFromCache = (key) => {
  // Try in-memory cache first for better performance
  if (memoryCache.has(key)) {
    const cachedItem = memoryCache.get(key);
    if (cachedItem && Date.now() < cachedItem.expiry) {
      console.log(`Cache hit (memory): ${key}`);
      return cachedItem.data;
    }
    // Remove expired item from memory cache
    memoryCache.delete(key);
  }
  
  // Try localStorage if not in memory or expired
  try {
    const cachedItem = localStorage.getItem(key);
    if (cachedItem) {
      const parsedItem = JSON.parse(cachedItem);
      if (parsedItem && Date.now() < parsedItem.expiry) {
        // Add to memory cache for faster subsequent access
        memoryCache.set(key, parsedItem);
        console.log(`Cache hit (localStorage): ${key}`);
        return parsedItem.data;
      }
      // Remove expired item from localStorage
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error retrieving from cache:', error);
  }
  
  return null;
};

/**
 * Store data in cache
 * @param {string} baseKey - Base cache key category
 * @param {string} key - Specific cache key
 * @param {Object} data - Data to cache
 * @param {number} expiry - Expiration time in ms
 */
const storeInCache = (baseKey, key, data, expiry) => {
  if (!data) return;
  
  const cacheItem = {
    data,
    expiry: Date.now() + expiry,
    timestamp: Date.now()
  };
  
  try {
    // Store in memory cache
    memoryCache.set(key, cacheItem);
    
    // Store in localStorage for persistence
    localStorage.setItem(key, JSON.stringify(cacheItem));
    
    // Manage cache size by pruning old entries if needed
    pruneCacheIfNeeded(baseKey);
    
    console.log(`Cached: ${key}`);
  } catch (error) {
    console.error('Error storing in cache:', error);
    // If localStorage is full, clear some old caches
    if (error instanceof DOMException && 
        (error.name === 'QuotaExceededError' || 
         error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      pruneOldestCache();
    }
  }
};

/**
 * Prune cache if it exceeds maximum size
 * @param {string} baseKey - Cache category to check
 */
const pruneCacheIfNeeded = (baseKey) => {
  // Get all cache keys with the baseKey prefix
  const allKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(baseKey));
  
  const maxSize = CACHE_CONFIG.MAX_CACHE_SIZE[baseKey];
  if (maxSize && allKeys.length > maxSize) {
    // Get all cache items and their timestamps
    const cacheItems = allKeys.map(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        return { key, timestamp: item.timestamp };
      } catch (e) {
        return { key, timestamp: 0 };
      }
    });
    
    // Sort by timestamp (oldest first)
    cacheItems.sort((a, b) => a.timestamp - b.timestamp);
    
    // Remove oldest items to stay within limit
    const itemsToRemove = cacheItems.slice(0, allKeys.length - maxSize);
    itemsToRemove.forEach(item => {
      localStorage.removeItem(item.key);
      memoryCache.delete(item.key);
    });
    
    console.log(`Pruned ${itemsToRemove.length} old cache entries for ${baseKey}`);
  }
};

/**
 * Prune oldest caches when storage is full
 */
const pruneOldestCache = () => {
  try {
    // Get all cache items
    const cacheItems = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item && item.timestamp) {
          cacheItems.push({ key, timestamp: item.timestamp });
        }
      } catch (e) {
        // Skip non-JSON items
      }
    }
    
    if (cacheItems.length > 0) {
      // Sort by timestamp (oldest first)
      cacheItems.sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove 20% of oldest items
      const removeCount = Math.max(1, Math.floor(cacheItems.length * 0.2));
      const itemsToRemove = cacheItems.slice(0, removeCount);
      
      itemsToRemove.forEach(item => {
        localStorage.removeItem(item.key);
        memoryCache.delete(item.key);
      });
      
      console.log(`Emergency cache cleanup: removed ${itemsToRemove.length} items`);
    }
  } catch (error) {
    console.error('Error during emergency cache cleanup:', error);
    // Last resort: clear all caches
    clearAllCaches();
  }
};

/**
 * Clear specific cache category
 * @param {string} baseKey - Cache category to clear
 */
const clearCache = (baseKey) => {
  try {
    // Clear from localStorage
    Object.keys(localStorage)
      .filter(key => key.startsWith(baseKey))
      .forEach(key => localStorage.removeItem(key));
    
    // Clear from memory cache
    for (const key of memoryCache.keys()) {
      if (key.startsWith(baseKey)) {
        memoryCache.delete(key);
      }
    }
    
    console.log(`Cleared cache for: ${baseKey}`);
  } catch (error) {
    console.error(`Error clearing cache for ${baseKey}:`, error);
  }
};

/**
 * Clear all caches
 */
const clearAllCaches = () => {
  try {
    // Clear specific caches to avoid clearing non-cache localStorage items
    clearCache(CACHE_CONFIG.DOGS_SEARCH);
    clearCache(CACHE_CONFIG.DOGS_BY_ID);
    clearCache(CACHE_CONFIG.BREEDS);
    clearCache(CACHE_CONFIG.LOCATIONS);
    
    console.log('All caches cleared');
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
};

const cacheService = {
  // Configuration
  CACHE_CONFIG,
  
  // Core caching functions
  generateCacheKey,
  getFromCache,
  storeInCache,
  
  // Cache management functions
  clearCache,
  clearAllCaches,
  
  // Get dogs from cache or fetch from API
  getCachedDogSearch: (params) => {
    const cacheKey = generateCacheKey(CACHE_CONFIG.DOGS_SEARCH, params);
    return getFromCache(cacheKey);
  },
  
  // Store dog search results in cache
  storeDogSearch: (params, data) => {
    const cacheKey = generateCacheKey(CACHE_CONFIG.DOGS_SEARCH, params);
    storeInCache(
      CACHE_CONFIG.DOGS_SEARCH,
      cacheKey,
      data,
      CACHE_CONFIG.EXPIRATION.DOGS_SEARCH
    );
  },
  
  // Get dog by ID from cache
  getCachedDogsByIds: (ids) => {
    if (!ids || ids.length === 0) return null;
    
    // Sort IDs to ensure consistent cache keys
    const sortedIds = [...ids].sort();
    const cacheKey = generateCacheKey(CACHE_CONFIG.DOGS_BY_ID, { ids: sortedIds });
    return getFromCache(cacheKey);
  },
  
  // Store dogs by ID in cache
  storeDogsByIds: (ids, data) => {
    if (!ids || ids.length === 0 || !data) return;
    
    // Sort IDs to ensure consistent cache keys
    const sortedIds = [...ids].sort();
    const cacheKey = generateCacheKey(CACHE_CONFIG.DOGS_BY_ID, { ids: sortedIds });
    storeInCache(
      CACHE_CONFIG.DOGS_BY_ID,
      cacheKey,
      data,
      CACHE_CONFIG.EXPIRATION.DOGS_BY_ID
    );
    
    // Also cache individual dogs for direct access
    if (Array.isArray(data)) {
      data.forEach(dog => {
        if (dog && dog.id) {
          const individualKey = generateCacheKey(CACHE_CONFIG.DOGS_BY_ID, { ids: [dog.id] });
          storeInCache(
            CACHE_CONFIG.DOGS_BY_ID,
            individualKey,
            [dog],
            CACHE_CONFIG.EXPIRATION.DOGS_BY_ID
          );
        }
      });
    }
  },
  
  // Get breeds from cache
  getCachedBreeds: () => {
    return getFromCache(CACHE_CONFIG.BREEDS);
  },
  
  // Store breeds in cache
  storeBreeds: (data) => {
    storeInCache(
      CACHE_CONFIG.BREEDS,
      CACHE_CONFIG.BREEDS,
      data,
      CACHE_CONFIG.EXPIRATION.BREEDS
    );
  },
  
  // Get locations from cache
  getCachedLocations: (zipCodes) => {
    if (!zipCodes || zipCodes.length === 0) return null;
    
    // Sort ZIP codes to ensure consistent cache keys
    const sortedZips = [...zipCodes].sort();
    const cacheKey = generateCacheKey(CACHE_CONFIG.LOCATIONS, { zipCodes: sortedZips });
    return getFromCache(cacheKey);
  },
  
  // Store locations in cache
  storeLocations: (zipCodes, data) => {
    if (!zipCodes || zipCodes.length === 0 || !data) return;
    
    // Sort ZIP codes to ensure consistent cache keys
    const sortedZips = [...zipCodes].sort();
    const cacheKey = generateCacheKey(CACHE_CONFIG.LOCATIONS, { zipCodes: sortedZips });
    storeInCache(
      CACHE_CONFIG.LOCATIONS,
      cacheKey,
      data,
      CACHE_CONFIG.EXPIRATION.LOCATIONS
    );
  }
};

export default cacheService; 