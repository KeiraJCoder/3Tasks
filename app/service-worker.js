self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('spoons-cache').then(cache => {
        return cache.addAll([
          '/',
          '/app/index.html',
          '/app/style.css',
          '/app/script.js',
          '/app/confetti.js',
          '/app/manifest.json',
          '/app/ico-192.png',  // Add icon-192.png here
          '/app/ico-512.png'   // Add icon-512.png here
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
  