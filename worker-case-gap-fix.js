import app from './worker-ai-discovery.js';

const CASE_GAP_FIX = `<style id="av-case-gap-fix-20261102c">
@media(max-width:820px){
  #studii-de-caz-home,
  #studii-de-caz-home > .wrap,
  #studii-de-caz-home .av-case-showcase-frame{
    height:auto!important;
    min-height:0!important;
    max-height:none!important;
  }
  #studii-de-caz-home{overflow:hidden!important}
  #studii-de-caz-home .av-case-showcase-frame{
    display:block!important;
    grid-template-rows:none!important;
    overflow:hidden!important;
    padding:10px 0 8px!important;
  }
  #studii-de-caz-home .av-case-showcase-grid{
    display:flex!important;
    align-items:stretch!important;
    gap:10px!important;
    width:100%!important;
    height:300px!important;
    min-height:300px!important;
    max-height:300px!important;
    margin:0!important;
    padding:4px 5% 6px!important;
    box-sizing:border-box!important;
    overflow-x:auto!important;
    overflow-y:hidden!important;
    scroll-snap-type:x mandatory!important;
    scroll-padding-inline:5%!important;
    scrollbar-width:none!important;
    -ms-overflow-style:none!important;
  }
  #studii-de-caz-home .av-case-showcase-grid::-webkit-scrollbar{display:none!important}
  #studii-de-caz-home .av-case-showcase-card{
    display:grid!important;
    grid-template-columns:44% minmax(0,1fr)!important;
    grid-template-rows:290px!important;
    align-items:stretch!important;
    align-self:stretch!important;
    flex:0 0 90%!important;
    width:90%!important;
    min-width:90%!important;
    max-width:90%!important;
    height:290px!important;
    min-height:290px!important;
    max-height:290px!important;
    aspect-ratio:auto!important;
    margin:0!important;
    overflow:hidden!important;
    border-radius:18px!important;
    scroll-snap-align:center!important;
    scroll-snap-stop:always!important;
  }
  #studii-de-caz-home .av-case-showcase-visual{
    position:relative!important;
    grid-column:1!important;
    grid-row:1!important;
    align-self:stretch!important;
    width:100%!important;
    height:290px!important;
    min-height:290px!important;
    max-height:290px!important;
    aspect-ratio:auto!important;
    margin:0!important;
    overflow:hidden!important;
    background-color:#02070d!important;
    background-size:cover!important;
    background-position:center!important;
    background-repeat:no-repeat!important;
  }
  #studii-de-caz-home .av-case-showcase-visual::after{
    content:""!important;
    position:absolute!important;
    inset:0!important;
    z-index:1!important;
    background:linear-gradient(90deg,rgba(2,7,13,.24),rgba(2,7,13,.50))!important;
    pointer-events:none!important;
  }
  #studii-de-caz-home .av-case-showcase-visual>a{
    position:relative!important;
    z-index:2!important;
    display:block!important;
    width:100%!important;
    height:100%!important;
  }
  #studii-de-caz-home .av-case-showcase-visual img{
    display:block!important;
    width:100%!important;
    height:100%!important;
    object-fit:contain!important;
    object-position:center!important;
    background:rgba(1,5,10,.22)!important;
  }
  #studii-de-caz-home .av-case-showcase-copy{
    grid-column:2!important;
    grid-row:1!important;
    display:flex!important;
    flex-direction:column!important;
    min-width:0!important;
    height:290px!important;
    min-height:290px!important;
    max-height:290px!important;
    box-sizing:border-box!important;
    padding:13px 11px 12px!important;
    overflow:hidden!important;
  }
  #studii-de-caz-home .av-case-showcase-eyebrow{
    margin:0 0 5px!important;
    font-size:8px!important;
    line-height:1.2!important;
    letter-spacing:.08em!important;
  }
  #studii-de-caz-home .av-case-showcase-copy h3{
    display:-webkit-box!important;
    -webkit-box-orient:vertical!important;
    -webkit-line-clamp:3!important;
    margin:0!important;
    font-size:15px!important;
    line-height:1.08!important;
    overflow:hidden!important;
  }
  #studii-de-caz-home .av-case-showcase-meta{
    display:-webkit-box!important;
    -webkit-box-orient:vertical!important;
    -webkit-line-clamp:2!important;
    margin:7px 0 5px!important;
    font-size:8.5px!important;
    line-height:1.25!important;
    overflow:hidden!important;
  }
  #studii-de-caz-home .av-case-showcase-lead{
    display:-webkit-box!important;
    -webkit-box-orient:vertical!important;
    -webkit-line-clamp:4!important;
    overflow:hidden!important;
    margin:5px 0 9px!important;
    font-size:9.5px!important;
    line-height:1.32!important;
  }
  #studii-de-caz-home .av-case-showcase-cta{
    min-height:32px!important;
    margin-top:auto!important;
    padding:7px 8px!important;
    font-size:8px!important;
    line-height:1.1!important;
  }
  #studii-de-caz-home .av-case-mobile-ticker{
    display:none!important;
    visibility:hidden!important;
    height:0!important;
    min-height:0!important;
    max-height:0!important;
    margin:0!important;
    padding:0!important;
    overflow:hidden!important;
  }
  #studii-de-caz-home .av-case-showcase-frame > div:has(> a[href="/studii-de-caz/"]){
    margin-top:8px!important;
    margin-bottom:0!important;
  }
  #studii-de-caz-home .av-case-mobile-nav-v7{
    margin-top:7px!important;
  }
}
@media(max-width:390px){
  #studii-de-caz-home .av-case-showcase-grid{height:292px!important;min-height:292px!important;max-height:292px!important}
  #studii-de-caz-home .av-case-showcase-card{grid-template-columns:45% minmax(0,1fr)!important;grid-template-rows:282px!important;height:282px!important;min-height:282px!important;max-height:282px!important}
  #studii-de-caz-home .av-case-showcase-visual,#studii-de-caz-home .av-case-showcase-copy{height:282px!important;min-height:282px!important;max-height:282px!important}
  #studii-de-caz-home .av-case-showcase-copy{padding:12px 10px 11px!important}
}
@media(max-width:360px){
  #studii-de-caz-home .av-case-showcase-grid{height:286px!important;min-height:286px!important;max-height:286px!important}
  #studii-de-caz-home .av-case-showcase-card{grid-template-columns:46% minmax(0,1fr)!important;grid-template-rows:276px!important;height:276px!important;min-height:276px!important;max-height:276px!important}
  #studii-de-caz-home .av-case-showcase-visual,#studii-de-caz-home .av-case-showcase-copy{height:276px!important;min-height:276px!important;max-height:276px!important}
  #studii-de-caz-home .av-case-showcase-copy{padding:11px 9px 10px!important}
  #studii-de-caz-home .av-case-showcase-copy h3{font-size:14px!important}
  #studii-de-caz-home .av-case-showcase-lead{-webkit-line-clamp:3!important;font-size:9px!important;line-height:1.28!important}
}
</style>
<script id="av-case-gap-fix-script-20261102c">(()=>{
  const imp=(el,p,v)=>el&&el.style.setProperty(p,v,'important');
  const stickyState=new Map();

  const setBottomCtaHidden=(hide)=>{
    [...document.body.querySelectorAll('*')].forEach(el=>{
      const cs=getComputedStyle(el);
      if(cs.position!=='fixed')return;
      const txt=(el.textContent||'').replace(/\s+/g,' ').toUpperCase();
      if(!(txt.includes('WHATSAPP')&&txt.includes('PROGRAMARE')))return;
      const r=el.getBoundingClientRect();
      if(r.width<180||r.height<35||r.top<innerHeight*.45)return;
      if(hide){
        if(!stickyState.has(el))stickyState.set(el,el.style.getPropertyValue('display'));
        imp(el,'display','none');
      }else if(stickyState.has(el)){
        const prev=stickyState.get(el)||'';
        if(prev)el.style.setProperty('display',prev);
        else el.style.removeProperty('display');
        stickyState.delete(el);
      }
    });
  };

  const apply=()=>{
    if(innerWidth>820)return;
    const s=document.getElementById('studii-de-caz-home');
    const wrap=s?.querySelector(':scope > .wrap');
    const frame=s?.querySelector('.av-case-showcase-frame');
    const track=s?.querySelector('.av-case-showcase-grid');
    if(!s||!frame||!track)return;

    [s,wrap,frame].filter(Boolean).forEach(el=>{
      imp(el,'height','auto');
      imp(el,'min-height','0');
      imp(el,'max-height','none');
    });
    imp(frame,'display','block');
    imp(frame,'grid-template-rows','none');
    imp(frame,'overflow','hidden');

    const narrow=innerWidth<=360;
    const phone=innerWidth<=390;
    const cardH=narrow?276:(phone?282:290);
    const trackH=cardH+10;
    const visualCols=narrow?'46%':(phone?'45%':'44%');

    imp(track,'display','flex');
    imp(track,'align-items','stretch');
    imp(track,'gap','10px');
    imp(track,'width','100%');
    imp(track,'height',trackH+'px');
    imp(track,'min-height',trackH+'px');
    imp(track,'max-height',trackH+'px');
    imp(track,'margin','0');
    imp(track,'padding','4px 5% 6px');
    imp(track,'box-sizing','border-box');
    imp(track,'overflow-x','auto');
    imp(track,'overflow-y','hidden');
    imp(track,'scroll-snap-type','x mandatory');
    imp(track,'scroll-padding-inline','5%');

    track.querySelectorAll('.av-case-showcase-card').forEach(card=>{
      imp(card,'display','grid');
      imp(card,'grid-template-columns',visualCols+' minmax(0,1fr)');
      imp(card,'grid-template-rows',cardH+'px');
      imp(card,'align-items','stretch');
      imp(card,'align-self','stretch');
      imp(card,'flex','0 0 90%');
      imp(card,'width','90%');
      imp(card,'min-width','90%');
      imp(card,'max-width','90%');
      imp(card,'height',cardH+'px');
      imp(card,'min-height',cardH+'px');
      imp(card,'max-height',cardH+'px');
      imp(card,'aspect-ratio','auto');
      imp(card,'overflow','hidden');
      imp(card,'scroll-snap-align','center');

      const visual=card.querySelector('.av-case-showcase-visual');
      if(visual){
        imp(visual,'position','relative');
        imp(visual,'width','100%');
        imp(visual,'height',cardH+'px');
        imp(visual,'min-height',cardH+'px');
        imp(visual,'max-height',cardH+'px');
        imp(visual,'aspect-ratio','auto');
        imp(visual,'overflow','hidden');
        const link=visual.querySelector('a');
        imp(link,'position','relative');
        imp(link,'z-index','2');
        imp(link,'display','block');
        imp(link,'width','100%');
        imp(link,'height','100%');
        const img=visual.querySelector('img');
        if(img){
          const src=img.currentSrc||img.src||img.getAttribute('src')||'';
          if(src)visual.style.setProperty('background-image',`url("${src.replace(/"/g,'%22')}")`,'important');
          imp(visual,'background-size','cover');
          imp(visual,'background-position','center');
          imp(img,'display','block');
          imp(img,'width','100%');
          imp(img,'height','100%');
          imp(img,'object-fit','contain');
          imp(img,'object-position','center');
          imp(img,'background','rgba(1,5,10,.22)');
        }
      }

      const copy=card.querySelector('.av-case-showcase-copy');
      if(copy){
        imp(copy,'display','flex');
        imp(copy,'flex-direction','column');
        imp(copy,'height',cardH+'px');
        imp(copy,'min-height',cardH+'px');
        imp(copy,'max-height',cardH+'px');
        imp(copy,'overflow','hidden');
      }
      const title=card.querySelector('.av-case-showcase-copy h3');
      if(title){
        imp(title,'display','-webkit-box');
        imp(title,'-webkit-box-orient','vertical');
        imp(title,'-webkit-line-clamp','3');
        imp(title,'overflow','hidden');
      }
      const meta=card.querySelector('.av-case-showcase-meta');
      if(meta){
        imp(meta,'display','-webkit-box');
        imp(meta,'-webkit-box-orient','vertical');
        imp(meta,'-webkit-line-clamp','2');
        imp(meta,'overflow','hidden');
      }
      const lead=card.querySelector('.av-case-showcase-lead');
      if(lead){
        imp(lead,'display','-webkit-box');
        imp(lead,'-webkit-box-orient','vertical');
        imp(lead,'-webkit-line-clamp',narrow?'3':'4');
        imp(lead,'overflow','hidden');
      }
    });

    const ticker=frame.querySelector('.av-case-mobile-ticker');
    if(ticker){
      imp(ticker,'display','none');
      imp(ticker,'visibility','hidden');
      imp(ticker,'height','0');
      imp(ticker,'min-height','0');
      imp(ticker,'max-height','0');
      imp(ticker,'margin','0');
      imp(ticker,'padding','0');
      imp(ticker,'overflow','hidden');
    }

    const allCta=frame.querySelector('a[href="/studii-de-caz/"]')?.parentElement;
    if(allCta){imp(allCta,'margin-top','8px');imp(allCta,'margin-bottom','0')}
    s.dataset.caseGapFix='3';
  };

  const setupVisibility=()=>{
    const s=document.getElementById('studii-de-caz-home');
    if(!s||s.dataset.caseStickyObserver==='1')return;
    s.dataset.caseStickyObserver='1';
    new IntersectionObserver(entries=>{
      const e=entries[0];
      setBottomCtaHidden(Boolean(e?.isIntersecting&&e.intersectionRatio>.08));
    },{threshold:[0,.08,.2,.5]}).observe(s);
  };

  const boot=()=>{
    apply();
    setupVisibility();
    requestAnimationFrame(()=>{apply();setupVisibility()});
    [0,80,250,700,1400,2200,3500].forEach(ms=>setTimeout(()=>{apply();setupVisibility()},ms));
    new MutationObserver(()=>requestAnimationFrame(()=>{apply();setupVisibility()})).observe(document.documentElement,{childList:true,subtree:true});
  };
  boot();
  addEventListener('load',()=>{apply();setupVisibility()},{once:true});
  addEventListener('resize',apply,{passive:true});
})();</script>`;

export default {
  async fetch(request, env, ctx) {
    const response = await app.fetch(request, env, ctx);
    const type = response.headers.get('content-type') || '';
    const url = new URL(request.url);
    if (request.method === 'HEAD' || !response.ok || !type.includes('text/html') || url.pathname !== '/') {
      return response;
    }
    return new HTMLRewriter()
      .on('body', {
        element(element) {
          element.append(CASE_GAP_FIX, {html:true});
        }
      })
      .transform(response);
  }
};
