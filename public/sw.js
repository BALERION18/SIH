const CACHE_NAME = 'monastery360-v4';
const STATIC_CACHE_NAME = 'monastery360-static-v4';
const DYNAMIC_CACHE_NAME = 'monastery360-dynamic-v4';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/monastery-logo-192.png',
  '/monastery-logo-512.png',
  '/screenshot-wide.jpg',
  '/screenshot-narrow.jpg'
];

// Additional assets to cache
const ASSET_EXTENSIONS = [
  '.js', '.css', '.woff', '.woff2', '.ttf', '.eot'
];

// Patterns for dynamic caching
const CACHE_PATTERNS = {
  images: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
  assets: /\/assets\//,
  fonts: /\.(woff|woff2|eot|ttf|otf)$/i,
  api: /\/api\//
};

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(error => {
        console.error('Failed to cache static assets:', error);
      });
    })
  );
});

// Fetch event - Smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (!url.origin.includes(self.location.origin) && !url.pathname.startsWith('/')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then(response => {
      // Return cached version if available
      if (response) {
        // Update cache in background for static assets
        if (CACHE_PATTERNS.images.test(request.url) || 
            CACHE_PATTERNS.assets.test(request.url) || 
            ASSET_EXTENSIONS.some(ext => request.url.endsWith(ext))) {
          fetch(request).then(fetchResponse => {
            if (fetchResponse.ok) {
              caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                cache.put(request, fetchResponse.clone());
              });
            }
          }).catch(() => {});
        }
        return response;
      }
      
      // Network first strategy for HTML pages
      if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
        return fetch(request).then(fetchResponse => {
          if (fetchResponse.ok) {
            const responseClone = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        }).catch(() => {
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          // Return cached main page as fallback
          return caches.match('/') || caches.match('/index.html');
        });
      }
      
      // Cache first strategy for assets (CSS, JS, images, fonts)
      if (CACHE_PATTERNS.images.test(request.url) || 
          CACHE_PATTERNS.assets.test(request.url) || 
          CACHE_PATTERNS.fonts.test(request.url) ||
          ASSET_EXTENSIONS.some(ext => request.url.endsWith(ext))) {
        return fetch(request).then(fetchResponse => {
          if (fetchResponse.ok) {
            const responseClone = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        }).catch(() => {
          // For failed asset requests, return empty response to avoid breaking the page
          if (request.url.endsWith('.css')) {
            return new Response('', { 
              headers: { 'Content-Type': 'text/css' }
            });
          }
          if (request.url.endsWith('.js')) {
            return new Response('', { 
              headers: { 'Content-Type': 'application/javascript' }
            });
          }
          return new Response('', { status: 404 });
        });
      }
      
      // Network first for API calls and other requests
      return fetch(request).catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return new Response('Network unavailable', { 
          status: 503, 
          statusText: 'Service Unavailable' 
        });
      });
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  self.clients.claim();
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});