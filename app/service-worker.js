self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('spoons-cache').then(cache => {
        return cache.addAll([
          './',
          './index.html',
          './style.css',
          './script.js',
          './confetti.js',
          './manifest.json',
          './icon-192.png',
          './icon-512.png'
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
  