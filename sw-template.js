const CACHE=__CACHE__,ASSETS=__ASSETS__;
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kino-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/')||u.pathname.startsWith('/__kino_offline__/'))return;
 if(r.mode==='navigate'){e.respondWith((async()=>{try{const result=await fetch(r);if(result.ok)return result;}catch{}return (await caches.open(CACHE)).match('/index.html');})());return;}
 if(ASSETS.includes(u.pathname))e.respondWith((async()=>{const c=await caches.open(CACHE);return (await c.match(u.pathname))||fetch(r);})());
});
