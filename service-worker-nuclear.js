const CACHE_NAME = 'dreamos-v13.1.9-quantum-cache';
// Sementara matikan kill-switch untuk testing
// const KILL_SWITCH_URL = 'https://kill-switch.dreamos-api.com/v13';
const CURRENT_VERSION = '13.1.9-quantum-seal';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  // event.waitUntil(checkKillSwitch()); // Matikan sementara
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  // setInterval(checkKillSwitch, 5 * 60 * 1000); // Matikan sementara
});

// async function checkKillSwitch() {
//   ... kode lama ...
// }

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'You are offline',
      message: 'Please check your internet connection'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
