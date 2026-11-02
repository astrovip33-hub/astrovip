import app from './worker-home-ultra.js';

const LLMS_DISCOVERY_LINK = '<link rel="describedby" href="/llms.txt" type="text/plain">';

const CANONICAL_NAP = `<div class="av-canonical-nap" aria-label="Date de contact AstroVip"><strong>AstroVip.ro · Cătălin Smaranda</strong><span>Bulevardul Unirii 33, București · <a href="tel:+40722128220">0722 128 220</a> · <a href="https://astrovip.ro/">astrovip.ro</a></span><span><a href="/despre-astrovip/">Cătălin Smaranda astrolog București</a></span></div>`;
const CANONICAL_NAP_STYLE = `<style id="av-canonical-nap-style">.av-canonical-nap{box-sizing:border-box;width:min(1120px,calc(100% - 28px));margin:18px auto 0;padding:12px 16px;border-top:1px solid rgba(231,198,106,.28);border-bottom:1px solid rgba(57,255,20,.13);color:#cfd8d2;text-align:center;font:650 12px/1.55 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.01em}.av-canonical-nap strong{color:#f0d887;font-weight:850}.av-canonical-nap span{display:block;margin-top:2px}.av-canonical-nap a{color:#d9efe0!important;text-decoration:none}.av-canonical-nap a:hover{text-decoration:underline;text-underline-offset:3px}@media(max-width:620px){.av-canonical-nap{width:calc(100% - 24px);padding:11px 10px;font-size:11px;line-height:1.6}}</style>`;
const HOME_AUTHORITY_STYLE = `<style id="av-home-local-authority-style">.av-home-local-authority{box-sizing:border-box;width:min(1120px,calc(100% - 28px));margin:10px auto 16px;padding:9px 14px;border:1px solid rgba(231,198,106,.28);border-radius:12px;background:linear-gradient(180deg,rgba(8,17,13,.92),rgba(3,8,6,.96));color:#d8dfda;text-align:center;font:700 12px/1.45 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}.av-home-local-authority strong{color:#f1d983}.av-home-local-authority a{color:#9cf4b7!important;font-weight:850;text-decoration:none}.av-home-local-authority a:hover{text-decoration:underline;text-underline-offset:3px}.av-home-local-authority--mobile{display:none}@media(max-width:820px){.av-home-local-authority--desktop{display:none!important}.av-home-local-authority--mobile{display:block!important;width:calc(100% - 24px);margin:9px 12px 13px;padding:9px 11px;font-size:11px;line-height:1.5;border-radius:11px}}</style>`;
const HOME_AUTHORITY_MOBILE = `<div class="av-home-local-authority av-home-local-authority--mobile"><strong>Cătălin Smaranda · Astrolog București</strong> · Bulevardul Unirii 33 · Consultații 1:1 premium · 5,0/5 din 32 recenzii · <a href="/despre-astrovip/">Despre AstroVip</a></div>`;
const HOME_AUTHORITY_DESKTOP = `<div class="av-home-local-authority av-home-local-authority--desktop"><strong>Cătălin Smaranda · Astrolog București</strong> · Bulevardul Unirii 33 · Consultații 1:1 premium · 5,0/5 din 32 recenzii · <a href="/despre-astrovip/">Despre AstroVip</a></div>`;
const HOME_ABOUT_HARD_KILL = `<style id="av-about-hard-kill-20261101">.av-about-home{display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}</style><script id="av-about-hard-kill-script-20261101">(()=>{const k=()=>document.querySelectorAll('.av-about-home').forEach(n=>n.remove());if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',k,{once:true});else k();new MutationObserver(k).observe(document.documentElement,{childList:true,subtree:true})})();</script>`;
const HOME_CASE_COMPACT_STYLE = `<style id="av-case-compact-production-20261102">
@media(min-width:821px){
#studii-de-caz-home .av-case-showcase-frame{--av-desktop-case-width:min(56vw,620px)!important}
#studii-de-caz-home .av-case-showcase-grid{display:flex!important;align-items:stretch!important;overflow-x:auto!important;overflow-y:hidden!important}
#studii-de-caz-home .av-case-showcase-card{display:grid!important;grid-template-columns:190px minmax(0,1fr)!important;grid-template-rows:300px!important;align-items:stretch!important;height:300px!important;min-height:300px!important;max-height:300px!important;border-radius:18px!important;overflow:hidden!important}
#studii-de-caz-home .av-case-showcase-visual{grid-column:1!important;grid-row:1!important;flex:0 0 190px!important;width:190px!important;height:300px!important;min-height:300px!important;max-height:300px!important;margin:0!important}
#studii-de-caz-home .av-case-showcase-copy{grid-column:2!important;grid-row:1!important;display:flex!important;flex-direction:column!important;min-width:0!important;height:300px!important;box-sizing:border-box!important;padding:20px 22px!important;overflow:hidden!important}
#studii-de-caz-home .av-case-showcase-copy h3{font-size:clamp(23px,2.3vw,30px)!important;line-height:1.04!important}
#studii-de-caz-home .av-case-showcase-lead{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;overflow:hidden!important}
#studii-de-caz-home .av-case-showcase-cta{min-height:36px!important;padding:8px 12px!important;font-size:10px!important}
}
@media(max-width:820px){
#studii-de-caz-home{overflow:hidden!important}
#studii-de-caz-home .av-case-showcase-frame{width:min(100%,430px)!important;margin-inline:auto!important;overflow:hidden!important;padding:14px 0 10px!important}
#studii-de-caz-home .av-case-showcase-grid{display:flex!important;grid-template-columns:none!important;align-items:stretch!important;gap:0!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;scroll-padding-inline:0!important;scrollbar-width:none!important;-ms-overflow-style:none!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-inline:contain!important;touch-action:pan-x pan-y!important}
#studii-de-caz-home .av-case-showcase-grid::-webkit-scrollbar{display:none!important}
#studii-de-caz-home .av-case-showcase-card{display:grid!important;grid-template-columns:36% 64%!important;grid-template-rows:230px!important;align-items:stretch!important;align-self:stretch!important;flex:0 0 100%!important;width:100%!important;min-width:100%!important;max-width:100%!important;height:230px!important;min-height:230px!important;max-height:230px!important;margin:0!important;border-radius:18px!important;overflow:hidden!important;scroll-snap-align:start!important;scroll-snap-stop:always!important}
#studii-de-caz-home .av-case-showcase-visual{grid-column:1!important;grid-row:1!important;flex:none!important;width:100%!important;height:230px!important;min-height:230px!important;max-height:230px!important;margin:0!important;aspect-ratio:auto!important;overflow:hidden!important}
#studii-de-caz-home .av-case-showcase-visual>a,#studii-de-caz-home .av-case-showcase-visual img{display:block!important;width:100%!important;height:100%!important}
#studii-de-caz-home .av-case-showcase-visual img{object-fit:cover!important;object-position:center 47%!important}
#studii-de-caz-home .av-case-showcase-copy{grid-column:2!important;grid-row:1!important;display:flex!important;flex-direction:column!important;min-width:0!important;height:230px!important;box-sizing:border-box!important;padding:13px 12px 13px 13px!important;overflow:hidden!important}
#studii-de-caz-home .av-case-showcase-eyebrow{margin:0 0 5px!important;font-size:8px!important;line-height:1.15!important;letter-spacing:.08em!important}
#studii-de-caz-home .av-case-showcase-copy h3{margin:0!important;font-size:clamp(15px,4.4vw,18px)!important;line-height:1.04!important}
#studii-de-caz-home .av-case-showcase-meta{margin:5px 0!important;font-size:8.5px!important;line-height:1.2!important}
#studii-de-caz-home .av-case-showcase-lead{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:4!important;overflow:hidden!important;margin:5px 0 7px!important;font-size:9.5px!important;line-height:1.3!important}
#studii-de-caz-home .av-case-showcase-cta{min-height:34px!important;margin-top:auto!important;padding:7px 10px!important;border-radius:999px!important;font-size:9px!important;line-height:1.1!important;letter-spacing:.025em!important}
#studii-de-caz-home .av-case-mobile-nav-v7{display:grid!important;grid-template-columns:30px minmax(0,1fr) auto 30px!important;align-items:center!important;gap:8px!important;width:calc(100% - 32px)!important;max-width:430px!important;margin:7px auto 0!important;padding:6px 10px!important}
#studii-de-caz-home .av-case-arrow-v7{display:flex!important;align-items:center!important;justify-content:center!important;width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important}
#studii-de-caz-home .av-case-dots-v7{display:flex!important;align-items:center!important;min-width:0!important;overflow-x:auto!important}
#studii-de-caz-home .av-case-count-v7{display:block!important}
}
@media(max-width:390px){
#studii-de-caz-home .av-case-showcase-card{grid-template-columns:37% 63%!important;grid-template-rows:215px!important;height:215px!important;min-height:215px!important;max-height:215px!important}
#studii-de-caz-home .av-case-showcase-visual{height:215px!important;min-height:215px!important;max-height:215px!important}
#studii-de-caz-home .av-case-showcase-copy{height:215px!important;padding:12px 10px!important}
#studii-de-caz-home .av-case-showcase-copy h3{font-size:15px!important}
#studii-de-caz-home .av-case-showcase-lead{-webkit-line-clamp:3!important;font-size:9px!important}
}
@media(max-width:360px){
#studii-de-caz-home .av-case-showcase-card{grid-template-columns:38% 62%!important;grid-template-rows:215px!important;height:215px!important;min-height:215px!important;max-height:215px!important}
#studii-de-caz-home .av-case-showcase-visual{height:215px!important;min-height:215px!important;max-height:215px!important}
#studii-de-caz-home .av-case-showcase-copy{height:215px!important;padding:12px 10px!important}
#studii-de-caz-home .av-case-showcase-copy h3{font-size:14px!important}
#studii-de-caz-home .av-case-showcase-meta{font-size:8px!important}
#studii-de-caz-home .av-case-showcase-lead{font-size:8.6px!important;line-height:1.25!important}
#studii-de-caz-home .av-case-showcase-cta{min-height:34px!important;padding:7px 9px!important;font-size:8px!important}
}
</style>`;
const HOME_CASE_COMPACT_SCRIPT = `<script id="av-case-compact-force-20261102">(()=>{let interacted=false,bound=false;const imp=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important')};const getState=()=>{const s=document.getElementById('studii-de-caz-home');const t=s?.querySelector('.av-case-showcase-grid');const nav=s?.querySelector('.av-case-mobile-nav-v7');const cards=t?[...t.querySelectorAll('.av-case-showcase-card')]:[];return{s,t,nav,cards}};const sync=(s,i)=>{if(!s)return;const t=s.querySelector('.av-case-showcase-grid');const cards=t?[...t.querySelectorAll('.av-case-showcase-card')]:[];if(!cards.length)return;i=Math.max(0,Math.min(cards.length-1,i));const dots=[...s.querySelectorAll('.av-case-dot-v7')];dots.forEach((d,n)=>{d.classList.toggle('is-active',n===i);if(n===i)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});const count=s.querySelector('[data-case-count]');if(count)count.textContent=(i+1)+' / '+cards.length;const prev=s.querySelector('[data-case-prev]');const next=s.querySelector('[data-case-next]');if(prev)prev.disabled=i===0;if(next)next.disabled=i===cards.length-1};const current=s=>{const txt=s?.querySelector('[data-case-count]')?.textContent||'';const n=parseInt(txt,10);if(Number.isFinite(n)&&n>0)return n-1;return 0};const go=(s,i)=>{if(!s)return;interacted=true;const t=s.querySelector('.av-case-showcase-grid');const cards=t?[...t.querySelectorAll('.av-case-showcase-card')]:[];if(!t||!cards.length)return;i=Math.max(0,Math.min(cards.length-1,i));const step=Math.max(1,cards[0].offsetWidth);const left=Math.max(0,i*step);imp(t,'scroll-snap-type','none');t.scrollTo({left,behavior:'auto'});t.scrollLeft=left;sync(s,i);requestAnimationFrame(()=>{t.scrollLeft=left;sync(s,i)});setTimeout(()=>{t.scrollLeft=left;sync(s,i);imp(t,'scroll-snap-type','x mandatory')},160)};const bind=()=>{if(bound)return;const{s,t,nav}=getState();if(!s||!t||!nav)return;bound=true;const mark=()=>{interacted=true};['pointerdown','touchstart','wheel'].forEach(e=>t.addEventListener(e,mark,{passive:true}));['pointerdown','touchstart','keydown'].forEach(e=>nav.addEventListener(e,mark,{passive:e!=='keydown'}));const next=s.querySelector('[data-case-next]');const prev=s.querySelector('[data-case-prev]');next?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();go(s,current(s)+1)},true);prev?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();go(s,current(s)-1)},true);nav.addEventListener('click',e=>{const dot=e.target.closest('.av-case-dot-v7');if(!dot)return;e.preventDefault();e.stopImmediatePropagation();const dots=[...s.querySelectorAll('.av-case-dot-v7')];const i=dots.indexOf(dot);if(i>=0)go(s,i)},true)};const apply=()=>{const{s,t,nav,cards}=getState();if(!s)return;const mobile=window.matchMedia('(max-width:820px)').matches;const tiny=window.matchMedia('(max-width:360px)').matches;const phone=window.matchMedia('(max-width:390px)').matches;if(mobile){const h=phone||tiny?215:230;const frame=s.querySelector('.av-case-showcase-frame');imp(frame,'width','min(100%, 430px)');imp(frame,'margin-left','auto');imp(frame,'margin-right','auto');imp(t,'display','flex');imp(t,'align-items','stretch');imp(t,'width','100%');imp(t,'overflow-x','auto');imp(t,'overflow-y','hidden');imp(t,'gap','0px');imp(t,'padding','0px');imp(t,'scroll-padding-inline','0px');imp(nav,'display','grid');imp(nav,'grid-template-columns','30px minmax(0,1fr) auto 30px');imp(nav,'align-items','center');imp(nav,'width','calc(100% - 32px)');cards.forEach(c=>{imp(c,'display','grid');imp(c,'grid-template-columns',(tiny?'38%':(phone?'37%':'36%'))+' '+(tiny?'62%':(phone?'63%':'64%')));imp(c,'grid-template-rows',h+'px');imp(c,'flex','0 0 100%');imp(c,'width','100%');imp(c,'min-width','100%');imp(c,'max-width','100%');imp(c,'height',h+'px');imp(c,'min-height',h+'px');imp(c,'max-height',h+'px');imp(c,'overflow','hidden');imp(c,'scroll-snap-align','start');const v=c.querySelector('.av-case-showcase-visual');imp(v,'width','100%');imp(v,'height',h+'px');imp(v,'min-height',h+'px');imp(v,'max-height',h+'px');const cp=c.querySelector('.av-case-showcase-copy');imp(cp,'display','flex');imp(cp,'flex-direction','column');imp(cp,'height',h+'px');imp(cp,'overflow','hidden')})}else{imp(t,'display','flex');imp(t,'overflow-x','auto');imp(nav,'display','grid');cards.forEach(c=>{imp(c,'display','grid');imp(c,'grid-template-columns','190px minmax(0,1fr)');imp(c,'grid-template-rows','300px');imp(c,'height','300px');imp(c,'min-height','300px');imp(c,'max-height','300px');const v=c.querySelector('.av-case-showcase-visual');imp(v,'width','190px');imp(v,'height','300px');imp(v,'min-height','300px');imp(v,'max-height','300px');const cp=c.querySelector('.av-case-showcase-copy');imp(cp,'display','flex');imp(cp,'flex-direction','column');imp(cp,'height','300px');imp(cp,'overflow','hidden')})}};const resetStart=()=>{if(interacted)return;const{s,t}=getState();if(!t||s?.dataset.avSliderV8!=='1')return;t.scrollTo({left:0,behavior:'auto'});sync(s,0)};const tick=()=>{apply();bind();resetStart()};const boot=()=>{tick();requestAnimationFrame(tick);setTimeout(tick,120);setTimeout(tick,650);setTimeout(tick,1250);setTimeout(tick,1750)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.addEventListener('resize',apply,{passive:true});new MutationObserver(()=>requestAnimationFrame(()=>{apply();bind()})).observe(document.documentElement,{childList:true,subtree:true})})();</script>`;
const TEACHER_IMAGE_PATH = '/assets/vocatie-invatator-live-20261027.webp';
const TEACHER_IMAGE_RAW = 'https://raw.githubusercontent.com/astrovip33-hub/astrovip/main/assets/vocatie-invatator-live-20261027.webp';

