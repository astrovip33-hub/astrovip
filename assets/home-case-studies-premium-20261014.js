(() => {
  'use strict';

  const install = () => {
    const section = document.getElementById('studii-de-caz-home');
    if (!section || section.dataset.avCaseLux === '1') return;
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
                <img src="/images/studii-de-caz/intalnire-dragoste-2001-astrovip.jpg" width="1536" height="1536" loading="lazy" decoding="async" alt="Întâlnire în dragoste — studiu de caz AstroVip">
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
                <img src="/images/studii-de-caz/relocare-geografica-spania-2003-astrovip.webp" width="720" height="540" loading="lazy" decoding="async" alt="Relocare geografică — studiu de caz AstroVip">
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
                <img src="/assets/studiu-caz-castig-loto-roma-2020.svg" width="1200" height="675" loading="lazy" decoding="async" alt="Câștig la LOTO — studiu de caz AstroVip">
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
