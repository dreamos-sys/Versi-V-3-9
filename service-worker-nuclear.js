const CACHE_NAME = 'dreamos-v13.1.9-quantum-cache';
const KILL_SWITCH_URL = 'https://kill-switch.dreamos-api.com/v13';
const CURRENT_VERSION = '13.1.9-quantum-seal';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(checkKillSwitch());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  setInterval(checkKillSwitch, 5 * 60 * 1000);
});

async function checkKillSwitch() {
  try {
    const response = await fetch(KILL_SWITCH_URL, {
      method: 'POST',
      headers: { 'X-Request-Type': 'kill-switch-check' },
      signal: AbortSignal.timeout(3000)
    });
    
    const data = await response.json();
    
    if (data.status === 'KILL' || data.version !== CURRENT_VERSION) {
      await self.registration.unregister();
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.navigate('https://dreamos-api.com/update-required');
      });
      
      return false;
    }
    
    return true;
  } catch (error) {
    return true;
  }
}

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
