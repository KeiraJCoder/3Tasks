self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('spoons-cache').then(cache => {
        return cache.addAll([
          '/3Tasks/app/index.html',
          '/3Tasks/app/style.css',
          '/3Tasks/app/script.js',
          '/3Tasks/app/confetti.js',
          '/3Tasks/app/manifest.json',
          '/3Tasks/app/icon-192.png',
          '/3Tasks/app/icon-512.png'
        ]);
      })
    );
  });
  
  // ✅ Immediately take control
  self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  