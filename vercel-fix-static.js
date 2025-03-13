// This script fixes static asset paths in the build output
const fs = require('fs');
const path = require('path');

console.log('Running Vercel static asset fix script...');

// Read the build/index.html file
const indexPath = path.join(process.cwd(), 'build', 'index.html');
let indexHtml;

try {
  indexHtml = fs.readFileSync(indexPath, 'utf8');
  console.log('Successfully read index.html');
} catch (error) {
  console.error('Error reading index.html:', error);
  process.exit(1);
}

// Ensure JavaScript files are loaded with absolute paths
indexHtml = indexHtml.replace(
  /(src="\.\/static\/js\/[^"]+\.js")/g, 
  'src="/static/js/$1" type="application/javascript" crossorigin="anonymous"'
);

// Ensure CSS files are loaded with absolute paths
indexHtml = indexHtml.replace(
  /(href="\.\/static\/css\/[^"]+\.css")/g, 
  'href="/static/css/$1" type="text/css"'
);

// Add a version cache buster to all static asset URLs
const timestamp = Date.now();
indexHtml = indexHtml.replace(
  /(src="\/)([^"]+)(\.js")/g, 
  `src="/$2.js?v=${timestamp}"`
);

indexHtml = indexHtml.replace(
  /(href="\/)([^"]+)(\.css")/g, 
  `href="/$2.css?v=${timestamp}"`
);

// Add a meta tag to prevent caching
const metaNoCache = '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />';
indexHtml = indexHtml.replace('<head>', `<head>${metaNoCache}`);

// Add script to check for runtime errors and reload
const runtimeErrorScript = `
<script>
  // Monitor for JavaScript syntax errors
  window.addEventListener('error', function(e) {
    if (e && e.message && e.message.includes('Unexpected token')) {
      console.warn('Detected JavaScript syntax error, reloading app...');
      window.location.href = '/?recover=' + Date.now();
    }
  });
</script>
`;
indexHtml = indexHtml.replace('</head>', `${runtimeErrorScript}</head>`);

// Write the updated index.html
try {
  fs.writeFileSync(indexPath, indexHtml);
  console.log('Successfully updated index.html');
} catch (error) {
  console.error('Error writing index.html:', error);
  process.exit(1);
}

// Create fallback JavaScript file for better error handling
const fallbackJs = `
// This is a fallback script that gets loaded if the main script fails
console.log('Fallback script loaded');
window.addEventListener('DOMContentLoaded', function() {
  // Add basic UI to notify user of error and provide recovery option
  var root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Failed to load application</h1><p>There was an error loading the application scripts.</p><button onclick="window.location.reload(true)">Reload Page</button></div>';
  }
});
`;

const fallbackJsPath = path.join(process.cwd(), 'build', 'fallback.js');
try {
  fs.writeFileSync(fallbackJsPath, fallbackJs);
  console.log('Created fallback.js script');
} catch (error) {
  console.error('Error creating fallback.js:', error);
}

console.log('Static asset fix script completed successfully'); 