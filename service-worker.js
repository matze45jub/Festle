const CACHE_NAME = 'kasse-v1';
const urlsToCache = [
  '/Festle/Kasse.html',
  '/Festle/Images/45Jahre.png',
  '/Festle/Images/Flasche.png',
  '/Festle/Images/Glas.png',
  '/Festle/Images/Krug.png',
  '/Festle/Images/Tasse.png',
  '/Festle/Images/Teller.png'
  // Fügen Sie hier alle anderen benötigten Ressourcen hinzu
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
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
          return response; // Wenn im Cache gefunden, liefere es
        }
        
        // Versuche, die Ressource vom Netzwerk zu holen
        return fetch(event.request)
          .then((networkResponse) => {
            // Wenn erfolgreich geholt, cache die Ressource für zukünftige Nutzung
            if (networkResponse && networkResponse.status === 200) {
              const cacheResponse = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, cacheResponse);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Wenn Netzwerkanfrage fehlschlägt, versuche nochmal aus dem Cache zu laden
            return caches.match(event.request);
          });
      })
  );
});
