/* Service Worker · E4CC Practice. Sube VERSION si cambias la lista de archivos. */
const VERSION='e4cc-v1',CORE=VERSION+'-core',RUN=VERSION+'-run',NET_ONLY=['api.elevenlabs.io','texttospeech.googleapis.com'];
const ASSETS=["./", "css/styles.css", "data/basic0.js", "data/dictionary.js", "data/habits.js", "data/manifest.js", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon.svg", "icons/maskable-512.png", "icons/maskable.svg", "index.html", "js/app.js", "js/core.js", "js/icons.js", "js/lookup.js", "js/modes.js", "js/views.js", "js/voice.js", "manifest.webmanifest"];
addEventListener('install',e=>e.waitUntil(caches.open(CORE).then(c=>c.addAll(ASSETS)).then(()=>skipWaiting())));
addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>!k.startsWith(VERSION)).map(k=>caches.delete(k)))).then(()=>clients.claim())));
/* Archivos propios y fuentes de Google: caché primero y renovación en segundo plano. Voz en la nube y /api/: solo red. */
addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url),same=u.origin===location.origin,fonts=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
 if(r.method!=='GET'||NET_ONLY.includes(u.hostname)||u.pathname.includes('/api/')||(!same&&!fonts))return;
 e.respondWith((async()=>{
  const c=await caches.open(same?CORE:RUN),nav=r.mode==='navigate',key=nav?'index.html':r,hit=await c.match(key,{ignoreSearch:true});
  const net=fetch(r).then(x=>{if(x.status===200||x.type==='opaque')c.put(key,x.clone()).catch(()=>{});return x}).catch(()=>null);
  e.waitUntil(net);
  return hit||(await net)||(nav?await c.match('index.html'):Response.error());
 })())});
