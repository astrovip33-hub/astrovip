/* AstroVip desktop-only pointer enhancement. No mobile DOM/style mutations. */
(function(){
  'use strict';
  if(document.documentElement.dataset.avMotionLoaded)return;
  document.documentElement.dataset.avMotionLoaded='1';
  function init(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(!matchMedia('(pointer: fine) and (min-width: 981px)').matches)return;
    document.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('pointermove',event=>{
        const box=card.getBoundingClientRect();
        card.style.setProperty('--av-mx',`${100*(event.clientX-box.left)/box.width}%`);
        card.style.setProperty('--av-my',`${100*(event.clientY-box.top)/box.height}%`);
      },{passive:true});
    });
  }
  if(document.readyState==='complete')init();
  else window.addEventListener('load',init,{once:true});
})();