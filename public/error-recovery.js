// Error recovery script for Fetch Dog Finder
(function() {
  // Function to clean up any previous recovery attempts
  function cleanupRecoveryAttempts() {
    // Clear related localStorage
    localStorage.removeItem('js_recovery_attempted');
    localStorage.removeItem('recovery_timestamp');
    
    // Clear cache API if available
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        cacheNames.forEach(function(cacheName) {
          caches.delete(cacheName);
        });
      });
    }
  }
  
  // Detect if we're in a recovery loop
  function isInRecoveryLoop() {
    var now = Date.now();
    var lastAttempt = parseInt(localStorage.getItem('recovery_timestamp') || '0');
    var attempts = parseInt(localStorage.getItem('js_recovery_attempted') || '0');
    
    // If we've tried more than 3 times in the last minute, we're in a loop
    if (attempts > 3 && (now - lastAttempt < 60000)) {
      return true;
    }
    
    // Update recovery attempt counter
    localStorage.setItem('js_recovery_attempted', attempts + 1);
    localStorage.setItem('recovery_timestamp', now);
    return false;
  }
  
  // Function to add the fallback script
  function addFallbackJavaScript() {
    // Create a fallback script that will run if the main script fails
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = 'window.fallbackLoaded = true; console.log("Fallback script loaded successfully");';
    document.head.appendChild(script);
  }
  
  // Handle the specific error case
  window.addEventListener('error', function(e) {
    // Check if this is a script error
    if (e && e.target && e.target.tagName === 'SCRIPT') {
      var src = e.target.src || '';
      
      // Handle case where script failed to load
      if (e.target.getAttribute('src') && !src.includes('recovery.js')) {
        console.warn('Script failed to load:', src);
        
        // If we're in a recovery loop, try a different approach
        if (isInRecoveryLoop()) {
          // Add a fallback script
          addFallbackJavaScript();
          return;
        }
        
        // Attempt recovery by redirecting to root with cache buster
        console.log('Attempting recovery by redirect...');
        cleanupRecoveryAttempts();
        window.location.href = '/?recover=' + Date.now();
        return;
      }
    }
    
    // Check for Unexpected token error in error message
    if (e && e.message && (
      e.message.includes('Unexpected token') || 
      e.message.includes('Failed to load') ||
      e.message.includes('SYNTAX_ERR')
    )) {
      console.warn('Detected script parsing error:', e.message);
      
      // If we're in a recovery loop, try a different approach
      if (isInRecoveryLoop()) {
        console.log('In recovery loop, trying alternative recovery...');
        addFallbackJavaScript();
        return;
      }
      
      // Reset the recovery attempt counter and redirect
      cleanupRecoveryAttempts();
      window.location.href = '/?purge=' + Date.now();
    }
  }, true);
  
  // Also check for unhandled promise rejections
  window.addEventListener('unhandledrejection', function(e) {
    if (e && e.reason && e.reason.message && 
        (e.reason.message.includes('Unexpected token') || 
         e.reason.message.includes('SYNTAX_ERR'))) {
      console.warn('Detected promise rejection with script error');
      
      if (!isInRecoveryLoop()) {
        cleanupRecoveryAttempts();
        window.location.href = '/?recover=' + Date.now();
      }
    }
  });
  
  // Initialize
  if (window.location.search.includes('recover') || 
      window.location.search.includes('purge')) {
    cleanupRecoveryAttempts();
  }
})(); 