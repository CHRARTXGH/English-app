/* Núcleo: registro de lecciones, utilidades, progreso y gamificación (XP, nivel, racha). */
(function(){
const E=window.E4CC=window.E4CC||{lessons:[],types:{},modes:{},manifest:[]};
E.addLesson=l=>E.lessons.push(l);
E.h=(t,a,...k)=>{const e=document.createElement(t);for(const x in a||{}){const v=a[x];x.startsWith('on')?e.addEventListener(x.slice(2),v):x==='class'?e.className=v:e.setAttribute(x,v)}
 k.flat().forEach(c=>c!=null&&c!==false&&e.append(c));return e};
E.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
E.norm=s=>String(s).toLowerCase().replace(/[’‘]/g,"'").replace(/-/g,' ').replace(/[.,!?¿¡]/g,'').replace(/\s+/g,' ').trim();
E.say=t=>{try{const u=new SpeechSynthesisUtterance(t);u.lang='en-US';speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}};
const K='e4cc.v1';
E.state=(()=>{try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}})();
Object.assign(E.state,{xp:E.state.xp||0,streak:E.state.streak||0,last:E.state.last||'',p:E.state.p||{}});
E.save=()=>{try{localStorage.setItem(K,JSON.stringify(E.state))}catch(e){}};
E.prog=id=>E.state.p[id]=E.state.p[id]||{};
const day=d=>d.toLocaleDateString('en-CA');
E.addXP=n=>{const s=E.state,t=day(new Date()),y=day(new Date(Date.now()-864e5));
 if(s.last!==t){s.streak=s.last===y?s.streak+1:1;s.last=t}
 s.xp+=n;E.save();E.hud&&E.hud()};
E.level=()=>Math.floor(E.state.xp/100)+1;
})();
