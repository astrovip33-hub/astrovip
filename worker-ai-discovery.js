import app from './worker-home-ultra.js';

const LLMS_DISCOVERY_LINK = '<link rel="describedby" href="/llms.txt" type="text/plain">';

const CANONICAL_NAP = `<div class="av-canonical-nap" aria-label="Date de contact AstroVip"><strong>AstroVip.ro · Cătălin Smaranda</strong><span>Bulevardul Unirii 33, București · <a href="tel:+40722128220">0722 128 220</a> · <a href="https://astrovip.ro/">astrovip.ro</a></span><span><a href="/despre-astrovip/">Cătălin Smaranda astrolog București</a></span></div>`;
const CANONICAL_NAP_STYLE = `<style id="av-canonical-nap-style">.av-canonical-nap{box-sizing:border-box;width:min(1120px,calc(100% - 28px));margin:18px auto 0;padding:12px 16px;border-top:1px solid rgba(231,198,106,.28);border-bottom:1px solid rgba(57,255,20,.13);color:#cfd8d2;text-align:center;font:650 12px/1.55 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.01em}.av-canonical-nap strong{color:#f0d887;font-weight:850}.av-canonical-nap span{display:block;margin-top:2px}.av-canonical-nap a{color:#d9efe0!important;text-decoration:none}.av-canonical-nap a:hover{text-decoration:underline;text-underline-offset:3px}@media(max-width:620px){.av-canonical-nap{width:calc(100% - 24px);padding:11px 10px;font-size:11px;line-height:1.6}}</style>`;
const HOME_AUTHORITY_STYLE = `<style id="av-home-local-authority-style">.av-home-local-authority{box-sizing:border-box;width:min(1120px,calc(100% - 28px));margin:10px auto 16px;padding:9px 14px;border:1px solid rgba(231,198,106,.28);border-radius:12px;background:linear-gradient(180deg,rgba(8,17,13,.92),rgba(3,8,6,.96));color:#d8dfda;text-align:center;font:700 12px/1.45 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}.av-home-local-authority strong{color:#f1d983}.av-home-local-authority a{color:#9cf4b7!important;font-weight:850;text-decoration:none}.av-home-local-authority a:hover{text-decoration:underline;text-underline-offset:3px}.av-home-local-authority--mobile{display:none}@media(max-width:820px){.av-home-local-authority--desktop{display:none!important}.av-home-local-authority--mobile{display:block!important;width:calc(100% - 24px);margin:9px 12px 13px;padding:9px 11px;font-size:11px;line-height:1.5;border-radius:11px}}</style>`;
const HOME_AUTHORITY_MOBILE = `<div class="av-home-local-authority av-home-local-authority--mobile"><strong>Cătălin Smaranda · Astrolog București</strong> · Bulevardul Unirii 33 · Consultații 1:1 premium · 5,0/5 din 33 recenzii · <a href="/despre-astrovip/">Despre AstroVip</a></div>`;
const HOME_AUTHORITY_DESKTOP = `<div class="av-home-local-authority av-home-local-authority--desktop"><strong>Cătălin Smaranda · Astrolog București</strong> · Bulevardul Unirii 33 · Consultații 1:1 premium · 5,0/5 din 33 recenzii · <a href="/despre-astrovip/">Despre AstroVip</a></div>`;
const HOME_ABOUT_HARD_KILL = `<style id="av-about-hard-kill-20261101">.av-about-home{display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}</style><script id="av-about-hard-kill-script-20261101">(()=>{const k=()=>document.querySelectorAll('.av-about-home').forEach(n=>n.remove());if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',k,{once:true});else k();new MutationObserver(k).observe(document.documentElement,{childList:true,subtree:true})})();</script>`;
const TEACHER_IMAGE_PATH = '/assets/vocatie-invatator-live-20261027.webp';
const TEACHER_IMAGE_RAW = 'https://raw.githubusercontent.com/astrovip33-hub/astrovip/main/assets/vocatie-invatator-live-20261027.webp';

export default {
  async fetch(request, env, ctx) {
    const requestUrl = new URL(request.url);

    // Serve the teacher vocation artwork through the Worker instead of relying on
    // the static asset manifest. This keeps the public AstroVip URL stable while
    // guaranteeing a real image/webp response for the article and every slider clone.
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
          element.append(LLMS_DISCOVERY_LINK + CANONICAL_NAP_STYLE + (isHome ? HOME_AUTHORITY_STYLE + HOME_ABOUT_HARD_KILL : ''), { html: true });
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