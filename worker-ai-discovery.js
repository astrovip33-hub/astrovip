import app from './worker-home-ultra.js';

const LLMS_DISCOVERY_LINK = '<link rel="describedby" href="/llms.txt" type="text/plain">';

const CANONICAL_NAP = `<div class="av-canonical-nap" aria-label="Date de contact AstroVip"><strong>AstroVip.ro · Cătălin Smaranda</strong><span>Bulevardul Unirii 33, București · <a href="tel:+40722128220">0722 128 220</a> · <a href="https://astrovip.ro/">astrovip.ro</a></span><span><a href="/despre-astrovip/">Cătălin Smaranda astrolog București</a></span></div>`;
const CANONICAL_NAP_STYLE = `<style id="av-canonical-nap-style">.av-canonical-nap{box-sizing:border-box;width:min(1120px,calc(100% - 28px));margin:18px auto 0;padding:12px 16px;border-top:1px solid rgba(231,198,106,.28);border-bottom:1px solid rgba(57,255,20,.13);color:#cfd8d2;text-align:center;font:650 12px/1.55 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.01em}.av-canonical-nap strong{color:#f0d887;font-weight:850}.av-canonical-nap span{display:block;margin-top:2px}.av-canonical-nap a{color:#d9efe0!important;text-decoration:none}.av-canonical-nap a:hover{text-decoration:underline;text-underline-offset:3px}@media(max-width:620px){.av-canonical-nap{width:calc(100% - 24px);padding:11px 10px;font-size:11px;line-height:1.6}}</style>`;
const HOME_AUTHORITY_STYLE = `<style id="av-home-local-authority-style">.av-home-local-authority{box-sizing:border-box;width:min(1120px,calc(100% - 28px));margin:10px auto 16px;padding:9px 14px;border:1px solid rgba(231,198,106,.28);border-radius:12px;background:linear-gradient(180deg,rgba(8,17,13,.92),rgba(3,8,6,.96));color:#d8dfda;text-align:center;font:700 12px/1.45 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}.av-home-local-authority strong{color:#f1d983}.av-home-local-authority a{color:#9cf4b7!important;font-weight:850;text-decoration:none}.av-home-local-authority a:hover{text-decoration:underline;text-underline-offset:3px}.av-home-local-authority--mobile{display:none}@media(max-width:820px){.av-home-local-authority--desktop{display:none!important}.av-home-local-authority--mobile{display:block!important;width:calc(100% - 24px);margin:9px 12px 13px;padding:9px 11px;font-size:11px;line-height:1.5;border-radius:11px}}</style>`;
const HOME_AUTHORITY_MOBILE = `<div class="av-home-local-authority av-home-local-authority--mobile"><strong>Cătălin Smaranda · Astrolog București</strong> · Bulevardul Unirii 33 · Consultații 1:1 premium · 5,0/5 din 33 recenzii · <a href="/despre-astrovip/">Despre AstroVip</a></div>`;
const HOME_AUTHORITY_DESKTOP = `<div class="av-home-local-authority av-home-local-authority--desktop"><strong>Cătălin Smaranda · Astrolog București</strong> · Bulevardul Unirii 33 · Consultații 1:1 premium · 5,0/5 din 33 recenzii · <a href="/despre-astrovip/">Despre AstroVip</a></div>`;
const TEACHER_IMAGE_PATH = '/assets/vocatie-invatator-live-20261027.webp';
const TEACHER_IMAGE_RAW = 'https://raw.githubusercontent.com/astrovip33-hub/astrovip/main/assets/vocatie-invatator-live-20261027.webp';
const CERT_STYLE = '<link rel="stylesheet" href="/assets/certificare-card-20261026.css?v=20261026-final2"><style id="av-cert-final-visibility">#studii-de-caz-home>#av-cert-l7x{display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;height:auto!important;min-height:1px!important;margin:22px 0 0!important;padding:0!important;overflow:visible!important}</style>';
const CERT_CARD = `<section id="av-cert-l7x" class="av-cert-l7x" data-av-cert-source="worker-ai-final-v2" aria-labelledby="av-cert-l7x-title" style="display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;min-height:1px!important;overflow:visible!important">
  <div class="avc-card">
    <div class="avc-orbits" aria-hidden="true"></div>
    <div class="avc-copy">
      <div class="avc-brand"><span class="avc-brand-star" aria-hidden="true">✦</span><span>ASTROVIP</span></div>
      <div class="avc-eyebrow">EXPERTIZĂ <span>•</span> CUNOAȘTERE <span>•</span> EVOLUȚIE</div>
      <h2 class="avc-heading" id="av-cert-l7x-title">CERTIFICAT <strong>DE ASTROLOG</strong></h2>
      <p class="avc-subtitle">Recunoaștere profesională</p>
      <div class="avc-rule" aria-hidden="true"></div>
      <div class="avc-facts">
        <div class="avc-fact"><span class="avc-icon" aria-hidden="true">✦</span><div><strong>Experiență 33+ ani</strong><small>Practica și încrederea a mii de oameni</small></div></div>
        <div class="avc-fact"><span class="avc-icon" aria-hidden="true">Ψ</span><div><strong>Licențiat în Psihologie</strong><small>Fundație științifică și abordare umană</small></div></div>
        <div class="avc-fact"><span class="avc-icon" aria-hidden="true">✺</span><div><strong>Astrologie &amp; Numerologie Premium</strong><small>Analize profunde pentru o viață în echilibru</small></div></div>
      </div>
      <a class="avc-cta" href="/studii-de-caz/diploma-astrologie-2014/" aria-label="Vezi certificarea de astrolog">VEZI CERTIFICAREA <span aria-hidden="true">→</span></a>
    </div>
    <div class="avc-visual" aria-hidden="true">
      <div class="avc-halo"></div><div class="avc-sphere"></div>
      <div class="avc-certificate"><div class="avc-paper"><div class="avc-cert-star">✦</div><small>ASTROVIP</small><b>CERTIFICAT<br>DE ASTROLOG</b><em>RECUNOAȘTERE PROFESIONALĂ</em><div class="avc-moons">☾ ◐ ● ◑ ☽</div><div class="avc-sun"></div></div></div>
    </div>
  </div>
</section>`;

