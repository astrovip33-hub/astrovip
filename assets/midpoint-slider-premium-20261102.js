(()=>{
  'use strict';
  const section=document.getElementById('astrovip-puncte-mijlocii');
  if(!section||section.dataset.midpointReady==='1') return;
  const viewport=section.querySelector('.av-midpoint-viewport');
  const track=section.querySelector('.av-midpoint-track');
  const prev=section.querySelector('[data-midpoint-prev]');
  const next=section.querySelector('[data-midpoint-next]');
  const pause=section.querySelector('[data-midpoint-pause]');
  if(!viewport||!track) return;

  const originals=[...track.querySelectorAll('.av-midpoint-card')];
  if(originals.length<2) return;
  originals.forEach(card=>{
    const clone=card.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    clone.tabIndex=-1;
    track.appendChild(clone);
  });

  section.dataset.midpointReady='1';
  const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let manualPause=prefersReduced;
  let interactionPause=false;
  let pageHidden=document.hidden;
  let last=performance.now();
  let loopWidth=0;

  const speed=()=>window.innerWidth<=600?36:30;
  const recalc=()=>{ loopWidth=track.scrollWidth/2; };
  const paused=()=>manualPause||interactionPause||pageHidden;
  const normalize=()=>{
    if(!loopWidth) return;
    if(viewport.scrollLeft>=loopWidth) viewport.scrollLeft-=loopWidth;
    if(viewport.scrollLeft<0) viewport.scrollLeft+=loopWidth;
  };
  const cardStep=()=>{
    const card=track.querySelector('.av-midpoint-card');
    if(!card) return 260;
    const gap=parseFloat(getComputedStyle(track).gap||0);
    return card.getBoundingClientRect().width+gap;
  };
  const setPauseUi=()=>{
    if(!pause) return;
    pause.textContent=manualPause?'▶':'❚❚';
    pause.setAttribute('aria-pressed',String(manualPause));
    pause.setAttribute('aria-label',manualPause?'Pornește sliderul':'Pauză slider');
  };
  const nudge=delta=>{
    viewport.scrollLeft+=delta;
    normalize();
    interactionPause=true;
    window.clearTimeout(nudge.timer);
    nudge.timer=window.setTimeout(()=>{interactionPause=false;},1100);
  };
  const animate=now=>{
    const dt=Math.min((now-last)/1000,.05);
    last=now;
    if(!paused()&&loopWidth){
      viewport.scrollLeft+=speed()*dt;
      normalize();
    }
    requestAnimationFrame(animate);
  };

  prev?.addEventListener('click',()=>nudge(-cardStep()));
  next?.addEventListener('click',()=>nudge(cardStep()));
  pause?.addEventListener('click',()=>{manualPause=!manualPause;setPauseUi();});
  viewport.addEventListener('pointerenter',()=>{interactionPause=true;});
  viewport.addEventListener('pointerleave',()=>{interactionPause=false;});
  viewport.addEventListener('focusin',()=>{interactionPause=true;});
  viewport.addEventListener('focusout',()=>{interactionPause=false;});
  viewport.addEventListener('touchstart',()=>{interactionPause=true;},{passive:true});
  viewport.addEventListener('touchend',()=>{window.setTimeout(()=>{interactionPause=false;},900);},{passive:true});
  viewport.addEventListener('scroll',normalize,{passive:true});
  document.addEventListener('visibilitychange',()=>{pageHidden=document.hidden;last=performance.now();});
  window.addEventListener('resize',()=>{window.clearTimeout(recalc.timer);recalc.timer=window.setTimeout(recalc,120);});
  window.addEventListener('load',recalc,{once:true});

  recalc();
  setPauseUi();
  requestAnimationFrame(animate);
})();
