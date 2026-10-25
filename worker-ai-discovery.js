import app from './worker-home-ultra.js';

const LLMS_DISCOVERY_LINK = '<link rel="describedby" href="/llms.txt" type="text/plain">';

const CERTIFICATION_CARD = `<section id="av-cert-footer-card" class="av-cert-footer-card" aria-labelledby="av-cert-footer-title">
  <div class="av-cert-footer-card__glow" aria-hidden="true"></div>
  <div class="av-cert-footer-card__seal" aria-hidden="true">
    <div class="av-cert-footer-card__seal-ring">
      <svg viewBox="0 0 96 96" role="img" aria-hidden="true" focusable="false">
        <rect x="27" y="18" width="42" height="53" rx="5" fill="none" stroke="currentColor" stroke-width="4"/>
        <path d="M37 33h22M37 43h22M37 53h15" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <circle cx="58" cy="67" r="15" fill="#07130d" stroke="currentColor" stroke-width="3"/>
        <path d="M58 57l2.8 6.1 6.6.7-4.9 4.5 1.4 6.5-5.9-3.3-5.9 3.3 1.4-6.5-4.9-4.5 6.6-.7z" fill="currentColor"/>
      </svg>
    </div>
  </div>
  <div class="av-cert-footer-card__content">
    <span class="av-cert-footer-card__eyebrow">CERTIFICARE PROFESIONALĂ</span>
    <h2 id="av-cert-footer-title">Cristian Cătălin Smaranda</h2>
    <p class="av-cert-footer-card__credential">Astrolog certificat <span aria-hidden="true">—</span> <strong>COR 516101</strong></p>
    <p class="av-cert-footer-card__legal">Certificat de absolvire cu recunoaștere națională<br>emis în conformitate cu <strong>O.G. nr. 129/2000</strong></p>
    <div class="av-cert-footer-card__facts" aria-label="Detalii certificare">
      <span>◆ Program autorizat</span><i aria-hidden="true"></i><span>◷ 50 ore</span><i aria-hidden="true"></i><span>▣ 2014</span>
    </div>
    <p class="av-cert-footer-card__trust">Formare profesională recunoscută oficial în România</p>
  </div>
  <div class="av-cert-footer-card__side">
    <span class="av-cert-footer-card__verified"><b aria-hidden="true">✓</b> CERTIFICAT</span>
    <div class="av-cert-footer-card__zodiac" aria-hidden="true"><span>♈</span><span>♉</span><span>♊</span><span>♋</span><span>♌</span><span>♍</span></div>
    <a class="av-cert-footer-card__link" href="/studii-de-caz/diploma-astrologie-2014/" aria-label="Vezi certificarea profesională AstroVip">VEZI CERTIFICAREA →</a>
  </div>
</section>`;

