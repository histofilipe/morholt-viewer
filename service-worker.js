// Nome do cache (mude se fizer alterações grandes, para forçar atualização)
const CACHE_NAME = 'qr-viewer-v2';

// Arquivos que devem funcionar offline
const URLS_TO_CACHE = [
  './',
  './index.html',
  './papaparse.min.js',
  './dados.csv'
];

// Instalação: faz o pré-cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Ativação: remove caches antigos
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

// Fetch: trata navegação (?np=...) e outros arquivos
self.addEventListener('fetch', event => {
  // 1) Navegação (URL digitada, clique em link, QR Code etc.)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(response => {
        // Se tiver no cache, usa. Se não, tenta buscar da rede.
        return response || fetch(event.request);
      })
    );
    return;
  }

  // 2) Demais requisições (CSV, JS, etc.) – estrategia cache-first
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
