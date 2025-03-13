// Error recovery script for Fetch Dog Finder
(function() {
  // Track if we've already attempted recovery
  var recoveryAttempted = false;
  
  // Check for the specific error
  window.addEventListener('error', function(e) {
    if (!recoveryAttempted && e.message && e.message.indexOf('Unexpected token') !== -1) {
      console.warn('Detected Unexpected token error, attempting recovery...');
      recoveryAttempted = true;
      
      // Clear any caches that might be causing issues
      if (window.caches && window.caches.keys) {
        window.caches.keys().then(function(cacheNames) {
          cacheNames.forEach(function(cacheName) {
            window.caches.delete(cacheName);
            console.log('Cache deleted:', cacheName);
          });
        });
      }
      
      // Force a hard reload
      window.location.href = '/?t=' + Date.now();
      return true;
    }
    return false;
  });
  
  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(e) {
    if (!recoveryAttempted && e.reason && typeof e.reason.message === 'string' && 
        e.reason.message.indexOf('Unexpected token') !== -1) {
      console.warn('Detected Unexpected token error in promise, attempting recovery...');
      recoveryAttempted = true;
      window.location.href = '/?t=' + Date.now();
    }
  });
})(); 