const CERTIFICATION_STYLE = `<style id="av-cert-footer-card-style">
.av-cert-footer-card{--av-gold:#efd36e;--av-gold2:#a87520;--av-green:#42f58d;position:relative;isolation:isolate;display:grid;grid-template-columns:170px minmax(0,1fr) 265px;align-items:center;gap:28px;width:min(1460px,calc(100% - 40px));margin:0 auto 30px;padding:26px 30px;box-sizing:border-box;overflow:hidden;border:1px solid rgba(239,211,110,.88);border-radius:28px;background:radial-gradient(circle at 7% 50%,rgba(24,116,73,.30),transparent 28%),radial-gradient(circle at 92% 18%,rgba(19,119,74,.23),transparent 29%),linear-gradient(125deg,#020604 0%,#050806 52%,#020503 100%);box-shadow:0 18px 55px rgba(0,0,0,.48),0 0 0 1px rgba(255,244,187,.08) inset,0 0 28px rgba(221,176,63,.11);color:#fff;font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
.av-cert-footer-card:before{content:"";position:absolute;z-index:-1;inset:5px;border:1px solid rgba(239,211,110,.23);border-radius:22px;pointer-events:none}.av-cert-footer-card:after{content:"";position:absolute;z-index:-2;inset:0;background:linear-gradient(110deg,transparent 8%,rgba(255,255,255,.025) 32%,transparent 48%),repeating-radial-gradient(circle at 92% 48%,transparent 0 29px,rgba(239,211,110,.07) 30px 31px);pointer-events:none}.av-cert-footer-card__glow{position:absolute;z-index:-2;width:380px;height:380px;right:-170px;bottom:-245px;border:1px solid rgba(239,211,110,.18);border-radius:50%;box-shadow:0 0 0 35px rgba(239,211,110,.025),0 0 0 72px rgba(66,245,141,.018)}
.av-cert-footer-card__seal{display:grid;place-items:center}.av-cert-footer-card__seal-ring{position:relative;display:grid;place-items:center;width:132px;height:132px;border:1px solid rgba(239,211,110,.9);border-radius:50%;background:radial-gradient(circle at 42% 35%,rgba(239,211,110,.16),rgba(8,31,20,.86) 55%,#020604 76%);color:#f1cf5f;box-shadow:0 0 0 9px rgba(239,211,110,.035),0 0 0 11px rgba(239,211,110,.32),0 0 28px rgba(239,211,110,.18),inset 0 0 26px rgba(66,245,141,.08)}.av-cert-footer-card__seal-ring:before,.av-cert-footer-card__seal-ring:after{content:"✦";position:absolute;left:50%;transform:translateX(-50%);color:#ffe58a;text-shadow:0 0 10px rgba(255,224,121,.7);font-size:19px}.av-cert-footer-card__seal-ring:before{top:-22px}.av-cert-footer-card__seal-ring:after{bottom:-22px}.av-cert-footer-card__seal svg{width:88px;height:88px;filter:drop-shadow(0 0 7px rgba(239,211,110,.22))}
.av-cert-footer-card__content{min-width:0;padding-right:4px}.av-cert-footer-card__eyebrow{display:inline-flex;align-items:center;gap:8px;margin:0 0 8px;color:#f5dd87;font:900 11px/1.2 Inter,system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase}.av-cert-footer-card__eyebrow:before{content:"✦";font-size:10px}.av-cert-footer-card__content h2{margin:0!important;color:#fff9e7!important;font:800 clamp(30px,3.1vw,47px)/1.03 Georgia,"Times New Roman",serif!important;letter-spacing:-.025em!important;text-shadow:0 2px 22px rgba(0,0,0,.4)!important}.av-cert-footer-card__credential{margin:9px 0 0!important;color:#f0d36d!important;font:700 clamp(20px,2vw,30px)/1.2 Georgia,"Times New Roman",serif!important}.av-cert-footer-card__credential strong{font-weight:800;color:#ffe99c}.av-cert-footer-card__legal{margin:8px 0 0!important;color:#e5e2d8!important;font:500 16px/1.42 Georgia,"Times New Roman",serif!important;letter-spacing:.01em}.av-cert-footer-card__legal strong{color:#fff1bd}.av-cert-footer-card__facts{display:flex;align-items:center;flex-wrap:wrap;gap:11px;margin-top:13px;color:#f2ead0;font-size:12px;font-weight:760;letter-spacing:.015em}.av-cert-footer-card__facts span{white-space:nowrap}.av-cert-footer-card__facts i{display:block;width:4px;height:4px;border-radius:50%;background:#efcf61;box-shadow:0 0 8px rgba(239,207,97,.55)}.av-cert-footer-card__trust{margin:13px 0 0!important;padding-top:11px;border-top:1px solid rgba(239,211,110,.25);color:#d9d6ca!important;font:italic 14px/1.35 Georgia,"Times New Roman",serif!important}
.av-cert-footer-card__side{position:relative;display:flex;min-height:160px;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding-left:25px;border-left:1px solid rgba(239,211,110,.25)}.av-cert-footer-card__verified{position:relative;z-index:2;display:inline-flex;align-items:center;justify-content:center;gap:11px;min-width:190px;min-height:50px;padding:0 20px;border:1px solid rgba(239,211,110,.78);border-radius:999px;background:linear-gradient(180deg,rgba(7,36,23,.96),rgba(2,15,9,.98));box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 0 20px rgba(66,245,141,.09);color:#f2d66d;font-size:12px;font-weight:950;letter-spacing:.18em}.av-cert-footer-card__verified b{display:grid;place-items:center;width:29px;height:29px;border:1px solid #47f294;border-radius:50%;color:#6affaa;font-size:17px;box-shadow:0 0 13px rgba(66,245,141,.22)}.av-cert-footer-card__zodiac{display:flex;gap:9px;color:rgba(239,211,110,.42);font:20px/1 Georgia,serif;letter-spacing:.06em}.av-cert-footer-card__link{position:relative;z-index:2;color:#dfffea!important;text-decoration:none!important;font-size:10px;font-weight:900;letter-spacing:.12em;border-bottom:1px solid rgba(66,245,141,.35);padding-bottom:4px}.av-cert-footer-card__link:hover{color:#6affaa!important;border-color:#6affaa}
@media(max-width:980px){.av-cert-footer-card{grid-template-columns:130px minmax(0,1fr) 205px;gap:20px;padding:22px}.av-cert-footer-card__seal-ring{width:104px;height:104px}.av-cert-footer-card__seal svg{width:70px;height:70px}.av-cert-footer-card__side{padding-left:18px}.av-cert-footer-card__verified{min-width:155px;padding:0 14px}.av-cert-footer-card__content h2{font-size:34px!important}}
@media(max-width:820px){.av-cert-footer-card{display:grid;grid-template-columns:70px minmax(0,1fr);gap:14px;width:calc(100% - 20px);margin:14px auto 22px;padding:18px 15px 17px;border-radius:20px;background:radial-gradient(circle at 4% 18%,rgba(30,121,77,.26),transparent 30%),radial-gradient(circle at 96% 85%,rgba(151,115,28,.10),transparent 28%),linear-gradient(145deg,#020604,#050806 60%,#020503);box-shadow:0 14px 38px rgba(0,0,0,.45),0 0 0 1px rgba(255,244,187,.05) inset}.av-cert-footer-card:before{inset:4px;border-radius:16px}.av-cert-footer-card__seal{align-self:start;padding-top:4px}.av-cert-footer-card__seal-ring{width:58px;height:58px;box-shadow:0 0 0 5px rgba(239,211,110,.035),0 0 0 6px rgba(239,211,110,.28),0 0 16px rgba(239,211,110,.12)}.av-cert-footer-card__seal-ring:before,.av-cert-footer-card__seal-ring:after{display:none}.av-cert-footer-card__seal svg{width:43px;height:43px}.av-cert-footer-card__eyebrow{margin-bottom:5px;font-size:8.5px;letter-spacing:.13em}.av-cert-footer-card__content h2{font-size:clamp(23px,7.2vw,31px)!important;line-height:1.02!important}.av-cert-footer-card__credential{margin-top:6px!important;font-size:clamp(17px,5vw,21px)!important;line-height:1.18!important}.av-cert-footer-card__legal{margin-top:7px!important;font-size:12.5px!important;line-height:1.38!important}.av-cert-footer-card__facts{gap:7px;margin-top:10px;font-size:10px;line-height:1.25}.av-cert-footer-card__facts i{width:3px;height:3px}.av-cert-footer-card__trust{margin-top:10px!important;padding-top:9px;font-size:11.5px!important}.av-cert-footer-card__side{grid-column:1/-1;min-height:0;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:12px;margin-top:2px;padding:12px 0 0;border-left:0;border-top:1px solid rgba(239,211,110,.20)}.av-cert-footer-card__verified{justify-self:start;min-width:0;min-height:39px;padding:0 13px;gap:8px;font-size:9px;letter-spacing:.14em}.av-cert-footer-card__verified b{width:23px;height:23px;font-size:14px}.av-cert-footer-card__zodiac{display:none}.av-cert-footer-card__link{justify-self:end;font-size:9px;letter-spacing:.08em;text-align:right}.av-cert-footer-card__glow{right:-260px;bottom:-290px}}
@media(max-width:430px){.av-cert-footer-card{grid-template-columns:56px minmax(0,1fr);gap:11px;width:calc(100% - 14px);padding:16px 12px 14px;border-radius:18px}.av-cert-footer-card__seal-ring{width:48px;height:48px}.av-cert-footer-card__seal svg{width:36px;height:36px}.av-cert-footer-card__eyebrow{font-size:7.8px}.av-cert-footer-card__content h2{font-size:22px!important}.av-cert-footer-card__credential{font-size:16px!important}.av-cert-footer-card__legal{font-size:11.5px!important}.av-cert-footer-card__facts{font-size:9.2px}.av-cert-footer-card__trust{font-size:10.8px!important}.av-cert-footer-card__side{grid-template-columns:1fr;justify-items:center}.av-cert-footer-card__verified{justify-self:center}.av-cert-footer-card__link{justify-self:center;text-align:center}}
</style>`;

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
    let certificationCardAdded = false;

    return new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append(LLMS_DISCOVERY_LINK, { html: true });
          if (isHome) element.append(CERTIFICATION_STYLE, { html: true });
        }
      })
      .on('footer', {
        element(element) {
          if (!isHome || certificationCardAdded) return;
          certificationCardAdded = true;
          element.prepend(CERTIFICATION_CARD, { html: true });
        }
      })
      .transform(response);
  }
};