const CACHE_NAME = "pwa-memo-cache-v1";
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/script.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// 서비스 워커 설치 및 캐싱
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// 요청을 가로채서 캐시된 파일 제공
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
