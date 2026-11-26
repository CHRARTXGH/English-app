/* Consulta rápida del diccionario: panel lateral (escritorio) u hoja inferior (móvil). Atajo: tecla «/». */
(function(){
const E=window.E4CC,h=E.h,S=E.state,fold=t=>t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
/* Consulta rápida: panel lateral (escritorio) u hoja inferior (móvil). Atajo: tecla «/». */
const out=h('div',{class:'list'}),inp=h('input',{type:'search',placeholder:'Palabra o expresión, en inglés o español','aria-label':'Buscar en el diccionario',autocomplete:'off'});
const draw=()=>{const f=fold(inp.value.trim()),D=E.dict||[],st=x=>fold(x[0]).startsWith(f)?0:1;
 const r=f?D.filter(x=>fold(x[0]).includes(f)||fold(x[1]).includes(f)).sort((a,b)=>st(a)-st(b)).slice(0,8):[];
 out.replaceChildren(...(r.length?r.map(([en,es,t])=>{const have=S.words.some(w=>w[0]===en),
  add=h('button',{class:'mini',title:'Guardar en Mis palabras','aria-label':'Guardar '+en+' en Mis palabras',onclick:()=>{E.addWord(en,es);add.replaceChildren(E.i('check'));add.disabled=true}},E.i(have?'check':'plus'));add.disabled=have;
  return h('div',{class:'row2'},h('div',{class:'w'},h('b',{},en),h('span',{},es),h('small',{},t)),h('button',{class:'mini','aria-label':'Escuchar '+en,onclick:()=>E.say(en)},E.i('volume')),add)}):[h('p',{class:'muted'},f?'Sin resultados.':'Escribe para buscar sin salir de tu práctica.')]))};
inp.addEventListener('input',draw);
document.body.append(h('div',{id:'qb',onclick:()=>E.quick(false)}),h('aside',{id:'qd',role:'dialog','aria-label':'Consulta rápida'},
 h('div',{class:'qh'},h('b',{},'Consulta rápida'),h('button',{class:'mini','aria-label':'Cerrar',onclick:()=>E.quick(false)},E.i('x'))),inp,out));
E.quick=o=>{document.body.classList.toggle('qopen',o);if(o){draw();inp.focus()}};
E.lookupBtn=()=>h('button',{class:'mini','aria-label':'Consulta rápida del diccionario',title:'Diccionario (/)',onclick:()=>E.quick(true)},E.i('search'));
addEventListener('keydown',e=>{if(e.key==='Escape')E.quick(false);else if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();E.quick(true)}});
})();
