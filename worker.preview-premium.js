import base from './worker.js';

const PREMIUM_WOW_HEAD = `
<meta name="astrovip-premium-preview" content="wow3-20261006">
<link rel="stylesheet" href="/assets/premium-home-preview-20261006.css?v=wow3-20261006-1">
<link rel="stylesheet" href="/assets/premium-home-wow-preview-20261006.css?v=wow3-20261006-1">
<script src="/assets/page-editor-runtime.js?v=wow3-2c9193aa" defer></script>
<script id="astrovip-wow3-direct">
(()=>{
  const orbit=()=>{const o=document.createElement('div');o.className='av-wow-orbit';o.setAttribute('aria-hidden','true');o.innerHTML='<span class="av-wow-orbit__ring"></span><span class="av-wow-orbit__axis"></span><span class="av-wow-orbit__core"></span>';return o};
  const init=()=>{
    document.documentElement.dataset.avWowForced='wow3';
    const dv=document.querySelector('.v63d-hero-visual');if(dv&&!dv.querySelector('.av-wow-orbit'))dv.appendChild(orbit());
    const mv=document.querySelector('.v63-visual');if(mv&&!mv.querySelector('.av-wow-orbit'))mv.appendChild(orbit());
    const ds=document.querySelector('#v63d-servicii');if(ds&&!document.querySelector('.av-signature-wow--desktop')){const s=document.createElement('section');s.className='av-signature-wow av-signature-wow--desktop';s.innerHTML='<div class="av-signature-wow__inner"><div class="av-signature-wow__copy"><div class="av-signature-wow__kicker">ASTROVIP SIGNATURE</div><h2>TIMING-UL <span>SCHIMBĂ TOTUL.</span></h2><p>Nu este suficient să știi ce potențial există. Diferența apare când identifici momentul potrivit pentru decizie, acțiune și schimbare.</p><div class="av-signature-wow__line"></div></div><div class="av-signature-wow__art"><div class="av-signature-wow__glow"></div></div></div>';s.querySelector('.av-signature-wow__art').appendChild(orbit());ds.insertAdjacentElement('afterend',s)}
    const ms=document.querySelector('#v63-servicii');if(ms&&!document.querySelector('.av-signature-wow--mobile')){const s=document.createElement('section');s.className='av-signature-wow av-signature-wow--mobile';s.innerHTML='<div class="av-signature-wow__art"></div><div class="av-signature-wow__copy"><div class="av-signature-wow__kicker">ASTROVIP SIGNATURE</div><h2>TIMING-UL <span>SCHIMBĂ TOTUL.</span></h2><p>Momentul potrivit poate schimba o decizie, o relație, o carieră sau o direcție.</p></div>';s.querySelector('.av-signature-wow__art').appendChild(orbit());ms.insertAdjacentElement('afterend',s)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
</script>`;

export default {
  async fetch(request, env, ctx) {
    const response = await base.fetch(request, env, ctx);
    const url = new URL(request.url);
    const ct = response.headers.get('content-type') || '';
    if (response.ok && ct.includes('text/html') && (url.pathname === '/' || url.pathname === '')) {
      return new HTMLRewriter()
        .on('head', { element(el) { el.append(PREMIUM_WOW_HEAD, { html: true }); } })
        .transform(response);
    }
    return response;
  }
};
