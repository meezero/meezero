/* 월넛 픽셀 서재 — 오프라인 캐시 서비스 워커 */
const VERSION = 'walnut-v3';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL = [
  './',
  './index.html',
  './styles.css',
  './room.js',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './fonts/Galmuri11.woff2',
  './fonts/Galmuri11-Bold.woff2',
  './fonts/DeltaGlassKR.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 유튜브 썸네일 등 외부 이미지: 캐시 우선 (최대 60개)
  if (url.hostname.endsWith('ytimg.com') || url.hostname.endsWith('youtube.com') || /\.(png|jpe?g|webp|gif)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res && (res.ok || res.type === 'opaque')) {
            cache.put(req, res.clone());
            const keys = await cache.keys();
            if (keys.length > 60) cache.delete(keys[0]);
          }
          return res;
        } catch (e) {
          return new Response('', { status: 504 });
        }
      })
    );
    return;
  }

  // 문서 이동: 네트워크 우선, 실패하면 캐시된 셸
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // 나머지 같은 출처 자산: 캐시 우선 + 백그라운드 갱신
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const network = fetch(req).then((res) => {
          if (res && res.ok) caches.open(SHELL_CACHE).then((c) => c.put(req, res.clone()));
          return res;
        }).catch(() => hit);
        return hit || network;
      })
    );
  }
});
