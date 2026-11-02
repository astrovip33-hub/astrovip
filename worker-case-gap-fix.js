import app from './worker-ai-discovery.js';

const CASE_GAP_FIX = `<style id="av-case-gap-fix-20261102b">
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
    padding:12px 0 8px!important;
  }
  #studii-de-caz-home .av-case-showcase-grid{
    display:flex!important;
    align-items:stretch!important;
    gap:10px!important;
    width:100%!important;
    height:auto!important;
    min-height:0!important;
    max-height:none!important;
    margin:0!important;
    padding:4px 4% 8px!important;
    overflow-x:auto!important;
    overflow-y:hidden!important;
    scroll-snap-type:x mandatory!important;
    scroll-padding-inline:4%!important;
  }
  #studii-de-caz-home .av-case-showcase-card{
    display:grid!important;
    grid-template-columns:38% minmax(0,1fr)!important;
    grid-template-rows:auto!important;
    align-items:stretch!important;
    align-self:stretch!important;
    flex:0 0 92%!important;
    width:92%!important;
    min-width:92%!important;
    max-width:92%!important;
    height:auto!important;
    min-height:0!important;
    max-height:none!important;
    margin:0!important;
    overflow:hidden!important;
    scroll-snap-align:start!important;
    scroll-snap-stop:always!important;
  }
  #studii-de-caz-home .av-case-showcase-visual{
    grid-column:1!important;
    grid-row:1!important;
    align-self:stretch!important;
    width:100%!important;
    height:auto!important;
    min-height:250px!important;
    max-height:none!important;
    margin:0!important;
    aspect-ratio:auto!important;
    overflow:hidden!important;
    background:#02070d!important;
  }
  #studii-de-caz-home .av-case-showcase-visual>a{
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
  }
  #studii-de-caz-home .av-case-showcase-copy{
    grid-column:2!important;
    grid-row:1!important;
    display:flex!important;
    flex-direction:column!important;
    min-width:0!important;
    height:auto!important;
    min-height:250px!important;
    max-height:none!important;
    box-sizing:border-box!important;
    padding:13px 11px 12px!important;
    overflow:visible!important;
  }
  #studii-de-caz-home .av-case-showcase-eyebrow{
    margin:0 0 5px!important;
    font-size:8px!important;
    line-height:1.2!important;
    letter-spacing:.08em!important;
  }
  #studii-de-caz-home .av-case-showcase-copy h3{
    margin:0!important;
    font-size:15px!important;
    line-height:1.08!important;
    overflow:visible!important;
  }
  #studii-de-caz-home .av-case-showcase-meta{
    margin:6px 0!important;
    font-size:8.5px!important;
    line-height:1.25!important;
  }
  #studii-de-caz-home .av-case-showcase-lead{
    display:block!important;
    -webkit-line-clamp:unset!important;
    -webkit-box-orient:initial!important;
    overflow:visible!important;
    margin:5px 0 9px!important;
    font-size:9.5px!important;
    line-height:1.35!important;
  }
  #studii-de-caz-home .av-case-showcase-cta{
    min-height:31px!important;
    margin-top:auto!important;
    padding:7px 8px!important;
    font-size:8px!important;
    line-height:1.15!important;
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
    margin-top:10px!important;
    margin-bottom:0!important;
  }
}
@media(max-width:390px){
  #studii-de-caz-home .av-case-showcase-card{grid-template-columns:39% minmax(0,1fr)!important}
  #studii-de-caz-home .av-case-showcase-visual{min-height:245px!important}
  #studii-de-caz-home .av-case-showcase-copy{min-height:245px!important;padding:12px 10px 11px!important}
}
@media(max-width:360px){
  #studii-de-caz-home .av-case-showcase-card{grid-template-columns:40% minmax(0,1fr)!important}
  #studii-de-caz-home .av-case-showcase-visual{min-height:240px!important}
  #studii-de-caz-home .av-case-showcase-copy{min-height:240px!important;padding:11px 9px 10px!important}
  #studii-de-caz-home .av-case-showcase-copy h3{font-size:14px!important}
  #studii-de-caz-home .av-case-showcase-lead{font-size:9px!important;line-height:1.32!important}
}
</style>
<script id="av-case-gap-fix-script-20261102b">(()=>{
  const imp=(el,p,v)=>el&&el.style.setProperty(p,v,'important');
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

    imp(track,'display','flex');
    imp(track,'align-items','stretch');
    imp(track,'gap','10px');
    imp(track,'width','100%');
    imp(track,'height','auto');
    imp(track,'min-height','0');
    imp(track,'max-height','none');
    imp(track,'margin','0');
    imp(track,'padding','4px 4% 8px');
    imp(track,'overflow-x','auto');
    imp(track,'overflow-y','hidden');
    imp(track,'scroll-snap-type','x mandatory');
    imp(track,'scroll-padding-inline','4%');

    const narrow=innerWidth<=360;
    const phone=innerWidth<=390;
    const visualMin=narrow?240:(phone?245:250);
    const visualCols=narrow?'40%':(phone?'39%':'38%');

    track.querySelectorAll('.av-case-showcase-card').forEach(card=>{
      imp(card,'display','grid');
      imp(card,'grid-template-columns',visualCols+' minmax(0,1fr)');
      imp(card,'grid-template-rows','auto');
      imp(card,'align-items','stretch');
      imp(card,'align-self','stretch');
      imp(card,'flex','0 0 92%');
      imp(card,'width','92%');
      imp(card,'min-width','92%');
      imp(card,'max-width','92%');
      imp(card,'height','auto');
      imp(card,'min-height','0');
      imp(card,'max-height','none');
      imp(card,'overflow','hidden');
      imp(card,'scroll-snap-align','start');

      const visual=card.querySelector('.av-case-showcase-visual');
      if(visual){
        imp(visual,'width','100%');
        imp(visual,'height','auto');
        imp(visual,'min-height',visualMin+'px');
        imp(visual,'max-height','none');
        imp(visual,'aspect-ratio','auto');
        imp(visual,'overflow','hidden');
        const link=visual.querySelector('a');
        imp(link,'display','block');
        imp(link,'width','100%');
        imp(link,'height','100%');
        const img=visual.querySelector('img');
        imp(img,'display','block');
        imp(img,'width','100%');
        imp(img,'height','100%');
        imp(img,'object-fit','contain');
        imp(img,'object-position','center');
      }

      const copy=card.querySelector('.av-case-showcase-copy');
      if(copy){
        imp(copy,'display','flex');
        imp(copy,'flex-direction','column');
        imp(copy,'height','auto');
        imp(copy,'min-height',visualMin+'px');
        imp(copy,'max-height','none');
        imp(copy,'overflow','visible');
      }
      const lead=card.querySelector('.av-case-showcase-lead');
      if(lead){
        imp(lead,'display','block');
        imp(lead,'-webkit-line-clamp','unset');
        imp(lead,'-webkit-box-orient','initial');
        imp(lead,'overflow','visible');
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

    const cta=frame.querySelector('a[href="/studii-de-caz/"]')?.parentElement;
    if(cta){imp(cta,'margin-top','10px');imp(cta,'margin-bottom','0')}
    s.dataset.caseGapFix='2';
  };

  const boot=()=>{
    apply();
    requestAnimationFrame(apply);
    [0,80,250,700,1400,2200,3500].forEach(ms=>setTimeout(apply,ms));
    new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{childList:true,subtree:true});
  };
  boot();
  addEventListener('load',apply,{once:true});
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
