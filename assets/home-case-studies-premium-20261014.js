(() => {
  'use strict';

  const ABOUT_HTML = `
    <section class="av-about-home" aria-labelledby="av-about-home-title">
      <div class="av-about-home-card">
        <div class="av-about-home-mark" aria-hidden="true"><strong>CS</strong><span>ASTROVIP</span></div>
        <div class="av-about-home-copy">
          <p class="av-about-home-kicker">DESPRE MINE</p>
          <h2 id="av-about-home-title">Cătălin Smaranda <span>· Astrolog</span></h2>
          <p class="av-about-home-lead">Practic astrologia de peste 33 de ani și sunt licențiat în Psihologie. Lucrez cu timing, relații, carieră și relocare, cu accent pe claritate și aplicabilitate.</p>
          <div class="av-about-home-facts" aria-label="Experiență și specializări"><span>33+ ANI EXPERIENȚĂ</span><span>LICENȚIAT ÎN PSIHOLOGIE</span><span>TIMING · RELOCARE</span></div>
        </div>
      </div>
    </section>`;

  const ensureAboutStyle = () => {
    if (document.getElementById('av-about-home-style-20261014')) return;
    const style = document.createElement('style');
    style.id = 'av-about-home-style-20261014';
    style.textContent = `
      #studii-de-caz-home .av-about-home{position:relative;z-index:2;width:min(960px,calc(100% - 40px));margin:0 auto 22px;padding:0}
      #studii-de-caz-home .av-about-home-card{position:relative;display:grid;grid-template-columns:68px minmax(0,1fr);align-items:center;gap:18px;padding:18px 20px;border:1px solid rgba(231,198,106,.46);border-radius:22px;background:radial-gradient(circle at 0 0,rgba(57,255,20,.055),transparent 34%),linear-gradient(135deg,rgba(10,20,16,.985),rgba(3,7,5,.995));box-shadow:0 18px 42px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.045),0 0 0 1px rgba(57,255,20,.045);overflow:hidden}
      #studii-de-caz-home .av-about-home-card:before{content:'';position:absolute;left:18%;right:18%;top:0;height:1px;background:linear-gradient(90deg,transparent,#e6c45d,#7cff67,#e6c45d,transparent);opacity:.8}
      #studii-de-caz-home .av-about-home-mark{display:flex;flex-direction:column;align-items:center;justify-content:center;width:62px;height:62px;border:1px solid rgba(237,207,112,.62);border-radius:50%;background:radial-gradient(circle at 35% 25%,#20331f,#07100c 68%);box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 0 20px rgba(216,245,0,.075)}
      #studii-de-caz-home .av-about-home-mark strong{color:#f4df96;font:800 20px/1 Georgia,'Times New Roman',serif;letter-spacing:.04em}
      #studii-de-caz-home .av-about-home-mark span{margin-top:4px;color:#9effb2;font:900 6px/1 Inter,system-ui,sans-serif;letter-spacing:.14em}
      #studii-de-caz-home .av-about-home-kicker{margin:0 0 4px!important;color:#99ffb4!important;font:950 9px/1.2 Inter,system-ui,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase}
      #studii-de-caz-home .av-about-home-copy h2{margin:0!important;color:#fff4c8!important;font-family:Georgia,'Times New Roman',serif!important;font-size:clamp(23px,3vw,31px)!important;font-weight:700!important;line-height:1.05!important;letter-spacing:-.02em!important}
      #studii-de-caz-home .av-about-home-copy h2 span{color:#d7c47f!important;font-size:.68em!important;font-weight:600!important;letter-spacing:.01em!important;white-space:nowrap}
      #studii-de-caz-home .av-about-home-lead{max-width:760px;margin:7px 0 0!important;color:rgba(231,237,232,.82)!important;font:650 16px/1.48 Inter,system-ui,sans-serif!important;letter-spacing:.005em!important}
      #studii-de-caz-home .av-about-home-facts{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
      #studii-de-caz-home .av-about-home-facts span{display:inline-flex;align-items:center;min-height:25px;padding:5px 9px;border:1px solid rgba(231,198,106,.24);border-radius:999px;background:rgba(255,255,255,.025);color:#e7d58e;font:900 8px/1 Inter,system-ui,sans-serif;letter-spacing:.08em;white-space:nowrap}
      @media(max-width:820px){
        #studii-de-caz-home .av-about-home{width:calc(100% - 24px);margin:0 auto 12px}
        #studii-de-caz-home .av-about-home-card{grid-template-columns:48px minmax(0,1fr);gap:11px;padding:14px 14px 15px;border-radius:18px;box-shadow:0 12px 28px rgba(0,0,0,.40),inset 0 1px 0 rgba(255,255,255,.04),0 0 0 1px rgba(57,255,20,.035)}
        #studii-de-caz-home .av-about-home-mark{width:46px;height:46px}
        #studii-de-caz-home .av-about-home-mark strong{font-size:16px}
        #studii-de-caz-home .av-about-home-mark span{font-size:5px}
        #studii-de-caz-home .av-about-home-kicker{margin-bottom:3px!important;font-size:10px!important;letter-spacing:.15em!important}
        #studii-de-caz-home .av-about-home-copy h2{font-size:clamp(18px,5.2vw,22px)!important;line-height:1.02!important}
        #studii-de-caz-home .av-about-home-copy h2 span{display:block;margin-top:3px;font-size:.58em!important;letter-spacing:.06em!important;text-transform:uppercase}
        #studii-de-caz-home .av-about-home-lead{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;margin-top:6px!important;font-size:15px!important;line-height:1.46!important;font-weight:650!important;letter-spacing:.003em!important}
        #studii-de-caz-home .av-about-home-facts{gap:4px;margin-top:8px}
        #studii-de-caz-home .av-about-home-facts span{min-height:21px;padding:4px 7px;font-size:9px;letter-spacing:.055em}
      }
      @media(max-width:360px){
        #studii-de-caz-home .av-about-home{width:calc(100% - 18px)}
        #studii-de-caz-home .av-about-home-card{grid-template-columns:42px minmax(0,1fr);gap:9px;padding:11px 10px}
        #studii-de-caz-home .av-about-home-mark{width:40px;height:40px}
        #studii-de-caz-home .av-about-home-mark strong{font-size:14px}
        #studii-de-caz-home .av-about-home-lead{font-size:14.5px!important;line-height:1.44!important;font-weight:650!important}
      }
    `;
    document.head.appendChild(style);
  };

  const ensureAbout = section => {
    if (section.querySelector(':scope > .av-about-home')) return;
    section.insertAdjacentHTML('afterbegin', ABOUT_HTML);
  };

  const install = () => {
    const section = document.getElementById('studii-de-caz-home');
    if (!section) return;

    ensureAboutStyle();
    ensureAbout(section);

    if (section.dataset.avCaseLux === '1') return;

    // Mobile owns a real scalable slider. Never replace its card track with
    // the legacy three-column premium block after DOMContentLoaded.
    if (window.matchMedia('(max-width:820px)').matches && section.querySelector('.av-case-showcase-grid')) return;

    section.dataset.avCaseLux = '1';
    section.classList.add('av-case-home-lux');

    section.innerHTML = `
      <div class="wrap av-case-lux-wrap">
        <div class="av-case-lux-frame">
          <header class="av-case-lux-head">
            <div>
              <p class="av-case-lux-kicker">EXEMPLE REALE · TIMING ASTROLOGIC</p>
              <h2 id="av-case-showcase-title">STUDII DE CAZ</h2>
              <p class="av-case-lux-intro">Trei evenimente importante analizate retrospectiv prin repere astrologice concrete.</p>
            </div>
            <a class="av-case-lux-all" href="/studii-de-caz/">VEZI TOATE <span aria-hidden="true">→</span></a>
          </header>

          <div class="av-case-lux-grid">
            <a class="av-case-lux-card" href="/studii-de-caz/intalnire-dragoste-arce-solare-2001/" aria-label="Vezi studiul de caz Întâlnire în dragoste">
              <figure class="av-case-lux-visual">
                <img width="1672" height="941" srcset="/images/studii-de-caz/fundal-dragoste-premium-20261016-720.webp 720w, /images/studii-de-caz/fundal-dragoste-premium-20261016.webp 1672w" sizes="(max-width: 820px) 90vw, 560px" src="/images/studii-de-caz/fundal-dragoste-premium-20261016.webp" loading="lazy" decoding="async" alt="Ilustrație de atmosferă: seară romantică în București, în albastru și auriu.">
                <span class="av-case-lux-index">01</span>
              </figure>
              <div class="av-case-lux-copy">
                <span class="av-case-lux-tag">DRAGOSTE</span>
                <h3>Întâlnire în dragoste</h3>
                <p>Cum a arătat astrologia momentului potrivit.</p>
                <span class="av-case-lux-link">VEZI STUDIUL <b aria-hidden="true">→</b></span>
              </div>
            </a>

            <a class="av-case-lux-card" href="/studii-de-caz/relocare-geografica-spania-2003/" aria-label="Vezi studiul de caz Relocare geografică">
              <figure class="av-case-lux-visual">
                <img width="1672" height="941" srcset="/images/studii-de-caz/fundal-relocare-premium-20261016-720.webp 720w, /images/studii-de-caz/fundal-relocare-premium-20261016.webp 1672w" sizes="(max-width: 820px) 90vw, 560px" src="/images/studii-de-caz/fundal-relocare-premium-20261016.webp" loading="lazy" decoding="async" alt="Ilustrație de atmosferă: oraș spaniol la malul Mediteranei, la apus.">
                <span class="av-case-lux-index">02</span>
              </figure>
              <div class="av-case-lux-copy">
                <span class="av-case-lux-tag">RELOCARE</span>
                <h3>Relocare geografică</h3>
                <p>Locația care schimbă cadrul și direcția vieții.</p>
                <span class="av-case-lux-link">VEZI STUDIUL <b aria-hidden="true">→</b></span>
              </div>
            </a>

            <a class="av-case-lux-card" href="/studii-de-caz/castig-loto-roma-2020/" aria-label="Vezi studiul de caz Câștig la LOTO">
              <figure class="av-case-lux-visual">
                <img width="1672" height="941" srcset="/images/studii-de-caz/fundal-loto-premium-20261016-720.webp 720w, /images/studii-de-caz/fundal-loto-premium-20261016.webp 1672w" sizes="(max-width: 820px) 90vw, 560px" src="/images/studii-de-caz/fundal-loto-premium-20261016.webp" loading="lazy" decoding="async" alt="Ilustrație de atmosferă: Roma la apus și simboluri discrete ale loteriei.">
                <span class="av-case-lux-index">03</span>
              </figure>
              <div class="av-case-lux-copy">
                <span class="av-case-lux-tag">LOTO</span>
                <h3>Câștig la LOTO</h3>
                <p>Analiză retrospectivă a timingului unui eveniment real.</p>
                <span class="av-case-lux-link">VEZI STUDIUL <b aria-hidden="true">→</b></span>
              </div>
            </a>
          </div>
        </div>
      </div>`;

    ensureAbout(section);

    if (document.getElementById('av-case-lux-style-20261014')) return;
    const style = document.createElement('style');
    style.id = 'av-case-lux-style-20261014';
    style.textContent = `
      #studii-de-caz-home.av-case-home-lux{position:relative!important;padding:28px 0 34px!important;background:radial-gradient(circle at 12% 15%,rgba(57,255,20,.06),transparent 25%),radial-gradient(circle at 88% 80%,rgba(231,189,97,.08),transparent 26%),#020302!important;border-top:1px solid rgba(227,189,97,.16)!important;border-bottom:1px solid rgba(57,255,20,.14)!important;overflow:hidden!important}
      #studii-de-caz-home .av-case-lux-wrap{position:relative;z-index:1}
      #studii-de-caz-home .av-case-lux-frame{position:relative;padding:22px;border:1px solid rgba(57,255,20,.72);border-radius:24px;background:linear-gradient(145deg,rgba(8,18,10,.98),rgba(2,4,2,.99));box-shadow:0 24px 62px rgba(0,0,0,.46),0 0 0 1px rgba(227,189,97,.15),0 0 30px rgba(57,255,20,.06)}
      #studii-de-caz-home .av-case-lux-frame:before{content:'';position:absolute;left:24px;right:24px;top:0;height:1px;background:linear-gradient(90deg,transparent,#f2d67c,transparent);opacity:.8}
      #studii-de-caz-home .av-case-lux-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:end;margin-bottom:18px}
      #studii-de-caz-home .av-case-lux-kicker{margin:0 0 6px;color:#7dffad;font-size:11px;font-weight:950;letter-spacing:.19em;text-transform:uppercase}
      #studii-de-caz-home .av-case-lux-head h2{margin:0;color:#fff3bd;font-family:Georgia,'Times New Roman',serif;font-size:clamp(34px,4.4vw,54px);line-height:.96;letter-spacing:-.025em;text-shadow:0 0 20px rgba(227,189,97,.10)}
      #studii-de-caz-home .av-case-lux-intro{margin:9px 0 0;max-width:720px;color:#cfd6cf;font-size:14px;line-height:1.55}
      #studii-de-caz-home .av-case-lux-all{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:42px;padding:9px 15px;border:1px solid rgba(242,214,124,.72);border-radius:999px;color:#ffe79a!important;background:linear-gradient(180deg,rgba(255,232,154,.08),rgba(255,255,255,.01));font-size:11px;font-weight:950;letter-spacing:.08em;text-decoration:none;white-space:nowrap;box-shadow:0 0 16px rgba(227,189,97,.08)}
      #studii-de-caz-home .av-case-lux-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
      #studii-de-caz-home .av-case-lux-card{position:relative;display:block;min-width:0;overflow:hidden;border:1px solid rgba(57,255,20,.72);border-radius:17px;background:linear-gradient(180deg,#09110a,#030503);color:#fff!important;text-decoration:none;box-shadow:0 12px 30px rgba(0,0,0,.34),0 0 14px rgba(57,255,20,.07);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
      #studii-de-caz-home .av-case-lux-card:hover{transform:translateY(-3px);border-color:#39ff14;box-shadow:0 18px 38px rgba(0,0,0,.42),0 0 20px rgba(57,255,20,.13)}
      #studii-de-caz-home .av-case-lux-visual{position:relative;margin:0;aspect-ratio:16/9;overflow:hidden;background:#070907}
      #studii-de-caz-home .av-case-lux-visual:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,.58));pointer-events:none}
      #studii-de-caz-home .av-case-lux-visual img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;transition:transform .35s ease}
      #studii-de-caz-home .av-case-lux-card:hover .av-case-lux-visual img{transform:scale(1.025)}
      #studii-de-caz-home .av-case-lux-index{position:absolute;z-index:2;top:10px;right:10px;display:grid;place-items:center;width:32px;height:32px;border:1px solid rgba(255,224,122,.82);border-radius:50%;background:rgba(0,0,0,.72);color:#ffe79a;font:800 12px/1 Georgia,serif}
      #studii-de-caz-home .av-case-lux-copy{padding:13px 14px 14px}
      #studii-de-caz-home .av-case-lux-tag{display:inline-block;margin-bottom:7px;color:#7dffad;font-size:9px;font-weight:950;letter-spacing:.16em}
      #studii-de-caz-home .av-case-lux-copy h3{margin:0;color:#fff5d0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.05;font-weight:700;letter-spacing:-.015em}
      #studii-de-caz-home .av-case-lux-copy p{margin:8px 0 12px;color:#d2d7d1;font-size:12px;line-height:1.42}
      #studii-de-caz-home .av-case-lux-link{display:flex;align-items:center;justify-content:space-between;padding-top:9px;border-top:1px solid rgba(227,189,97,.19);color:#ffe79a;font-size:9px;font-weight:950;letter-spacing:.12em}
      #studii-de-caz-home .av-case-lux-link b{display:grid;place-items:center;width:25px;height:25px;border:1px solid rgba(255,224,122,.58);border-radius:50%;font-size:14px}
      @media(max-width:820px){
        #studii-de-caz-home.av-case-home-lux{padding:14px 0 18px!important}
        #studii-de-caz-home .av-case-lux-wrap{width:calc(100% - 16px)!important;max-width:620px!important}
        #studii-de-caz-home .av-case-lux-frame{padding:10px 9px 11px;border-radius:16px;box-shadow:0 14px 34px rgba(0,0,0,.42),0 0 14px rgba(57,255,20,.07)}
        #studii-de-caz-home .av-case-lux-frame:before{left:14px;right:14px}
        #studii-de-caz-home .av-case-lux-head{grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;margin-bottom:9px}
        #studii-de-caz-home .av-case-lux-kicker{display:none}
        #studii-de-caz-home .av-case-lux-head h2{font-size:clamp(24px,7vw,30px);line-height:1}
        #studii-de-caz-home .av-case-lux-intro{margin:4px 0 0;font-size:9px;line-height:1.32;max-width:31ch}
        #studii-de-caz-home .av-case-lux-all{min-height:31px;padding:6px 9px;gap:5px;font-size:8px;letter-spacing:.04em}
        #studii-de-caz-home .av-case-lux-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
        #studii-de-caz-home .av-case-lux-card{border-radius:10px;box-shadow:0 7px 16px rgba(0,0,0,.34),0 0 8px rgba(57,255,20,.07)}
        #studii-de-caz-home .av-case-lux-visual{aspect-ratio:1.48/1}
        #studii-de-caz-home .av-case-lux-index{top:5px;right:5px;width:21px;height:21px;font-size:8px}
        #studii-de-caz-home .av-case-lux-copy{padding:7px 6px 7px}
        #studii-de-caz-home .av-case-lux-tag{margin-bottom:4px;font-size:6.5px;letter-spacing:.08em}
        #studii-de-caz-home .av-case-lux-copy h3{font-size:clamp(11px,3.1vw,14px);line-height:1.03}
        #studii-de-caz-home .av-case-lux-copy p{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;min-height:2.45em;margin:5px 0 6px;font-size:8.5px;line-height:1.22}
        #studii-de-caz-home .av-case-lux-link{padding-top:5px;font-size:6.5px;letter-spacing:.04em}
        #studii-de-caz-home .av-case-lux-link b{width:18px;height:18px;font-size:10px}
      }
      @media(max-width:360px){
        #studii-de-caz-home .av-case-lux-wrap{width:calc(100% - 10px)!important}
        #studii-de-caz-home .av-case-lux-frame{padding-left:6px;padding-right:6px}
        #studii-de-caz-home .av-case-lux-grid{gap:4px}
        #studii-de-caz-home .av-case-lux-copy{padding-left:5px;padding-right:5px}
        #studii-de-caz-home .av-case-lux-copy h3{font-size:10.5px}
        #studii-de-caz-home .av-case-lux-copy p{font-size:7.8px}
        #studii-de-caz-home .av-case-lux-link{font-size:6px}
      }
      @media(prefers-reduced-motion:reduce){#studii-de-caz-home .av-case-lux-card,#studii-de-caz-home .av-case-lux-visual img{transition:none!important}}
    `;
    document.head.appendChild(style);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();