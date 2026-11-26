/* Modos de estudio (E4CC.modes) y tipos de pregunta (E4CC.types). Añade los tuyos con el mismo patrón. */
(function(){
const E=window.E4CC,h=E.h,M=E.modes,T=E.types;
const bar=p=>h('div',{class:'bar'},h('i',{style:`width:${p}%`}));

/* ---- Tipos de pregunta: (item, caja, resultado(bool)) ---- */
T.choice=(it,box,res)=>{
 const wrap=h('div',{class:'opts'});
 E.shuffle(it.options).forEach(o=>wrap.append(h('button',{class:'opt',onclick:e=>{
  [...wrap.children].forEach(b=>{b.disabled=true;if(b.textContent===it.answer)b.classList.add('right')});
  if(o!==it.answer)e.currentTarget.classList.add('wrong');res(o===it.answer)}},o)));
 box.append(h('h3',{},it.q),wrap)};
T.fill=(it,box,res)=>{
 const inp=h('input',{type:'text',autocomplete:'off',autocapitalize:'off',spellcheck:'false','aria-label':'Tu respuesta'});
 const go=()=>{if(inp.disabled)return;inp.disabled=true;btn.remove();res([].concat(it.answer).map(E.norm).includes(E.norm(inp.value)))};
 const btn=h('button',{class:'btn',onclick:go},'Comprobar');
 inp.addEventListener('keydown',e=>e.key==='Enter'&&go());
 box.append(h('h3',{},it.q),inp,btn);inp.focus()};
T.scramble=(it,box,res)=>{let w;do w=E.shuffle([...it.answer]).join('');while(w===it.answer);
 T.fill({...it,q:`Ordena las letras (${it.hint}): ${[...w].join(' ')}`},box,res)};
T.order=(it,box,res)=>{
 const line=h('div',{class:'line'}),bank=h('div',{class:'bank'}),a=[].concat(it.answer)[0];
 const chk=h('button',{class:'btn',onclick:()=>{[...bank.children,...line.children].forEach(b=>b.disabled=true);chk.remove();
  res(E.norm([...line.children].map(b=>b.textContent).join(' '))===E.norm(a))}},'Comprobar');
 E.shuffle(it.words||a.split(' ')).forEach(w=>{const b=h('button',{class:'chip'},w);
  b.onclick=()=>(b.parentNode===bank?line:bank).append(b);bank.append(b)});
 box.append(h('h3',{},it.q),line,bank,chk)};

/* ---- Ejecutor de series de preguntas ---- */
E.runSet=(items,root,fin)=>{
 let i=0,ok=0;
 const next=()=>{
  root.replaceChildren();
  if(i>=items.length)return fin({score:Math.round(ok/items.length*100),msg:`${ok} de ${items.length} correctas`});
  const it=items[i],box=h('div',{class:'q'});
  root.append(bar(i/items.length*100),h('p',{class:'muted'},`Pregunta ${i+1} de ${items.length}`),box);
  T[it.type](it,box,good=>{
   if(good){ok++;E.addXP(10)}
   box.append(h('p',{class:good?'ok':'bad'},E.i(good?'check':'x'),good?'¡Correcto!':`Respuesta: ${[].concat(it.answer)[0]}`),
    h('button',{class:'btn',onclick:()=>{i++;next()}},i+1<items.length?'Siguiente':'Ver resultado'))});
 };
 next()};

/* ---- Modos: {label, icon, ok(lección), run(lección, contenedor, fin)} ---- */
M.cards={label:'Tarjetas',icon:'layers',ok:l=>l.vocab?.length,run(l,root,fin){
 const q=E.shuffle(l.vocab),total=q.length;
 const draw=()=>{
  root.replaceChildren();
  if(!q.length)return fin({score:100,msg:`¡Dominaste las ${total} tarjetas!`});
  const [en,es]=q[0],card=h('div',{class:'card',tabindex:0,role:'button','aria-label':'Voltear tarjeta'},
   h('div',{class:'front'},en,h('button',{class:'icon','aria-label':'Escuchar',onclick:e=>{e.stopPropagation();E.say(en)}},E.i('volume'))),
   h('div',{class:'back'},es));
  const flip=()=>card.classList.toggle('flip');
  card.addEventListener('click',flip);
  card.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();flip()}});
  root.append(bar((total-q.length)/total*100),h('p',{class:'muted'},`Quedan ${q.length} · toca la tarjeta para voltearla`),card,
   h('div',{class:'row'},h('button',{class:'btn alt',onclick:()=>{q.push(q.shift());draw()}},E.i('repeat'),' Repasar'),
    h('button',{class:'btn',onclick:()=>{q.shift();E.addXP(2);draw()}},E.i('check'),' Lo sé')))};
 draw()}};
M.quiz={label:'Quiz',icon:'target',ok:l=>l.vocab?.length>=4,run(l,root,fin){
 E.runSet(E.shuffle(l.vocab).slice(0,8).map(([en,es])=>{
  const d=Math.random()<.5,ans=d?es:en,pool=[...new Set(l.vocab.map(v=>v[d?1:0]))].filter(x=>x!==ans);
  return{type:'choice',q:d?`¿Qué significa “${en}”?`:`¿Cómo se dice “${es}” en inglés?`,answer:ans,options:[ans,...E.shuffle(pool).slice(0,3)]}}),root,fin)}};
M.practice={label:'Ejercicios',icon:'pencil',ok:l=>l.exercises?.length,run:(l,root,fin)=>E.runSet(l.exercises,root,fin)};
M.tasks={label:'Tareas',icon:'clipboard',ok:l=>l.tasks?.length,run(l,root){
 const p=E.prog(l.id),st=p.t=p.t||{},sc=p.s=p.s||{};
 const upd=()=>{sc.tasks=Math.round(l.tasks.filter((_,i)=>st[i]?.done).length/l.tasks.length*100);E.save()};
 root.replaceChildren(h('p',{class:'muted'},'Marca cada tarea al terminarla (+15 XP) y guarda tus notas.'),
  ...l.tasks.map((t,i)=>{const s=st[i]=st[i]||{done:false,note:''};
   const cb=h('input',{type:'checkbox',onchange:()=>{if(cb.checked&&!s.done)E.addXP(15);s.done=cb.checked;upd()}});cb.checked=s.done;
   const ta=h('textarea',{rows:3,placeholder:'Tus notas o tu texto…',oninput:()=>{s.note=ta.value;E.save()}},s.note);
   return h('div',{class:'task'},h('label',{},cb,t),ta)}))}};
})();
