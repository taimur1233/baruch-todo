var CACHE = "baruch-v1";
var ASSETS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })); self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})); })); self.clients.claim(); });
self.addEventListener("fetch", function(e){
  var url = new URL(e.request.url);
  if (url.pathname.endsWith("data.json")) {
    e.respondWith(fetch(e.request).then(function(r){ var c=r.clone(); caches.open(CACHE).then(function(cache){ cache.put("data.json", c); }); return r; })
      .catch(function(){ return caches.match("data.json"); }));
    return;
  }
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(function(r){ return r || fetch(e.request).then(function(res){ var c=res.clone(); caches.open(CACHE).then(function(cache){ cache.put(e.request, c); }); return res; }); }));
});
