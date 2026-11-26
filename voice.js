/* Voz natural: proveedor en la nube (proxy / ElevenLabs / Google) con caché → voz del navegador como respaldo.
   E4CC.say(texto) la usa en toda la app. Configuración: pestaña «Voz», o E4CC.ttsConfig={provider:'proxy',proxy:'/api/tts'} antes de cargar. */
(function(){
const E=window.E4CC,C=E.tts={cache:new Map(),error:'',cfg:{provider:'browser',key:'',voice:'',proxy:'/api/tts'}};
try{Object.assign(C.cfg,E.ttsConfig,JSON.parse(localStorage.getItem('e4cc.tts')))}catch(e){}
C.save=()=>{try{localStorage.setItem('e4cc.tts',JSON.stringify(C.cfg))}catch(e){}};
const ok=r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r};
const P={
 elevenlabs:async t=>(await ok(await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+(C.cfg.voice||'21m00Tcm4TlvDq8ikWAM'),
  {method:'POST',headers:{'xi-api-key':C.cfg.key,'Content-Type':'application/json'},body:JSON.stringify({text:t,model_id:'eleven_multilingual_v2'})}))).blob(),
 google:async t=>{const j=await(await ok(await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key='+encodeURIComponent(C.cfg.key),
  {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input:{text:t},voice:{languageCode:'en-US',name:C.cfg.voice||'en-US-Neural2-F'},audioConfig:{audioEncoding:'MP3'}})}))).json();
  return new Blob([Uint8Array.from(atob(j.audioContent),c=>c.charCodeAt(0))],{type:'audio/mpeg'})},
 proxy:async t=>(await ok(await fetch(C.cfg.proxy+'?text='+encodeURIComponent(t)))).blob()};
const best=()=>{const v=speechSynthesis.getVoices().filter(x=>/^en/i.test(x.lang));
 return v.find(x=>/natural|neural|online/i.test(x.name))||v.find(x=>/google|samantha|aria|jenny|zira/i.test(x.name))||v.find(x=>x.lang==='en-US')||v[0]};
const browser=t=>{try{const u=new SpeechSynthesisUtterance(t),v=best();u.lang='en-US';u.rate=.9;if(v)u.voice=v;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}};
const au=new Audio();
C.speak=async t=>{
 try{
  if(C.cfg.provider==='browser')throw 0;
  let u=C.cache.get(t);
  if(!u){u=URL.createObjectURL(await P[C.cfg.provider](t));C.cache.set(t,u)}
  au.src=u;await au.play();C.error='';return 'cloud'
 }catch(e){C.error=(e&&e.message)||'';browser(t);return 'browser'}};
E.say=t=>{C.speak(t)};
})();
