(()=>{'use strict';const root=document.getElementById('av-services-slider');if(!root)return;const track=root.querySelector('.sv-track'),cards=[...root.querySelectorAll('.sv-card')],prev=root.querySelector('[data-sv-prev]'),next=root.querySelector('[data-sv-next]'),count=root.querySelector('.sv-count');let index=0,frame;const update=()=>{let d=Infinity;cards.forEach((c,i)=>{let n=Math.abs(c.getBoundingClientRect().left-track.getBoundingClientRect().left-parseFloat(getComputedStyle(track).paddingLeft));if(n<d){d=n;index=i}});count.textContent=(index+1)+' / '+cards.length;prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2};const go=dir=>{const c=cards[Math.max(0,Math.min(cards.length-1,index+dir))];track.scrollTo({left:c.offsetLeft-track.offsetLeft-parseFloat(getComputedStyle(track).paddingLeft),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)},{passive:true});track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(e.key==='ArrowRight'?1:-1)}});window.addEventListener('resize',update,{passive:true});update()})();

/* Preview 2026-11-02: midpoint studies autoplay opposite to the case-studies slider.
   Cards enter from the right and travel to the left; manual swipe remains enabled. */
(()=>{
  'use strict';

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches)return;

  const init=()=>{
    const track=document.querySelector('#astrovip-puncte-mijlocii .av-midpoint-track');
    if(!track||track.dataset.avMidpointAutoplay==='reverse')return !!track;

    const slides=[...track.querySelectorAll('.av-midpoint-slide')];
    if(slides.length<2)return !!track;

    track.dataset.avMidpointAutoplay='reverse';

    /* Clone the first card as a sentinel so the 45→1 loop is visually seamless. */
    const sentinel=slides[0].cloneNode(true);
    sentinel.setAttribute('aria-hidden','true');
    sentinel.tabIndex=-1;
    sentinel.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(el=>el.tabIndex=-1);
    track.appendChild(sentinel);

    let timer=null;
    let resumeTimer=null;
    let locked=false;

    const leftFor=slide=>slide.offsetLeft-track.offsetLeft;
    const nearestIndex=()=>{
      const x=track.scrollLeft;
      let best=0,dist=Infinity;
      slides.forEach((slide,i)=>{
        const d=Math.abs(leftFor(slide)-x);
        if(d<dist){dist=d;best=i}
      });
      return best;
    };

    const step=()=>{
      if(locked||document.hidden)return;
      const current=nearestIndex();
      if(current<slides.length-1){
        /* Increasing scrollLeft makes the visible cards move right → left. */
        track.scrollTo({left:leftFor(slides[current+1]),behavior:'smooth'});
        return;
      }

      /* Move left onto the cloned first card, then reset invisibly to the real first card. */
      track.scrollTo({left:leftFor(sentinel),behavior:'smooth'});
      window.setTimeout(()=>{
        if(!locked)track.scrollTo({left:leftFor(slides[0]),behavior:'auto'});
      },720);
    };

    const start=()=>{
      if(timer||locked||document.hidden)return;
      timer=window.setInterval(step,4300);
    };
    const stop=()=>{
      if(timer){window.clearInterval(timer);timer=null}
    };
    const pause=()=>{
      locked=true;
      stop();
      if(resumeTimer){window.clearTimeout(resumeTimer);resumeTimer=null}
    };
    const resume=(delay=1800)=>{
      locked=false;
      if(resumeTimer)window.clearTimeout(resumeTimer);
      resumeTimer=window.setTimeout(()=>{resumeTimer=null;start()},delay);
    };

    track.addEventListener('pointerdown',pause,{passive:true});
    track.addEventListener('pointerup',()=>resume(2600),{passive:true});
    track.addEventListener('pointercancel',()=>resume(2600),{passive:true});
    track.addEventListener('touchstart',pause,{passive:true});
    track.addEventListener('touchend',()=>resume(2600),{passive:true});
    track.addEventListener('mouseenter',pause,{passive:true});
    track.addEventListener('mouseleave',()=>resume(1200),{passive:true});
    track.addEventListener('focusin',pause);
    track.addEventListener('focusout',()=>resume(1600));
    document.addEventListener('visibilitychange',()=>{document.hidden?stop():start()});

    start();
    return true;
  };

  if(!init()){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
    window.setTimeout(init,250);
    window.setTimeout(init,900);
  }
})();
