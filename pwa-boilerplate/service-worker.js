const CACHE_NAME = 'pwa-cache-v1';
const STATIC_CACHE_NAME = 'pwa-static-v1';
const DYNAMIC_CACHE_NAME = 'pwa-dynamic-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Cache patterns for different file types
const CACHE_PATTERNS = {
  images: /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i,
  fonts: /\.(woff|woff2|eot|ttf|otf)$/i,
  static: /\.(css|js)$/i
};

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Force activate immediately
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  self.clients.claim(); // Take control of all clients immediately
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old cache versions
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Handle all requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests that aren't from our domain
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Check cache first for all requests
    const cachedResponse = await caches.match(request);
    
    // For navigation requests (HTML pages)
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
      try {
        // Try network first for navigation
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          // Cache the successful response
          const cache = await caches.open(DYNAMIC_CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        }
      } catch (error) {
        console.log('Network failed for navigation, trying cache...');
      }
      
      // Return cached version or offline page
      return cachedResponse || await caches.match('/offline.html') || 
             new Response('Offline - No cached version available', { 
               status: 503, 
               statusText: 'Service Unavailable' 
             });
    }
    
    // For static assets (CSS, JS, images, fonts)
    if (CACHE_PATTERNS.static.test(url.pathname) || 
        CACHE_PATTERNS.images.test(url.pathname) || 
        CACHE_PATTERNS.fonts.test(url.pathname)) {
      
      // Return cached version if available
      if (cachedResponse) {
        // Update cache in background
        updateCacheInBackground(request);
        return cachedResponse;
      }
      
      // Try network if not cached
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          const cache = await caches.open(DYNAMIC_CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        }
      } catch (error) {
        console.log('Network failed for asset:', url.pathname);
      }
      
      // Return appropriate fallback based on file type
      if (CACHE_PATTERNS.static.test(url.pathname)) {
        const contentType = url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript';
        return new Response('/* Offline - Resource not available */', {
          headers: { 'Content-Type': contentType }
        });
      }
      
      return new Response('Resource not available offline', { status: 404 });
    }
    
    // For API calls and other requests - network first
    try {
      const networkResponse = await fetch(request);
      
      // Cache successful GET requests
      if (networkResponse.ok && request.method === 'GET') {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return new Response('Network unavailable', { 
        status: 503, 
        statusText: 'Service Unavailable' 
      });
    }
    
  } catch (error) {
    console.error('Error in fetch handler:', error);
    return new Response('Service Worker Error', { 
      status: 500, 
      statusText: 'Internal Server Error' 
    });
  }
}

// Background cache update for static assets
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silently fail - we already have cached version
  }
}

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});