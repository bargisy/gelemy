const CACHE_NAME = 'fintrack-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use a fault-tolerant method so missing files don't crash the install
      return Promise.allSettled(
        STATIC_ASSETS.map(asset => cache.add(asset).catch(err => console.warn('Cache add failed for', asset)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignore API calls (don't cache data requests)
  if (event.request.url.includes('googleapis.com/drive') || event.request.url.includes('googleapis.com/sheets')) {
    return;
  }

  // Network First, fallback to Cache strategy for everything else (including Tailwind and Google Scripts)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache the new response for future offline use
        if (networkResponse.ok && event.request.method === 'GET') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
