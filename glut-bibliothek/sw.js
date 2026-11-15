// Glutbibliothek service worker: everything is cached on first visit, so the app opens and reads offline.
const VERSION = 'glut-v1';
const CORE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "texts/effi-briest.json",
  "texts/gartenlaube-1880-2.json",
  "texts/illustrirte-zeitung-1843-1.json",
  "texts/immensee.json",
  "texts/schimmelreiter.json",
  "texts/taugenichts.json",
  "texts/verwandlung.json",
  "texts/werther.json"
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
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
  // app files: answer from the cache at once, refresh it in the background (new versions show on the next start)
  const key = req.mode === 'navigate' ? 'index.html' : req;
  e.respondWith(caches.open(VERSION).then((c) => c.match(key).then((hit) => {
    const net = fetch(req).then((res) => { if (res.ok) c.put(key, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
