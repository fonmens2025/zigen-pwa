/* 字根探秘 PWA Service Worker — 离线缓存全部资源 */
'use strict';
var CACHE = 'zigen-v54-' + Date.now();
var ASSETS = [
  './', './index.html', './styles.css', './manifest.json',
  './data_auto.js', './extras_data.js', './grade_data.js',
  './shuowen_stories.js', './shuowen_glyphs.js',
  './read_data.js', './read_data2.js', './read_classics.js',
  './read_data3.js', './read_books.js',
  './js/audio.js', './js/meta.js', './js/anim.js', './js/read.js'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(ASSETS.map(function (a) {
      return c.add(a).catch(function () { return null; });
    }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) {
      if (k !== CACHE) return caches.delete(k);
    }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (resp) {
        var clone = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
        return resp;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});
