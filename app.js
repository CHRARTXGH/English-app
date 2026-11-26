/* Interfaz: navegación, inicio, lecciones y resultados. Las pestañas extra vienen de E4CC.views (js/views.js). */
(function(){
const E=window.E4CC,h=E.h,$=s=>document.querySelector(s),app=$('#app');E.views=E.views||{};
/* Apariencia Light/Dark: se guarda en localStorage y respeta la preferencia del sistema si no hay elección. */
const mode=()=>document.documentElement.dataset.theme||'light';
E.theme=t=>{document.documentElement.dataset.theme=t;document.querySelector('meta[name=theme-color]').setAttribute('content',t==='dark'?'#0b1020':'#f3f5fb');try{localStorage.setItem('e4cc.theme',t)}catch(e){}
 document.querySelectorAll('.th').forEach(b=>{const on=b.dataset.t===t;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)})};
const switcher=()=>h('div',{class:'theme',role:'group','aria-label':'Apariencia'},[['light','sun','Light'],['dark','moon','Dark']].map(([t,i,n])=>
 h('button',{class:'th'+(mode()===t?' on':''),'data-t':t,'aria-pressed':mode()===t,'aria-label':'Modo '+n,onclick:()=>E.theme(t)},E.i(i),h('span',{},n))));
E.hud=()=>$('#hud').replaceChildren(h('a',{href:'#',class:'brand'},h('i',{},'E4CC'),h('span',{class:'bn'},'Practice')),h('span',{class:'pill'},E.i('flame'),String(E.state.streak)),h('span',{class:'pill'},E.i('star'),`${E.state.xp} XP`),E.lookupBtn(),switcher());
E.load=cb=>{let n=E.manifest.length;if(!n)return cb();
 E.manifest.forEach(src=>{const s=document.createElement('script');s.async=false;s.src=src;s.onload=s.onerror=()=>--n||cb();document.head.append(s)})};
const modesOf=l=>Object.entries(E.modes).filter(([,m])=>m.ok(l)),col=l=>`--c:var(--k${E.lessons.indexOf(l)%6+1})`;
const hero=()=>{const xp=E.state.xp%100,s=E.state.streak;return h('div',{class:'hero'},h('div',{},
 h('h1',{},s?`¡${s} ${s>1?'días':'día'} de racha!`:'¡Empecemos hoy!'),h('p',{},'Un poco cada día vale más que mucho un solo día.'),
 h('div',{class:'bar'},h('i',{style:`width:${xp}%`})),h('small',{},`${xp}/100 XP para el nivel ${E.level()+1}`)),h('div',{class:'lvl'},h('b',{},E.level()),h('small',{},'nivel')))};
const tile=l=>{const ms=modesOf(l),s=E.prog(l.id).s||{};
 return h('a',{class:'lesson',href:'#'+l.id,style:col(l)},h('span',{class:'ic'},E.i(l.icon)),h('b',{},l.title),
  h('span',{class:'ft'},h('span',{class:'dots'},ms.map(([k,m])=>h('i',{class:s[k]>=70?'on':'',title:m.label}))),h('small',{},`${ms.filter(([k])=>s[k]>=70).length}/${ms.length}`)))};
const home=()=>app.replaceChildren(hero(),...[...new Set(E.lessons.map(l=>l.level))].map(v=>{
 const ls=E.lessons.filter(l=>l.level===v&&modesOf(l).length);return ls.length?h('section',{},h('h2',{},v),h('div',{class:'grid'},ls.map(tile))):null}).filter(Boolean));
const result=(l,k,r,stage,again)=>{
 const s=(E.prog(l.id).s=E.prog(l.id).s||{}),first=(s[k]||0)<70&&r.score>=70;
 s[k]=Math.max(s[k]||0,r.score);E.save();first&&E.addXP(20);
 stage.replaceChildren(h('div',{class:'done'},h('div',{class:'stars'},r.score>=40?[...Array(r.score>=90?3:r.score>=70?2:1)].map(()=>E.i('star')):E.i('zap')),h('h2',{},r.msg),
  h('p',{class:'muted'},first?'+20 XP de bonus':'Repite para mejorar tu puntaje.'),
  h('button',{class:'btn',onclick:again},'Repetir'),h('a',{class:'btn alt',href:'#'},'Más lecciones')))};
const lesson=l=>{
 const stage=h('div',{class:'stage'}),ms=modesOf(l);if(!ms.length)return home();
 const open=k=>{tabs.forEach(([x,b])=>b.classList.toggle('on',x===k));E.modes[k].run(l,stage,r=>result(l,k,r,stage,()=>open(k)))};
 const tabs=ms.map(([k,m])=>[k,h('button',{class:'tab',onclick:()=>open(k)},E.i(m.icon),m.label)]);
 app.replaceChildren(h('a',{href:'#',class:'bk'},E.i('arrow-left'),' Lecciones'),h('div',{class:'lh',style:col(l)},h('span',{class:'ic'},E.i(l.icon)),h('h1',{},l.title)),h('div',{class:'tabs'},tabs.map(t=>t[1])),stage);
 open(ms[0][0])};
const navbar=cur=>$('#nav').replaceChildren(...[['','home','Lecciones'],...Object.entries(E.views).map(([k,v])=>[k,v.icon,v.label])]
 .map(([k,i,t])=>h('a',{href:'#'+k,class:k===cur||(k===''&&!E.views[cur])?'on':''},h('span',{},E.i(i)),t)));
const route=()=>{const id=location.hash.slice(1),v=E.views[id],l=E.lessons.find(x=>x.id===id);E.hud();navbar(id);v?v.render(app):l?lesson(l):home();scrollTo(0,0)};
addEventListener('hashchange',route);
E.load(route);
})();
