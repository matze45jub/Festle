const CACHE_NAME = 'kasse-v1';
const urlsToCache = [
  '/Festle/Kasse.html',
  '/Festle/Images/Bier.png',
  '/Festle/Images/Flasche.png',
  '/Festle/Images/Glas.png',
  '/Festle/Images/Krug.png',
  '/Festle/Images/Tasse.png',
  '/Festle/Images/Teller.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});



