(function(){
  'use strict';
  if(document.documentElement.dataset.avMotionLoaded) return;
  document.documentElement.dataset.avMotionLoaded='1';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>Array.from(c.querySelectorAll(s));

  function init(){
    document.body.classList.add('av-motion-live');

    const extra=document.createElement('style');
    extra.textContent=`
      .av-hero-img{width:100%;height:100%;object-fit:cover;display:block;border-radius:33px;background:#000;animation:avHeroBreath 9s ease-in-out infinite alternate}
      @keyframes avHeroBreath{from{transform:scale(1.01)}to{transform:scale(1.075)}}
      @media(max-width:760px){.hero-mobile-portrait img{display:block!important;animation:avHeroBreath 9s ease-in-out infinite alternate}}
      @media(prefers-reduced-motion:reduce){.av-hero-img{animation:none!important}}
    `;
    document.head.appendChild(extra);

    // Atmospheric layers
    const canvas=document.createElement('canvas'); canvas.id='av-space'; canvas.setAttribute('aria-hidden','true'); document.body.prepend(canvas);
    const aurora=document.createElement('div'); aurora.className='av-aurora'; aurora.setAttribute('aria-hidden','true'); document.body.prepend(aurora);
    const progress=document.createElement('div'); progress.className='av-scroll-progress'; progress.innerHTML='<i></i>'; document.body.appendChild(progress);
    const pbar=$('i',progress);
    addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;pbar.style.transform=`scaleX(${max?scrollY/max:0})`},{passive:true});

    // Lightweight star field
    const ctx=canvas.getContext('2d'); let stars=[],w=0,h=0,dpr=1;
    function resize(){dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:Math.min(95,Math.max(38,Math.floor(w/14)))},()=>({x:Math.random()*w,y:Math.random()*h,r:.35+Math.random()*1.1,a:.15+Math.random()*.62,s:.03+Math.random()*.09,p:Math.random()*6.28}));}
    function draw(t=0){ctx.clearRect(0,0,w,h);const sc=scrollY*.03;stars.forEach((s,i)=>{const y=(s.y+sc*s.s)%h;const a=s.a*(.68+.32*Math.sin(t*.001+s.p));ctx.beginPath();ctx.fillStyle=i%12===0?`rgba(255,241,170,${a})`:`rgba(255,255,255,${a})`;ctx.arc(s.x,y,s.r,0,Math.PI*2);ctx.fill()});if(!reduced)requestAnimationFrame(draw)} resize();draw();addEventListener('resize',resize,{passive:true});

    // Hero cinematic visual and zodiac orbit, using an asset already on production.
    const hero=$('.hero');
    if(hero && !$('.av-hero-video',hero)){
      const zodiac='♈♉♊♋♌♍♎♏♐♑♒♓'.split('').map((z,i)=>`<span style="--i:${i}">${z}</span>`).join('');
      const visual=document.createElement('div'); visual.className='av-hero-video'; visual.setAttribute('aria-hidden','true');
      visual.innerHTML=`<div class="av-zodiac">${zodiac}</div><div class="av-orb-dot"></div><div class="av-hero-video-shell"><img class="av-hero-img" src="/assets/1000043152.png" alt=""><div class="av-video-label">AstroVip · timing premium</div></div>`;
      hero.appendChild(visual);
      const h1=$('h1',hero); if(h1 && !$('.av-char',h1)){const txt=h1.textContent.trim();h1.textContent='';[...txt].forEach(ch=>{const sp=document.createElement('span');sp.className='av-char';sp.textContent=ch===' '?'\u00a0':ch;h1.appendChild(sp)})}
    }

    // Reactive card light, no tilt (keeps the site's straight-line visual rule)
    if(fine&&!reduced){$$('.card').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--av-mx',`${((e.clientX-r.left)/r.width)*100}%`);el.style.setProperty('--av-my',`${((e.clientY-r.top)/r.height)*100}%`)}));}

    // Premium cursor on desktop
    if(fine&&!reduced){const dot=document.createElement('div'),halo=document.createElement('div');dot.className='av-cursor-dot';halo.className='av-cursor-halo';document.body.append(dot,halo);let mx=innerWidth/2,my=innerHeight/2,hx=mx,hy=my;addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx-2.5}px,${my-2.5}px)`},{passive:true});(function follow(){hx+=(mx-hx)*.15;hy+=(my-hy)*.15;halo.style.transform=`translate(${hx-19}px,${hy-19}px)`;requestAnimationFrame(follow)})();}

    // GSAP choreography with accessible fallback
    if(window.gsap && window.ScrollTrigger && !reduced){
      gsap.registerPlugin(ScrollTrigger);
      const heroContent=$('.hero-content');
      if(heroContent){const kids=Array.from(heroContent.children).filter(el=>!el.matches('h1'));gsap.set(kids,{opacity:0,y:24});const chars=$$('.av-char',heroContent);gsap.set(chars,{opacity:0,y:65});const tl=gsap.timeline({defaults:{ease:'power3.out'}});if(kids[0])tl.to(kids[0],{opacity:1,y:0,duration:.5});tl.to(chars,{opacity:1,y:0,duration:.8,stagger:.055,ease:'back.out(1.25)'},'-=.2');kids.slice(1).forEach((el,i)=>tl.to(el,{opacity:1,y:0,duration:.58},i?'-=.42':'-=.38'));}
      const hv=$('.av-hero-video'); if(hv){gsap.fromTo(hv,{opacity:0,yPercent:-45,scale:.91},{opacity:1,yPercent:-50,scale:1,duration:1.05,ease:'power4.out'});gsap.to(hv,{scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1.1},yPercent:-39,scale:.94,ease:'none'});}
      $$('.av-reveal, main section:not(.hero) .title, main section:not(.hero) .split, main section:not(.hero) .grid, main section:not(.hero) .steps, main section:not(.hero) .price-grid, main section:not(.hero) .box').forEach(el=>gsap.fromTo(el,{opacity:0,y:42},{opacity:1,y:0,duration:.82,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}}));
      $$('.trust-item strong').forEach(el=>{const m=el.textContent.trim().match(/^(\d+)(.*)$/);if(!m)return;const n=+m[1],suf=m[2];const o={v:0};gsap.to(o,{v:n,duration:1.15,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true},onUpdate:()=>el.textContent=Math.round(o.v)+suf})});
    } else {
      $$('.av-char').forEach(el=>{el.style.opacity='1';el.style.transform='none'});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
