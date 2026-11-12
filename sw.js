// Service worker: apka działa bez internetu i da się ją zainstalować na telefonie.
// Strategia „najpierw sieć”: zawsze świeża wersja, a bez internetu — kopia z pamięci.
const CACHE = 'kompas-v4';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/i18n.js', 'js/data.js', 'js/questions-1.js', 'js/questions-2.js', 'js/questions-3.js',
  'js/positions.js', 'js/positions-2.js', 'js/positions-3.js', 'js/references.js', 'js/charts.js', 'js/app.js', 'js/voice.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Tylko pliki tej apki; zapytania do serwera asystenta (/api/) i obce adresy idą zwykłą drogą.
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.includes('/api/')) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
