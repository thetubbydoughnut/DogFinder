/**
 * Utility functions for performance monitoring and optimization
 */
import { trackTiming } from './analytics';

/**
 * Measure the execution time of a function
 * 
 * @param {Function} fn - Function to measure
 * @param {string} name - Name of the operation for logging
 * @param {Object} properties - Additional properties to log
 * @returns {any} - Return value of the function
 */
export const measureExecutionTime = (fn, name, properties = {}) => {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Track the timing
  trackTiming(name, duration, properties);
  
  return result;
};

/**
 * Create a debounced function that delays invoking fn until after wait ms
 * have elapsed since the last time it was invoked
 * 
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
export const debounce = (fn, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create a throttled function that only invokes fn at most once per wait ms
 * 
 * @param {Function} fn - Function to throttle
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Throttled function
 */
export const throttle = (fn, wait = 300) => {
  let inThrottle = false;
  return function executedFunction(...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
};

/**
 * Memoize a function to avoid recalculating the same values
 * 
 * @param {Function} fn - Function to memoize
 * @returns {Function} - Memoized function
 */
export const memoize = (fn) => {
  const cache = {};
  return function memoizedFunction(...args) {
    const key = JSON.stringify(args);
    if (cache[key] === undefined) {
      cache[key] = fn(...args);
    }
    return cache[key];
  };
}; 