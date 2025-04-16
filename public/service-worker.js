/* eslint-disable no-restricted-globals */

// Service Worker for the Dog Finder App
// This service worker handles caching and offline capabilities.

const CACHE_NAME = 'dog-finder-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Exclude requests to specific domains or with specific parameters if needed
                // Example: Exclude API calls if they shouldn't be cached or handled offline
                // Example: if (event.request.url.includes('/api/')) { return; }

                // Don't intercept requests for non-GET methods or specific URLs like the old API
                if (event.request.method !== 'GET' /* || 
                    !event.request.url.includes('frontend-take-home-service.fetch.com') */) { 
                  // Let the browser handle non-GET requests or excluded URLs normally
                  // console.log('Service Worker: Skipping fetch for non-GET or excluded URL:', event.request.url);
                  return;
                }

                // Don't cache API calls (they likely have auth requirements)
                if (!event.request.url.includes('/api/') && 
                    !event.request.url.includes('frontend-take-home-service.fetch.com')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 