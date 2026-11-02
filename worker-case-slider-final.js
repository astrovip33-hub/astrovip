import app from './worker-case-gap-fix.js';

const FINAL_CASE_SLIDER_POLISH = `<style id="av-case-slider-final-20261102">
@media(max-width:820px){
  #studii-de-caz-home{scroll-margin-top:96px!important}
  #studii-de-caz-home .av-case-showcase-copy h3{
    display:-webkit-box!important;
    -webkit-box-orient:vertical!important;
    -webkit-line-clamp:5!important;
    font-size:14px!important;
    line-height:1.05!important;
    overflow:hidden!important;
  }
}
@media(max-width:360px){
  #studii-de-caz-home{scroll-margin-top:90px!important}
  #studii-de-caz-home .av-case-showcase-copy h3{
    -webkit-line-clamp:5!important;
    font-size:13px!important;
    line-height:1.04!important;
  }
}
</style>
<script id="av-case-slider-final-script-20261102">(()=>{
  const imp=(el,p,v)=>el&&el.style.setProperty(p,v,'important');
  const apply=()=>{
    if(innerWidth>820)return;
    const section=document.getElementById('studii-de-caz-home');
    if(!section)return;
    imp(section,'scroll-margin-top',innerWidth<=360?'90px':'96px');
    section.querySelectorAll('.av-case-showcase-copy h3').forEach(title=>{
      imp(title,'display','-webkit-box');
      imp(title,'-webkit-box-orient','vertical');
      imp(title,'-webkit-line-clamp','5');
      imp(title,'font-size',innerWidth<=360?'13px':'14px');
      imp(title,'line-height',innerWidth<=360?'1.04':'1.05');
      imp(title,'overflow','hidden');
    });
    section.dataset.caseSliderFinal='3';
  };
  const boot=()=>{
    apply();
    requestAnimationFrame(apply);
    [80,250,700,1400,2500,3800,5200].forEach(ms=>setTimeout(apply,ms));
    new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('resize',apply,{passive:true});
})();</script>`;

