// sw.ts
export default null;

/// <reference lib="webworker" />

declare var self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'template-cache-v1';
const CACHE_URLS = [
  '/templates/home.html',
  '/templates/gallery.html',
  '/templates/404.html',
] as const;

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching template urls');
      return cache.addAll(CACHE_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Delete old caches if cache version changes
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => {
        console.log('New service worker activated');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/templates/')) {
    event.respondWith(
      caches
        .open(CACHE_NAME)
        .then((cache) => cache.match(event.request))
        .then((response) => {
          if (response) {
            return response; // Return cached response
          }
          // Fetch and cache new template
          return fetch(event.request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone());
              });
            }
            return response;
          });
        })
    );
  }
});
