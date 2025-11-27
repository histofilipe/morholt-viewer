const CACHE_NAME = 'qr-viewer-v1';

// Liste aqui todos os arquivos que devem funcionar offline
const URLS_TO_CACHE = [
  './',
  './index.html',
  './papaparse.min.js',
  './unificado_consolidado v26_10 v1.csv'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Estratégia: cache-first (usa o que estiver salvo; se não tiver, vai na rede)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});
