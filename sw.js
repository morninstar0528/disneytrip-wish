const CACHE='disney-journey-v12';
const LOCAL=['./','./index.html','./styles.css','./js/app.js','./js/data.js','./js/crypto.js','./js/firebase.js','./assets/castle-fireworks.jpg','./assets/wish-cruise.jpg','./assets/epcot-sphere.jpg','./assets/mickey-castle-menu.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match('./index.html'))))});
