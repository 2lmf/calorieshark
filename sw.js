// Basic Service Worker to satisfy PWA install requirements
const CACHE_NAME = 'calorieshark-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './assets/logo_shark_digital_transparent.png',
    './assets/SharpShark_Logo_GreyOrange_Large.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
