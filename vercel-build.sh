#!/bin/bash

# Exit on error
set -e

# Build the React app
echo "Building React app..."
npm run build

# Create a backup of the original index.html
cp build/index.html build/index.original.html

# Add dynamic script recovery
cat > build/recovery.js << EOL
// Script recovery logic
window.addEventListener('error', function(e) {
  if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
    const src = e.target.src || e.target.href;
    console.error('Resource failed to load:', src);
    
    // If we're not at the root, redirect there
    if (window.location.pathname !== '/') {
      console.log('Redirecting to root to attempt recovery');
      window.location.href = '/';
      return;
    }
    
    // If we are at the root and still have errors, try a hard reload
    if (!localStorage.getItem('attempted_recovery')) {
      localStorage.setItem('attempted_recovery', 'true');
      window.location.reload(true);
    }
  }
}, true);
EOL

# Insert the recovery script at the beginning of the head
sed -i.bak 's/<head>/<head><script src="\/recovery.js"><\/script>/' build/index.html

echo "Build completed with enhanced error recovery" 