const CASE_MIDPOINT_SYNC_PRODUCTION = `<style id="av-case-midpoint-measured-production-v1">
@media(max-width:820px){
  #studii-de-caz-home{overflow:hidden!important;height:auto!important;min-height:0!important;max-height:none!important}
  #studii-de-caz-home>.wrap{height:auto!important;min-height:0!important;max-height:none!important}
  #studii-de-caz-home .av-case-showcase-frame{box-sizing:border-box!important;height:auto!important;min-height:0!important;max-height:none!important;padding:0!important;border:0!important;overflow:hidden!important}
  #studii-de-caz-home .av-case-showcase-grid{box-sizing:border-box!important;display:flex!important;gap:0!important;padding:0!important;margin:0!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-padding-inline:0!important;scroll-snap-type:x mandatory!important;scrollbar-width:none!important;-ms-overflow-style:none!important}
  #studii-de-caz-home .av-case-showcase-grid::-webkit-scrollbar{display:none!important}
  #studii-de-caz-home .av-case-showcase-card{box-sizing:border-box!important;display:grid!important;flex:none!important;margin:0!important;border-radius:18px!important;overflow:hidden!important;scroll-snap-align:start!important;scroll-snap-stop:always!important}
  #studii-de-caz-home .av-case-showcase-visual{box-sizing:border-box!important;grid-column:1/2!important;grid-row:1!important;position:relative!important;inset:auto!important;margin:0!important;aspect-ratio:auto!important;overflow:hidden!important;justify-self:stretch!important;align-self:stretch!important}
  #studii-de-caz-home .av-case-showcase-copy{box-sizing:border-box!important;grid-column:2/3!important;grid-row:1!important;position:relative!important;inset:auto!important;margin:0!important;overflow:hidden!important;justify-self:stretch!important;align-self:stretch!important}
  #studii-de-caz-home .av-case-showcase-visual>a,#studii-de-caz-home .av-case-showcase-visual img{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;object-fit:cover!important}
}
</style><script id="av-case-midpoint-measured-production-js-v1">(()=>{
  const imp=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important')};
  let raf=0;
  let resizeObserver=null;
  let styleObserver=null;
  let applying=false;
  const sync=()=>{
    raf=0;
    if(applying||innerWidth>820)return;
    const s=document.getElementById('studii-de-caz-home');
    const wrap=s?.querySelector(':scope > .wrap');
    const frame=s?.querySelector('.av-case-showcase-frame');
    const track=s?.querySelector('.av-case-showcase-grid');
    const cards=track?[...track.querySelectorAll('.av-case-showcase-card')]:[];
    const mid=document.querySelector('#astrovip-puncte-mijlocii .av-midpoint-slide');
    const art=mid?.querySelector('.av-midpoint-art');
    const copy=mid?.querySelector('.av-midpoint-copy');
    if(!s||!frame||!track||!cards.length||!mid||!art||!copy)return;
    const mr=mid.getBoundingClientRect(),ar=art.getBoundingClientRect(),pr=copy.getBoundingClientRect();
    if(mr.width<100||mr.height<100||ar.width<40||pr.width<80)return;
    const w=mr.width,h=mr.height,innerH=Math.max(ar.height,pr.height),artW=ar.width,copyW=pr.width;
    applying=true;
    [s,wrap,frame].filter(Boolean).forEach(el=>{imp(el,'height','auto');imp(el,'min-height','0');imp(el,'max-height','none')});
    imp(frame,'width',w+'px');imp(frame,'max-width',w+'px');imp(frame,'position','relative');imp(frame,'left','50%');imp(frame,'transform','translateX(-50%)');imp(frame,'margin-left','0');imp(frame,'margin-right','0');imp(frame,'padding','0');imp(frame,'border','0');
    imp(track,'width',w+'px');imp(track,'min-width',w+'px');imp(track,'max-width',w+'px');imp(track,'height',h+'px');imp(track,'min-height',h+'px');imp(track,'max-height',h+'px');imp(track,'gap','0px');imp(track,'padding','0px');imp(track,'margin','0');imp(track,'scroll-padding-inline','0px');imp(track,'align-items','stretch');
    cards.forEach(card=>{
      imp(card,'display','grid');imp(card,'grid-template-columns',artW+'px '+copyW+'px');imp(card,'grid-template-rows',innerH+'px');imp(card,'flex','0 0 '+w+'px');imp(card,'width',w+'px');imp(card,'min-width',w+'px');imp(card,'max-width',w+'px');imp(card,'height',h+'px');imp(card,'min-height',h+'px');imp(card,'max-height',h+'px');imp(card,'scroll-snap-align','start');
      const v=card.querySelector('.av-case-showcase-visual');
      const c=card.querySelector('.av-case-showcase-copy');
      imp(v,'grid-column','1 / 2');imp(v,'grid-row','1');imp(v,'width',artW+'px');imp(v,'min-width',artW+'px');imp(v,'max-width',artW+'px');imp(v,'height',innerH+'px');imp(v,'min-height',innerH+'px');imp(v,'max-height',innerH+'px');imp(v,'justify-self','stretch');imp(v,'align-self','stretch');imp(v,'aspect-ratio','auto');
      imp(c,'grid-column','2 / 3');imp(c,'grid-row','1');imp(c,'width',copyW+'px');imp(c,'min-width',copyW+'px');imp(c,'max-width',copyW+'px');imp(c,'height',innerH+'px');imp(c,'min-height',innerH+'px');imp(c,'max-height',innerH+'px');imp(c,'justify-self','stretch');imp(c,'align-self','stretch');
      const mcs=getComputedStyle(copy);imp(c,'padding-top',mcs.paddingTop);imp(c,'padding-right',mcs.paddingRight);imp(c,'padding-bottom',mcs.paddingBottom);imp(c,'padding-left',mcs.paddingLeft);imp(c,'justify-content',mcs.justifyContent||'center');
    });
    s.dataset.caseMidpointSync='1';
    if(!resizeObserver&&window.ResizeObserver){
      resizeObserver=new ResizeObserver(queue);
      [mid,art,copy,track,cards[0]].filter(Boolean).forEach(el=>resizeObserver.observe(el));
    }
    if(!styleObserver){
      styleObserver=new MutationObserver(()=>{if(!applying)queue()});
      styleObserver.observe(s,{subtree:true,attributes:true,attributeFilter:['style']});
    }
    setTimeout(()=>{applying=false},0);
  };
  const queue=()=>{if(applying||raf)return;raf=requestAnimationFrame(sync)};
  const boot=()=>{
    sync();
    [50,90,120,260,280,650,720,1200,1270,1420,1800,2220,2400,3000,3520,3700,4500,5600,6200].forEach(d=>setTimeout(sync,d));
    new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
    window.addEventListener('resize',queue,{passive:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
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
          element.append(FINAL_CASE_SLIDER_POLISH + CASE_MIDPOINT_SYNC_PRODUCTION, { html: true });
        }
      })
      .transform(response);
  }
};
