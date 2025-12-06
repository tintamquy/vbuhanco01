// Service Worker cho PWA - Học Hán Cổ
const CACHE_NAME = 'han-co-v2'; // Update version to force refresh
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/css/style.css',
  '/css/components.css',
  '/css/animations.css',
  '/js/app.js',
  '/js/data/strokes.js',
  '/js/data/radicals.js',
  '/js/data/liushu.js',
  '/js/data/characters.js',
  '/js/modules/canvas-writer.js',
  '/js/modules/stroke-recognition.js',
  '/js/modules/quiz-engine.js',
  '/js/modules/progress-tracker.js',
  '/js/modules/audio-reader.js',
  '/js/utils/storage.js',
  '/js/utils/helpers.js',
  '/assets/previewshare.jpg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  'https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
];

// Install event - Cache resources
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache).catch(err => {
          console.log('[Service Worker] Cache addAll failed:', err);
        });
      })
  );
  self.skipWaiting();
});

// Activate event - Clean old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Force claim all clients
      return self.clients.claim();
    })
  );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other protocols
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    fetch(event.request)
      .then(fetchResponse => {
        // Cache successful responses
        if (fetchResponse && fetchResponse.status === 200) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return fetchResponse;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to index.html for navigation requests
          if (event.request.destination === 'document' || 
              event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

