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
  const start = performance.now();
  const result = next(action);
  const end = performance.now();
  const duration = end - start;
  
  // Log performance metrics (consider a more robust analytics tool for production)
  // Example: Sending timing data to an analytics service
  // reportTiming('redux_action', action.type, duration);
  
  // Basic console logging for development
  const metricName = `redux_action_${action.type}`.replace(/[/.]/g, '_');
  const properties = { actionType: action.type, hasPayload: !!action.payload };
  // console.log(`Timing: ${metricName}`, duration, properties);

  // Log the performance data
  const actionType = action.type || 'anonymous';
  // trackTiming(`redux_action_${actionType}`, duration, {
  //   actionType,
  //   hasPayload: Boolean(action.payload),
  // });
  
  // If the action takes too long, log a warning
  if (duration > 50) {
    // console.warn(`Redux action ${actionType} took ${duration.toFixed(2)}ms to complete`);
  }
  
  return result;
};

export default performanceMiddleware; 