(()=>{'use strict';
const loadScript=(src)=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
const loadTicker=async()=>{const el=document.querySelector('[data-planet-ticker]');if(!el)return;try{await loadScript('/assets/vendor/astronomy-engine-2.1.19.min.js');await loadScript('/assets/planetary-ticker-core.js?v=20261002-axes2')}catch(e){el.textContent='Pozițiile planetelor sunt disponibile în pagina Live.'}};
const loadCounter=async()=>{const el=document.getElementById('visitorCountIdle');if(!el)return;try{const key='sb_publishable_Q_uY9n72m2bRQswqfF9esg_TFrK9qJ8';const r=await fetch('https://hhzsecdtqacyroxiywpm.supabase.co/rest/v1/rpc/register_site_visit',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:'{}',cache:'no-store'});if(!r.ok)throw new Error();const value=Number(await r.json());if(!Number.isFinite(value))throw new Error();el.textContent=new Intl.NumberFormat('ro-RO').format(value)}catch(e){el.closest('.visitor-counter')?.setAttribute('hidden','')}};
const once=(fn)=>{let done=false;return()=>{if(done)return;done=true;fn()}};
const bootTicker=once(loadTicker);
const bootCounter=once(loadCounter);
const schedule=()=>{
  ['scroll','pointerdown','touchstart','keydown'].forEach(type=>window.addEventListener(type,bootTicker,{once:true,passive:type!=='keydown'}));
  const counter=document.getElementById('visitorCountIdle');
  if(counter&&'IntersectionObserver'in window){
    const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){io.disconnect();bootCounter()}},{rootMargin:'300px 0px'});
    io.observe(counter);
  }else setTimeout(bootCounter,12000);
  setTimeout(bootTicker,12000);
};
if(document.readyState==='complete')schedule();else window.addEventListener('load',schedule,{once:true});
})();
