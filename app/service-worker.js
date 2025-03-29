self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('spoons-cache').then(cache => {
        return cache.addAll([
          '/',
          '/app/index.html',
          '/app/style.css',
          '/app/script.js',
          '/app/confetti.js',
          '/app/manifest.json'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  