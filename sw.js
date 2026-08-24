const CACHE_NAME = 'iconforge-v2';
const urlsToCache = [
  './',
  './index.html',
  './src/style/index.css',
  './src/style/element.css',
  './src/script/image-loader.js',
  './src/script/manifest-generator.js',
  './src/script/index.js',
  './src/script/icon-generator.js',
  './src/manifest.json',
  './src/img/favicon.ico',
  './src/img/icon-16x16.png',
  './src/img/icon-32x32.png',
  './src/img/icon-180x180.png',
  './src/img/icon-192x192.png',
  './src/img/icon-512x512.png',
  // External libraries
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
