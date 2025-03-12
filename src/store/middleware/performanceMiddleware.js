/**
 * Redux middleware for tracking action performance
 * Measures execution time for Redux actions and tracks them in analytics
 */

// Stub for trackTiming until analytics module is fully integrated
const trackTiming = (metricName, duration, properties) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Timing: ${metricName}`, duration, properties);
  }
};

const performanceMiddleware = store => next => action => {
  // Only track performance in development or if explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !process.env.REACT_APP_ENABLE_PERFORMANCE_TRACKING) {
    return next(action);
  }
  
  // Skip tracking for specific action types or internal Redux actions
  if (typeof action === 'object' && action.type && action.type.startsWith('@@redux')) {
    return next(action);
  }
  
  // Start measuring time
  const actionName = typeof action === 'object' ? action.type : 'unknown';
  const startTime = performance.now();
  
  // Execute the action
  const result = next(action);
  
  // Measure execution time
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Log the performance data
  const actionType = actionName || 'anonymous';
  trackTiming(`redux_action_${actionType}`, duration, {
    actionType,
    hasPayload: Boolean(action.payload),
  });
  
  // If the action takes too long, log a warning
  if (duration > 50) {
    console.warn(`Redux action ${actionType} took ${duration.toFixed(2)}ms to complete`);
  }
  
  return result;
};

export default performanceMiddleware; 