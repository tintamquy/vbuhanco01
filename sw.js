// Service Worker cho PWA - Học Hán Cổ
const CACHE_NAME = 'han-co-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
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
  '/js/utils/storage.js',
  '/js/utils/helpers.js',
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
    })
  );
  return self.clients.claim();
});

// Fetch event - Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then(fetchResponse => {
          // Cache new resources
          if (fetchResponse && fetchResponse.status === 200) {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return fetchResponse;
        }).catch(() => {
          // Offline fallback
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

