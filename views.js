/* Vistas extra (pestañas): hábitos, diccionario y ajustes de voz. Se registran en E4CC.views={id:{label,icon,render(contenedor)}}. */
(function(){
const E=window.E4CC,h=E.h,S=E.state;E.views=E.views||{};
S.words=S.words||[];S.hb=S.hb||{d:'',done:{},got:{}};
E.mine={id:'mis-palabras',level:'Mis palabras',title:'Mis palabras',icon:'star',get vocab(){return S.words}};E.addLesson(E.mine);
E.addWord=(en,es)=>{if(!S.words.some(w=>w[0]===en)){S.words.push([en,es]);E.save()}};
const fold=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

E.views.habitos={label:'Hábitos',icon:'check',render(app){
 const H=S.hb,day=new Date().toLocaleDateString('en-CA');H.p=H.p||{Yo:{d:H.d,done:H.done||{},got:H.got||{}}};if(!H.p[H.who])H.who=Object.keys(H.p)[0];
 const all=E.habits.flatMap(g=>g[2]),rt=h('span'),ring=h('div',{class:'ring'},rt),sum=h('p',{class:'muted'}),box=h('div'),people=h('div',{class:'chips'}),
  P=()=>{const x=H.p[H.who];if(x.d!==day){x.d=day;x.done={};x.got={}}return x};
 const upd=()=>{const D=P().done,n=all.filter(x=>D[x[0]]).length,p=Math.round(n/all.length*100);ring.style.setProperty('--p',p);rt.textContent=p+'%';sum.textContent=`${H.who}: ${n} de ${all.length} hábitos hoy`};
 const draw=()=>{const X=P(),me=H.who===Object.keys(H.p)[0],nm=h('input',{type:'text',placeholder:'Añadir familiar o amigo',maxlength:20,'aria-label':'Nombre de la persona'});
  const add=()=>{const n=nm.value.trim();if(n&&!H.p[n]){H.p[n]={d:day,done:{},got:{}};H.who=n;E.save();draw()}};
  nm.addEventListener('keydown',e=>e.key==='Enter'&&add());
  people.replaceChildren(...Object.keys(H.p).map(n=>h('button',{class:'cp'+(n===H.who?' on':''),onclick:()=>{H.who=n;E.save();draw()}},n)));
  box.replaceChildren(h('div',{class:'row2 add'},nm,h('button',{class:'mini','aria-label':'Añadir persona',onclick:add},E.i('plus'))),
   ...E.habits.map(([,t,items])=>h('section',{},h('h2',{},t),h('div',{class:'list'},items.map(([id,ic,name,tip])=>{
    const b=h('button',{class:'hb'+(X.done[id]?' on':''),'aria-pressed':!!X.done[id],onclick:()=>{
     X.done[id]=!X.done[id];if(X.done[id]&&!X.got[id]){X.got[id]=1;me?E.addXP(5):E.save()}else E.save();
     b.classList.toggle('on',X.done[id]);b.setAttribute('aria-pressed',!!X.done[id]);upd()}},
     h('span',{class:'hi'},E.i(ic)),h('span',{class:'ht'},h('b',{},name),h('small',{},tip)),h('span',{class:'chk'},E.i('check')));return b})))));
  upd()};
 app.replaceChildren(h('h1',{},'Hábitos de hoy'),h('div',{class:'hero hab'},ring,h('div',{},h('b',{},'La constancia gana a la intensidad'),sum)),people,box);draw()}};

E.views.diccionario={label:'Diccionario',icon:'search',render(app){
 const D=E.dict||[],tops=[...new Set(D.map(r=>r[2]))].sort();let top='',q='';
 const out=h('div',{class:'list'}),chips=h('div',{class:'chips'}),inp=h('input',{type:'search',placeholder:'Busca en inglés o en español…','aria-label':'Buscar palabra',autocomplete:'off',oninput:()=>{q=inp.value;draw()}});
 const draw=()=>{const f=fold(q.trim());
  const r=D.filter(x=>(!top||x[2]===top)&&(!f||fold(x[0]).includes(f)||fold(x[1]).includes(f))).sort((a,b)=>fold(a[0]).startsWith(f)?(fold(b[0]).startsWith(f)?0:-1):(fold(b[0]).startsWith(f)?1:0));
  chips.replaceChildren(...tops.map(t=>h('button',{class:'cp'+(t===top?' on':''),onclick:()=>{top=t===top?'':t;draw()}},t)));
  out.replaceChildren(h('p',{class:'muted'},`${r.length} resultado${r.length===1?'':'s'}${r.length>40?' · mostrando 40':''}`),...r.slice(0,40).map(([en,es,t])=>{
   const have=S.words.some(w=>w[0]===en),add=h('button',{class:'mini',title:'Guardar en Mis palabras','aria-label':'Guardar '+en+' en Mis palabras',onclick:()=>{E.addWord(en,es);add.replaceChildren(E.i('check'));add.disabled=true}},have?E.i('check'):E.i('plus'));add.disabled=have;
   return h('div',{class:'row2'},h('div',{class:'w'},h('b',{},en),h('span',{},es),h('small',{},t)),h('button',{class:'mini',title:'Escuchar','aria-label':'Escuchar '+en,onclick:()=>E.say(en)},E.i('volume')),add)}))};
 app.replaceChildren(h('h1',{},'Diccionario'),h('p',{class:'muted'},`${D.length} palabras y frases (edición demo). Guarda las que quieras practicar en «Mis palabras».`),inp,chips,out);draw()}};

E.views.voz={label:'Voz',icon:'mic',render(app){
 const C=E.tts,c=C.cfg,msg=h('p',{class:'muted'}),f=(l,k,t,ph)=>{const i=h('input',{type:t,value:c[k]||'',placeholder:ph,autocomplete:'off',oninput:()=>{c[k]=i.value}});return h('label',{class:'fld'},l,i)};
 const sel=h('select',{onchange:()=>{c.provider=sel.value}},...[['browser','Voz del navegador'],['proxy','Mi servidor proxy (recomendado)'],['elevenlabs','ElevenLabs con clave directa (solo pruebas)'],['google','Google Cloud TTS con clave directa (solo pruebas)']].map(([v,t])=>{const o=h('option',{value:v},t);o.selected=c.provider===v;return o}));
 app.replaceChildren(h('h1',{},'Voz natural'),h('div',{class:'stage'},h('label',{class:'fld'},'Proveedor',sel),f('Clave de API','key','password',''),f('Voz (ID de ElevenLabs o nombre de Google)','voice','text','21m00Tcm4TlvDq8ikWAM · en-US-Neural2-F'),f('URL del proxy','proxy','text','/api/tts'),
  h('button',{class:'btn',onclick:async()=>{C.save();msg.textContent='Probando…';const r=await C.speak('Hello! Nice to meet you. How are you today?');msg.textContent=r==='cloud'?'Sonando con '+c.provider:'Aviso: '+(C.error?C.error+' · ':'')+'se usó la voz del navegador'}},'Guardar y probar'),msg,
  h('p',{class:'muted'},'Una clave guardada en el navegador la puede ver quien use este equipo: úsala solo para probar. Para publicar, usa el proxy (tools/proxy.mjs): la clave se queda en el servidor.')))}};
})();