export default {
  async fetch(request, env, ctx) {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname === TEACHER_IMAGE_PATH) {
      const raw = await fetch(TEACHER_IMAGE_RAW, {
        cf: { cacheEverything: true, cacheTtl: 86400 }
      });
      if (!raw.ok) {
        return new Response('Teacher vocation image unavailable', {
          status: 502,
          headers: { 'content-type': 'text/plain; charset=utf-8' }
        });
      }
      const headers = new Headers(raw.headers);
      headers.set('content-type', 'image/webp');
      headers.set('cache-control', 'public, max-age=86400, stale-while-revalidate=604800');
      headers.set('x-astrovip-image-source', 'teacher-vocation-worker-proxy');
      headers.delete('content-security-policy');
      return new Response(request.method === 'HEAD' ? null : raw.body, {
        status: 200,
        headers
      });
    }

    const response = await app.fetch(request, env, ctx);
    const contentType = response.headers.get('content-type') || '';

    if (
      request.method === 'HEAD' ||
      !response.ok ||
      !contentType.includes('text/html')
    ) {
      return response;
    }

    const url = requestUrl;
    const isHome = url.pathname === '/' || url.pathname === '';
    let homeAuthorityMobileMounted = false;
    let homeAuthorityDesktopMounted = false;
    const removeMenuItem = {
      element(element) {
        element.remove();
      }
    };

    const rewriter = new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append(LLMS_DISCOVERY_LINK + CANONICAL_NAP_STYLE + (isHome ? HOME_AUTHORITY_STYLE + HOME_ABOUT_HARD_KILL + HOME_CASE_COMPACT_STYLE + HOME_CASE_COMPACT_SCRIPT : ''), { html: true });
        }
      })
      .on('#menu a[href="#contact"]', removeMenuItem)
      .on('#menu a[href="/#contact"]', removeMenuItem)
      .on('#menu a[href="/"]', removeMenuItem)
      .on('#menu a[href="#home"]', removeMenuItem)
      .on('#menu a[href="/#home"]', removeMenuItem)
      .on('#menu a[href="#acasa"]', removeMenuItem)
      .on('#menu a[href="/#acasa"]', removeMenuItem)
      .on('footer', {
        element(element) {
          element.append(CANONICAL_NAP, { html: true });
        }
      });

    if (isHome) {
      rewriter
        .on('.avm-hero-copy', {
          element(element) {
            if (homeAuthorityMobileMounted) return;
            homeAuthorityMobileMounted = true;
            element.after(HOME_AUTHORITY_MOBILE, { html: true });
          }
        })
        .on('section.av-pro-hero', {
          element(element) {
            if (homeAuthorityDesktopMounted) return;
            homeAuthorityDesktopMounted = true;
            element.after(HOME_AUTHORITY_DESKTOP, { html: true });
          }
        })
        .on('#av-cert-l7x', {
          element(element) {
            element.remove();
          }
        })
        .on('#av-pfa-footer-card', {
          element(element) {
            element.remove();
          }
        });
    }

    return rewriter.transform(response);
  }
};