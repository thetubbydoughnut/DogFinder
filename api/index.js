// This file will be used by Vercel as a serverless function fallback
const path = require('path');
const fs = require('fs');

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
module.exports = (req, res) => {
  // Check if the request appears to be for a static asset
  const url = req.url;
  
  // If this is a JavaScript or CSS file request, serve index.html instead
  // This is a fallback to prevent 404 errors on static assets
  if (url.endsWith('.js') || url.endsWith('.css')) {
    console.log(`[Fallback] Detected static asset request: ${url}`);
    
    // Set proper content type based on file extension
    const contentType = url.endsWith('.js') 
      ? 'application/javascript'
      : 'text/css';
    
    res.setHeader('Content-Type', contentType);
    
    try {
      // Try to serve the actual file if it exists
      const filePath = path.join(process.cwd(), 'build', url);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return res.end(content);
      }
    } catch (e) {
      console.error(`[Fallback] Error serving ${url}:`, e);
    }
    
    // If we couldn't serve the file, return a redirect to home
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }

  // For all other routes, redirect to index.html
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  
  try {
    const indexPath = path.join(process.cwd(), 'build', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    return res.end(content);
  } catch (e) {
    console.error('[Fallback] Error serving index.html:', e);
    return res.end('<!DOCTYPE html><html><body><h1>Loading app...</h1><script>window.location.href="/";</script></body></html>');
  }
}; 