const PFA_FOOTER_CARD = `<section id="av-pfa-footer-card" class="av-pfa-footer-card" aria-label="Date furnizor AstroVip" style="display:block!important;visibility:visible!important;opacity:1!important">
  <style>
    #av-pfa-footer-card{box-sizing:border-box!important;width:min(94%,860px)!important;margin:28px auto 18px!important;padding:1px!important;border-radius:22px!important;background:linear-gradient(135deg,#071a36 0%,#123f77 38%,#d7b85a 64%,#071a36 100%)!important;box-shadow:0 18px 48px rgba(0,0,0,.38),0 0 28px rgba(22,77,139,.24)!important;clear:both!important}
    #av-pfa-footer-card *{box-sizing:border-box!important}
    #av-pfa-footer-card .avpfa-in{display:grid!important;gap:12px!important;padding:22px 24px!important;border-radius:21px!important;background:linear-gradient(145deg,rgba(3,9,18,.98),rgba(5,18,35,.98) 62%,rgba(4,10,20,.99))!important;text-align:center!important}
    #av-pfa-footer-card .avpfa-kicker{color:#77b7ff!important;font:800 10px/1.2 Inter,system-ui,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important}
    #av-pfa-footer-card .avpfa-name{margin:0!important;color:#fff4cf!important;font:800 clamp(18px,2.6vw,28px)/1.18 Georgia,serif!important;letter-spacing:.02em!important}
    #av-pfa-footer-card .avpfa-role{color:#d9eaff!important;font:700 13px/1.35 Inter,system-ui,sans-serif!important}
    #av-pfa-footer-card .avpfa-rule{width:86px!important;height:1px!important;margin:1px auto 3px!important;background:linear-gradient(90deg,transparent,#d8b85d,transparent)!important}
    #av-pfa-footer-card .avpfa-bank{display:grid!important;gap:5px!important;padding:14px 16px!important;border:1px solid rgba(82,152,230,.42)!important;border-radius:14px!important;background:rgba(7,29,56,.56)!important}
    #av-pfa-footer-card .avpfa-label{color:#9fc9ff!important;font:800 10px/1.25 Inter,system-ui,sans-serif!important;letter-spacing:.10em!important;text-transform:uppercase!important}
    #av-pfa-footer-card .avpfa-holder{color:#eef6ff!important;font:700 12px/1.35 Inter,system-ui,sans-serif!important}
    #av-pfa-footer-card .avpfa-iban{overflow-wrap:anywhere!important;color:#f6d979!important;font:900 clamp(14px,2.1vw,18px)/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;letter-spacing:.035em!important}
    @media(max-width:640px){#av-pfa-footer-card{width:calc(100% - 24px)!important;margin:20px 12px 14px!important;border-radius:18px!important}#av-pfa-footer-card .avpfa-in{padding:18px 14px!important;border-radius:17px!important;gap:10px!important}#av-pfa-footer-card .avpfa-name{font-size:20px!important}#av-pfa-footer-card .avpfa-iban{font-size:13px!important;letter-spacing:.015em!important}}
  </style>
  <div class="avpfa-in">
    <div class="avpfa-kicker">DATE FURNIZOR · ASTROVIP</div>
    <h2 class="avpfa-name">Smaranda Cristian Catalin PFA</h2>
    <div class="avpfa-role">Astrolog Autorizat</div>
    <div class="avpfa-rule" aria-hidden="true"></div>
    <div class="avpfa-bank">
      <span class="avpfa-label">Cont bancar</span>
      <span class="avpfa-holder">Smaranda Cristian Catalin</span>
      <strong class="avpfa-iban">RO08BTRLRONCRT0CS6331801</strong>
    </div>
  </div>
</section>`;

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
    let certMounted = false;
    let pfaMounted = false;
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
          element.append(LLMS_DISCOVERY_LINK + CANONICAL_NAP_STYLE + (isHome ? HOME_AUTHORITY_STYLE : ''), { html: true });
          if (isHome) element.append(CERT_STYLE, { html: true });
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
        .on('#studii-de-caz-home', {
          element(element) {
            if (certMounted) return;
            certMounted = true;
            element.append(CERT_CARD, { html: true });
          }
        })
        .on('#av-pfa-footer-card', {
          element(element) {
            element.remove();
          }
        })
        .on('footer', {
          element(element) {
            if (pfaMounted) return;
            pfaMounted = true;
            element.append(PFA_FOOTER_CARD, { html: true });
          }
        });
    }

    return rewriter.transform(response);
  }
};