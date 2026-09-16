(function(){
  'use strict';
  function boot(){
    if(document.getElementById('oportunitati-astrovip'))return;
    const services=document.getElementById('servicii');
    const method=document.getElementById('metoda');
    if(!services||!method||document.body.classList.contains('guide-page'))return;

    if(!document.getElementById('astrovip-opportunity-style')){
      const style=document.createElement('style');
      style.id='astrovip-opportunity-style';
      style.textContent=`
      #oportunitati-astrovip{padding:86px 0 92px;background:radial-gradient(circle at 50% 0%,rgba(56,245,138,.08),transparent 30%),linear-gradient(180deg,#070807 0%,#020302 100%);border-top:1px solid rgba(56,245,138,.18);border-bottom:1px solid rgba(56,245,138,.18)}
      #oportunitati-astrovip .avx-title{text-align:center;max-width:860px;margin:0 auto 38px}
      #oportunitati-astrovip .avx-kicker{font-size:13px;font-weight:950;letter-spacing:.14em;text-transform:uppercase;color:#8dffb8}
      #oportunitati-astrovip .avx-title h2{margin:8px 0 13px;font-size:clamp(34px,5vw,58px);line-height:1.02;color:#38f58a;text-shadow:0 1px 0 rgba(220,255,233,.62),0 2px 0 #075c33,0 0 22px rgba(56,245,138,.34)}
      #oportunitati-astrovip .avx-title p{margin:0;color:var(--muted);font-size:18px}
      #oportunitati-astrovip .avx-card{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:stretch;margin:24px 0;padding:22px;border:1px solid rgba(56,245,138,.38);border-radius:28px;background:linear-gradient(145deg,#1b1b1b 0%,#080808 48%,#000 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 22px 58px rgba(0,0,0,.55)}
      #oportunitati-astrovip .avx-card:nth-of-type(even) .avx-visual{order:2}
      #oportunitati-astrovip .avx-visual{min-height:320px;border-radius:22px;overflow:hidden;border:1px solid rgba(56,245,138,.45);position:relative;background:#061008;display:grid;place-items:center}
      #oportunitati-astrovip .avx-visual:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 48%,rgba(0,0,0,.66)),radial-gradient(circle at 50% 28%,rgba(56,245,138,.08),transparent 42%)}
      #oportunitati-astrovip .avx-copy{padding:24px 18px;display:flex;flex-direction:column;justify-content:center}
      #oportunitati-astrovip .avx-mini{font-size:12px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:#8dffb8}
      #oportunitati-astrovip .avx-copy h3{font-size:clamp(30px,4vw,46px);line-height:1.03;margin:8px 0 14px;color:#38f58a;text-shadow:0 1px 0 rgba(220,255,233,.62),0 2px 0 #075c33,0 0 18px rgba(56,245,138,.28)}
      #oportunitati-astrovip .avx-copy p{color:var(--muted);font-size:17px;margin:0 0 16px}
      #oportunitati-astrovip .avx-points{display:grid;gap:10px;margin:8px 0 20px}
      #oportunitati-astrovip .avx-points span{padding:11px 13px;border:1px solid rgba(56,245,138,.25);border-radius:12px;background:rgba(255,255,255,.025);font-weight:760}
      #oportunitati-astrovip .avx-points span:before{content:"✓";color:#38f58a;font-weight:950;margin-right:9px}
      #oportunitati-astrovip .avx-note{font-size:12px!important;color:#9fb8a8!important;margin:10px 0 0!important;line-height:1.45}
      #oportunitati-astrovip .avx-lottery{background:radial-gradient(circle at 50% 38%,rgba(56,245,138,.16),transparent 38%),linear-gradient(145deg,#121513,#040504)}
      #oportunitati-astrovip .avx-balls{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:30px;z-index:2}
      #oportunitati-astrovip .avx-ball{width:72px;height:72px;border-radius:50%;display:grid;place-items:center;font-size:25px;font-weight:950;color:#071009;background:radial-gradient(circle at 30% 25%,#effff5 0 9%,#80ffb0 25%,#38f58a 58%,#079c50 100%);box-shadow:inset -8px -10px 18px rgba(0,66,33,.34),0 0 26px rgba(56,245,138,.18)}
      #oportunitati-astrovip .avx-sports{background:radial-gradient(circle at 50% 50%,rgba(56,245,138,.11),transparent 45%),linear-gradient(145deg,#0d160f,#030403)}
      #oportunitati-astrovip .avx-sports:before{content:"";position:absolute;inset:22px;border:2px solid rgba(56,245,138,.34);border-radius:18px;background:linear-gradient(90deg,transparent 49.7%,rgba(56,245,138,.26) 50%,transparent 50.3%)}
      #oportunitati-astrovip .avx-ball-foot{position:relative;z-index:2;font-size:96px;filter:grayscale(1) brightness(1.7);opacity:.9}
      #oportunitati-astrovip .avx-score{position:absolute;top:24px;left:50%;transform:translateX(-50%);z-index:3;padding:8px 14px;border:1px solid rgba(56,245,138,.35);border-radius:999px;background:rgba(0,0,0,.72);font-weight:900;color:#caffda;letter-spacing:.08em;font-size:12px;white-space:nowrap}
      #oportunitati-astrovip .avx-career svg{width:100%;height:100%;display:block;position:absolute;inset:0}
      @media(max-width:760px){
        #oportunitati-astrovip{padding:62px 0 68px}
        #oportunitati-astrovip .avx-title{margin-bottom:26px}
        #oportunitati-astrovip .avx-title p,#oportunitati-astrovip .avx-copy p{font-size:16px}
        #oportunitati-astrovip .avx-card{grid-template-columns:1fr;padding:14px;border-radius:22px;gap:8px}
        #oportunitati-astrovip .avx-card:nth-of-type(even) .avx-visual{order:0}
        #oportunitati-astrovip .avx-visual{min-height:250px}
        #oportunitati-astrovip .avx-copy{padding:18px 8px 14px}
        #oportunitati-astrovip .avx-copy h3{font-size:34px}
        #oportunitati-astrovip .avx-ball{width:58px;height:58px;font-size:21px}
        #oportunitati-astrovip .avx-ball-foot{font-size:80px}
      }`;
      document.head.appendChild(style);
    }

    const section=document.createElement('section');
    section.id='oportunitati-astrovip';
    section.setAttribute('aria-label','Analize tematice AstroVip');
    section.innerHTML=`<div class="wrap">
      <div class="avx-title reveal"><div class="avx-kicker">Analize tematice AstroVip</div><h2>Trei direcții unde timing-ul contează</h2><p>Vocație profesională, șanse la loterie și analiza astrologică a competițiilor sportive, prezentate clar și responsabil.</p></div>

      <article class="avx-card reveal">
        <div class="avx-visual avx-career" aria-hidden="true">
          <svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="avxg" cx="35%" cy="28%"><stop offset="0" stop-color="#eafff2"/><stop offset=".25" stop-color="#84ffb4"/><stop offset=".58" stop-color="#38f58a"/><stop offset="1" stop-color="#06733d"/></radialGradient></defs><rect width="800" height="520" fill="#050706"/><circle cx="400" cy="260" r="172" fill="none" stroke="#38f58a" stroke-opacity=".28" stroke-width="2"/><circle cx="400" cy="260" r="118" fill="none" stroke="#38f58a" stroke-opacity=".22" stroke-width="2"/><path d="M220 365 C300 285 347 320 405 238 C462 157 506 214 590 135" fill="none" stroke="url(#avxg)" stroke-width="12" stroke-linecap="round"/><path d="M552 136 L590 135 L583 172" fill="none" stroke="#38f58a" stroke-width="10" stroke-linecap="round"/><g fill="url(#avxg)"><circle cx="220" cy="365" r="14"/><circle cx="405" cy="238" r="14"/><circle cx="590" cy="135" r="14"/></g><g fill="#dfffe9" opacity=".92" font-family="Segoe UI Symbol,Arial" font-size="36"><text x="380" y="112">✦</text><text x="278" y="210">☉</text><text x="502" y="298">♃</text><text x="330" y="395">♄</text></g></svg>
        </div>
        <div class="avx-copy"><div class="avx-mini">Vocație · carieră · potențial</div><h3>Vocație profesională</h3><p>Harta natală poate evidenția talente, motivații, stil de lucru și perioade în care schimbarea profesională devine mai relevantă.</p><div class="avx-points"><span>Talente și direcții naturale</span><span>MC, casa a X-a și stăpânitorii</span><span>Timing pentru schimbări și oportunități</span></div><a class="cta" href="#contact">Solicită analiza</a></div>
      </article>

      <article class="avx-card reveal">
        <div class="avx-visual avx-lottery" aria-hidden="true"><div class="avx-balls"><div class="avx-ball">3</div><div class="avx-ball">11</div><div class="avx-ball">18</div><div class="avx-ball">27</div><div class="avx-ball">36</div></div></div>
        <div class="avx-copy"><div class="avx-mini">Timing · cicluri · probabilitate</div><h3>Șanse la loterie</h3><p>Analiza astrologică poate urmări perioadele personale de expansiune, risc și oportunitate, fără a transforma simbolistica într-o promisiune de câștig.</p><div class="avx-points"><span>Ferestre personale de timing</span><span>Jupiter, casa a V-a și casa a VIII-a</span><span>Corelarea tranzitelor cu harta natală</span></div><a class="cta" href="#contact">Vezi analiza tematică</a><p class="avx-note">Jocurile de noroc implică risc. Nicio analiză astrologică nu garantează rezultate financiare.</p></div>
      </article>

      <article class="avx-card reveal">
        <div class="avx-visual avx-sports" aria-hidden="true"><div class="avx-score">ASTROVIP · MATCH TIMING</div><div class="avx-ball-foot">⚽</div></div>
        <div class="avx-copy"><div class="avx-mini">Eveniment · moment · dinamică</div><h3>Pariuri sportive</h3><p>O secțiune dedicată analizei astrologice a momentului competiției: harta evenimentului, angularitate, stăpânitori și contacte relevante.</p><div class="avx-points"><span>Analiza hărții evenimentului</span><span>Casele I / VII și IV / X</span><span>Timing și semnale astrologice multiple</span></div><a class="cta" href="#contact">Descoperă metoda</a><p class="avx-note">Pariurile implică risc financiar. Conținutul este informativ și nu reprezintă garanție de câștig.</p></div>
      </article>
    </div>`;

    services.insertAdjacentElement('afterend',section);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();