// Service worker: cache-first for the game shell so it loads offline and fast.
const CACHE = 'ss-v18';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icon.svg',
  'og-image.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ss-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = e.request.url;
  if (e.request.method !== 'GET') return;
  if (!u.startsWith(self.location.origin) && !u.startsWith('https://cdnjs.cloudflare.com/')) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: u.endsWith('index.html') || u.endsWith('/') }).then(r =>
      r || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
    )
  );
});
