const CACHE_NAME = 'kasse-v1';
const urlsToCache = [
  '/Kasse.html',
  '/Images/Bier.png',
  '/Festle/Images/Flasche.png',
  '/Festle/Images/Glas.png',
  '/Festle/Images/Krug.png',
  '/Festle/Images/Tasse.png',
  '/Festle/Images/Teller.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => caches.match('/offline.html'));
      })
  );
});




