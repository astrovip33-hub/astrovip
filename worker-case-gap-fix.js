import app from './worker-ai-discovery.js';

const CASE_GAP_FIX = `<style id="av-case-gap-fix-20261102">
@media(max-width:820px){
  #studii-de-caz-home,
  #studii-de-caz-home > .wrap,
  #studii-de-caz-home .av-case-showcase-frame{
    height:auto!important;
    min-height:0!important;
    max-height:none!important;
  }
  #studii-de-caz-home .av-case-showcase-frame{
    display:block!important;
    grid-template-rows:none!important;
    overflow:hidden!important;
    padding:14px 0 10px!important;
  }
  #studii-de-caz-home .av-case-showcase-grid{
    height:230px!important;
    min-height:230px!important;
    max-height:230px!important;
    margin-bottom:0!important;
  }
  #studii-de-caz-home .av-case-showcase-frame > div:has(> a[href="/studii-de-caz/"]){
    margin-top:12px!important;
    margin-bottom:0!important;
  }
}
@media(max-width:390px){
  #studii-de-caz-home .av-case-showcase-grid{
    height:215px!important;
    min-height:215px!important;
    max-height:215px!important;
  }
}
@media(max-width:360px){
  #studii-de-caz-home .av-case-showcase-grid{
    height:210px!important;
    min-height:210px!important;
    max-height:210px!important;
  }
}
</style>
<script id="av-case-gap-fix-script-20261102">(()=>{
  const imp=(el,p,v)=>el&&el.style.setProperty(p,v,'important');
  const apply=()=>{
    if(innerWidth>820)return;
    const s=document.getElementById('studii-de-caz-home');
    const wrap=s?.querySelector(':scope > .wrap');
    const frame=s?.querySelector('.av-case-showcase-frame');
    const track=s?.querySelector('.av-case-showcase-grid');
    if(!s||!frame||!track)return;
    const h=innerWidth<=360?210:(innerWidth<=390?215:230);
    [s,wrap,frame].filter(Boolean).forEach(el=>{
      imp(el,'height','auto');
      imp(el,'min-height','0');
      imp(el,'max-height','none');
    });
    imp(frame,'display','block');
    imp(frame,'grid-template-rows','none');
    imp(frame,'overflow','hidden');
    imp(track,'height',h+'px');
    imp(track,'min-height',h+'px');
    imp(track,'max-height',h+'px');
    imp(track,'margin-bottom','0');
    const cta=frame.querySelector('a[href="/studii-de-caz/"]')?.parentElement;
    if(cta){imp(cta,'margin-top','12px');imp(cta,'margin-bottom','0')}
    s.dataset.caseGapFix='1';
  };
  const boot=()=>{
    apply();
    requestAnimationFrame(apply);
    [80,250,700,1400,2200].forEach(ms=>setTimeout(apply,ms));
    new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
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
      .on('head', {
        element(element) {
          element.append(CASE_GAP_FIX, {html:true});
        }
      })
      .transform(response);
  }
};
