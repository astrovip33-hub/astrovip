(()=>{
  'use strict';

  const init=()=>{
    const section=document.getElementById('studii-de-caz-home');
    if(!section||section.dataset.avSliderV7==='1') return;

    const track=section.querySelector('.av-case-showcase-grid');
    if(!track) return;

    const cards=[...track.querySelectorAll('.av-case-showcase-card')];
    if(cards.length<2) return;

    section.dataset.avSliderV7='1';

    let nav=section.querySelector('.av-case-mobile-nav-v7');
    if(!nav){
      nav=document.createElement('nav');
      nav.className='av-case-mobile-nav-v7';
      nav.setAttribute('aria-label','Navigare studii de caz');
      nav.innerHTML='<button type="button" class="av-case-arrow-v7" data-case-prev aria-label="Studiul anterior">‹</button><div class="av-case-dots-v7" data-case-dots aria-label="Alege studiul"></div><span class="av-case-count-v7" data-case-count aria-live="polite"></span><button type="button" class="av-case-arrow-v7" data-case-next aria-label="Studiul următor">›</button>';
      const frame=section.querySelector('.av-case-showcase-frame')||section;
      frame.appendChild(nav);
    }

    const prev=nav.querySelector('[data-case-prev]');
    const next=nav.querySelector('[data-case-next]');
    const dotsWrap=nav.querySelector('[data-case-dots]');
    const count=nav.querySelector('[data-case-count]');
    if(!prev||!next||!dotsWrap||!count) return;

    dotsWrap.textContent='';
    const dots=cards.map((card,i)=>{
      const dot=document.createElement('button');
      dot.type='button';
      dot.className='av-case-dot-v7';
      dot.setAttribute('aria-label','Studiul '+(i+1)+' din '+cards.length);
      dot.addEventListener('click',()=>go(i,true));
      dotsWrap.appendChild(dot);
      return dot;
    });

    let current=0;
    let raf=0;
    let autoTimer=0;
    let userPaused=false;

    const update=(i)=>{
      current=Math.max(0,Math.min(cards.length-1,i));
      dots.forEach((dot,n)=>{
        const active=n===current;
        dot.classList.toggle('is-active',active);
        dot.setAttribute('aria-current',active?'true':'false');
      });
      count.textContent=(current+1)+' / '+cards.length;
      prev.disabled=current===0;
      next.disabled=current===cards.length-1;
      const activeDot=dots[current];
      if(activeDot&&typeof activeDot.scrollIntoView==='function'){
        activeDot.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
      }
    };

    const leftFor=(card)=>{
      return Math.max(0,card.offsetLeft-(track.clientWidth-card.clientWidth)/2);
    };

    function go(i,smooth){
      const target=Math.max(0,Math.min(cards.length-1,i));
      const card=cards[target];
      if(!card) return;
      update(target);
      track.scrollTo({left:leftFor(card),behavior:smooth?'smooth':'auto'});
    }

    const syncFromScroll=()=>{
      raf=0;
      const center=track.scrollLeft+track.clientWidth/2;
      let best=0;
      let distance=Infinity;
      cards.forEach((card,i)=>{
        const cardCenter=card.offsetLeft+card.clientWidth/2;
        const d=Math.abs(cardCenter-center);
        if(d<distance){distance=d;best=i;}
      });
      if(best!==current) update(best);
    };

    const scheduleSync=()=>{
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(syncFromScroll);
    };

    const pauseAuto=()=>{
      userPaused=true;
      if(autoTimer) window.clearInterval(autoTimer);
      autoTimer=0;
    };

    const startAuto=()=>{
      if(userPaused||window.matchMedia('(prefers-reduced-motion: reduce)').matches||cards.length<2) return;
      if(autoTimer) window.clearInterval(autoTimer);
      autoTimer=window.setInterval(()=>{
        if(document.hidden||window.innerWidth>820) return;
        const target=current>=cards.length-1?0:current+1;
        go(target,true);
      },6500);
    };

    prev.addEventListener('click',()=>{pauseAuto();go(current-1,true);});
    next.addEventListener('click',()=>{pauseAuto();go(current+1,true);});
    track.addEventListener('scroll',scheduleSync,{passive:true});
    track.addEventListener('pointerdown',pauseAuto,{passive:true});
    track.addEventListener('touchstart',pauseAuto,{passive:true});
    track.addEventListener('wheel',pauseAuto,{passive:true});

    window.addEventListener('resize',()=>{
      window.clearTimeout(section._avCaseResizeTimer);
      section._avCaseResizeTimer=window.setTimeout(()=>go(current,false),120);
    },{passive:true});

    update(0);
    window.requestAnimationFrame(()=>go(0,false));
    startAuto();
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
