// TrackBudget Service Worker
// Caches the app shell so it works offline.
// Strategy: network-first for the app HTML (so updates show immediately when online,
// falling back to cache when offline), cache-first for static assets,
// always skip Google API calls (they need fresh auth).

const CACHE = 'trackbudget-v1-2-14-9'; // -9: Undo last sync copy moved to IndexedDB (PLS #479). -8: account sheet buttons no longer spread out on PC (PSS #477 fix). v1.2.14 continued: Excel export offline, receivables per person, plain wording, bigger tap areas, Add from an account, no Idle alert (PLS #473-#474, #477-#478, PSS #475-#476)
const APP_SHELL = ['./', './index.html'];
// PLS #473: the Excel export library lives on cdnjs; keep a copy so export works offline
const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => Promise.all([
      cache.addAll(APP_SHELL).catch(() => {}),
      cache.add(new Request(XLSX_URL, { mode: 'cors' })).catch(() => {}) // PLS #473
    ]))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Never intercept Google APIs (Drive auth, etc.) — must hit network
  if (url.includes('googleapis.com') || url.includes('google.com') ||
      url.includes('accounts.google') || url.includes('gstatic.com')) {
    return;
  }
  // Only handle GET
  if (e.request.method !== 'GET') return;

  // Network-first for the app HTML / navigations: always serve the freshest index.html when
  // online (this app is a single HTML file), falling back to cache only when offline. This is
  // what makes a normal refresh pick up new deploys immediately — no double-refresh needed.
  const isAppHtml = e.request.mode === 'navigate' ||
                    url.endsWith('/') || url.endsWith('/index.html');
  if (isAppHtml) {
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Return cached, refresh in background
        fetch(e.request).then(resp => {
          if (resp && resp.status === 200 && (resp.type === 'basic' || url === XLSX_URL)) { // PLS #473
            caches.open(CACHE).then(cache => cache.put(e.request, resp));
          }
        }).catch(() => {});
        return cached;
      }
      // Not cached — fetch and cache
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && (resp.type === 'basic' || url === XLSX_URL)) { // PLS #473
          const respClone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, respClone));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

// Listen for manual cache refresh
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
  if (e.data === 'CLEAR_CACHE') {
    caches.delete(CACHE).then(() => e.source.postMessage('CACHE_CLEARED'));
  }
});
