// Service Worker for AITU Dev Website
// This file provides basic service worker functionality for progressive web app support

if (typeof self !== 'undefined') {
  // Skip waiting and claim clients immediately
  self.addEventListener('install', event => {
    self.skipWaiting();
  });

  self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });

  // Handle fetch events with network first strategy
  self.addEventListener('fetch', event => {
    // Only handle HTTP(S) requests
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
      return;
    }

    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses
          if (response && response.status === 200) {
            const cache = caches.open('v1');
            cache.then(c => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  });
}
