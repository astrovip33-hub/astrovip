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
    section.dataset.caseSliderFinal='1';
  };
  const boot=()=>{
    apply();
    requestAnimationFrame(apply);
    [80,250,700,1400,2500].forEach(ms=>setTimeout(apply,ms));
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
      .on('body', {
        element(element) {
          element.append(FINAL_CASE_SLIDER_POLISH, { html: true });
        }
      })
      .transform(response);
  }
};
