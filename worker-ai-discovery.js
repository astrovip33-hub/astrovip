import app from './worker-home-ultra.js';

const LLMS_DISCOVERY_LINK = '<link rel="describedby" href="/llms.txt" type="text/plain">';
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

export default {
  async fetch(request, env, ctx) {
    const response = await app.fetch(request, env, ctx);
    const contentType = response.headers.get('content-type') || '';

    if (
      request.method === 'HEAD' ||
      !response.ok ||
      !contentType.includes('text/html')
    ) {
      return response;
    }

    const url = new URL(request.url);
    const isHome = url.pathname === '/' || url.pathname === '';
    let certMounted = false;

    const rewriter = new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append(LLMS_DISCOVERY_LINK, { html: true });
          if (isHome) element.append(CERT_STYLE, { html: true });
        }
      });

    if (isHome) {
      rewriter
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
        });
    }

    return rewriter.transform(response);
  }
};
