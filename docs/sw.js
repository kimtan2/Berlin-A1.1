// Glutbibliothek service worker: everything is cached on first visit, so the app opens and reads offline.
const VERSION = 'glut-v4';
const CORE = [
  "./",
  "index.html",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "vendor/pdfjs/pdf.min.js",
  "vendor/pdfjs/pdf.worker.min.js"
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  // fetch each file on its own, so one slow or redirected file never blocks the offline install
  e.waitUntil(caches.open(VERSION).then((c) => Promise.all(CORE.map((u) =>
    fetch(u, { cache: 'no-cache' }).then((r) => (r.ok ? c.put(u, r) : null)).catch(() => null)
  ))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('glut-') && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // fonts: cache first, they never change
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(VERSION).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => { c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('.pdf') || url.pathname.endsWith('library.json')) return;
  // app files: answer from the cache at once, refresh it in the background (new versions show on the next start)
  const key = req.mode === 'navigate' ? 'index.html' : req;
  e.respondWith(caches.open(VERSION).then((c) => c.match(key).then((hit) => {
    const net = fetch(req).then((res) => { if (res.ok) c.put(key, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
