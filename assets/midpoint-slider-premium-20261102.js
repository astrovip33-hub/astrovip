(()=>{
'use strict';
const section=document.getElementById('astrovip-puncte-mijlocii');
if(!section||section.dataset.midpointReady==='1')return;
const viewport=section.querySelector('.av-midpoint-viewport');
const track=section.querySelector('.av-midpoint-track');
const cards=[...section.querySelectorAll('.av-midpoint-card')];
if(!viewport||!track||cards.length<2)return;
section.dataset.midpointReady='1';
const prev=section.querySelector('[data-midpoint-prev]');
const next=section.querySelector('[data-midpoint-next]');
const pause=section.querySelector('[data-midpoint-pause]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let manualPause=true, interacting=false, direction=1, timer;
const intro=section.querySelector('.av-midpoint-intro');
if(intro)intro.textContent=cards.length+' de analize dedicate perechilor planetare. Imagini complete, fără text tăiat. Glisează spre stânga sau dreapta ori folosește săgețile.';
viewport.tabIndex=0;
viewport.setAttribute('role','region');
viewport.setAttribute('aria-roledescription','carusel');
const max=()=>Math.max(0,viewport.scrollWidth-viewport.clientWidth);
const step=()=>cards[1].offsetLeft-cards[0].offsetLeft;
const go=sign=>{
direction=sign;
const end=max(), current=viewport.scrollLeft;
const target=sign<0?(current<=2?end:Math.max(0,current-step())):(current>=end-2?0:Math.min(end,current+step()));
viewport.scrollTo({left:target,behavior:reduced.matches?'instant':'smooth'});
};
prev?.addEventListener('click',()=>go(-1));
next?.addEventListener('click',()=>go(1));
viewport.addEventListener('keydown',e=>{
if(e.target!==viewport)return;
if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(e.key==='ArrowLeft'?-1:1);}
});
const ui=()=>{if(pause){pause.textContent=manualPause?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(manualPause));pause.setAttribute('aria-label',manualPause?'Pornește sliderul':'Pauză slider');}};
pause?.addEventListener('click',()=>{manualPause=!manualPause;ui();});
const hold=()=>{clearTimeout(timer);interacting=true;};
const release=()=>{clearTimeout(timer);timer=setTimeout(()=>interacting=false,900);};
viewport.addEventListener('pointerenter',hold);
viewport.addEventListener('pointerleave',release);
viewport.addEventListener('focusin',hold);
viewport.addEventListener('focusout',release);
viewport.addEventListener('touchstart',hold,{passive:true});
viewport.addEventListener('touchend',release,{passive:true});
viewport.addEventListener('touchcancel',release,{passive:true});
setInterval(()=>{
if(manualPause||interacting||document.hidden)return;
if(viewport.scrollLeft>=max()-2)direction=-1;
if(viewport.scrollLeft<=2)direction=1;
go(direction);
},3500);
ui();
})();