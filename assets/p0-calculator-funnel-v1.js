(()=>{
  'use strict';

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  const supported = new Set([
    '/calculator-ascendent/',
    '/sinastrie-calculator/',
    '/tranzitele-mele/',
    '/harta-mea/',
    '/harta-natala/'
  ]);
  if (!supported.has(path) || window.__astrovipP0FunnelLoaded) return;
  window.__astrovipP0FunnelLoaded = true;

  const CONSULT = '/consultatie-astrologica/';
  const PRICE = '500 lei / 60 min';
  const CITIES = [
    ['București', 44.4268, 26.1025],
    ['Cluj-Napoca', 46.7712, 23.6236],
    ['Iași', 47.1585, 27.6014],
    ['Timișoara', 45.7489, 21.2087],
    ['Constanța', 44.1598, 28.6348],
    ['Brașov', 45.6427, 25.5887]
  ];

  const css = `
  .av-p0-funnel{margin:24px 0 6px;padding:24px;border:1px solid rgba(240,207,104,.52);border-radius:20px;background:radial-gradient(circle at 20% 0,rgba(57,255,20,.09),transparent 35%),linear-gradient(145deg,rgba(12,12,10,.98),rgba(4,4,4,.98));box-shadow:0 18px 46px rgba(0,0,0,.28),0 0 28px rgba(240,207,104,.06);color:#fffdf4}
  .av-p0-funnel[hidden]{display:none!important}
  .av-p0-eyebrow{display:inline-flex;align-items:center;gap:8px;margin-bottom:8px;color:#39ff14;font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
  .av-p0-funnel h3{margin:0 0 9px!important;color:#f3d46f!important;font-family:Georgia,'Times New Roman',serif!important;font-size:clamp(24px,3vw,34px)!important;line-height:1.08!important}
  .av-p0-funnel p{margin:0!important;color:#f8f5ea!important;font-size:16px!important;line-height:1.65!important;font-weight:650!important}
  .av-p0-proof{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 18px}
  .av-p0-proof span{padding:7px 10px;border:1px solid rgba(240,207,104,.24);border-radius:999px;background:rgba(255,255,255,.025);color:#fff6d0;font-size:12px;font-weight:850}
  .av-p0-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
  .av-p0-btn{display:inline-flex!important;align-items:center;justify-content:center;min-height:46px;padding:12px 17px!important;border-radius:999px!important;text-decoration:none!important;font-size:13px!important;font-weight:950!important;letter-spacing:.035em!important;line-height:1.2!important}
  .av-p0-btn.primary{border:1px solid #f6db7d!important;background:linear-gradient(180deg,#fff0a0,#e1b83d 55%,#a96f12)!important;color:#151006!important;box-shadow:0 10px 28px rgba(206,155,39,.22)!important}
  .av-p0-btn.secondary{border:1px solid rgba(57,255,20,.55)!important;background:rgba(57,255,20,.055)!important;color:#eaffdf!important}
  .av-p0-city-wrap{margin:10px 0 14px;padding:12px;border:1px solid rgba(240,207,104,.18);border-radius:14px;background:rgba(255,255,255,.02)}
  .av-p0-city-title{display:block;margin-bottom:8px;color:#e8ddbd;font-size:12px;font-weight:850}
  .av-p0-cities{display:flex;flex-wrap:wrap;gap:7px}
  .av-p0-city{appearance:none;border:1px solid rgba(57,255,20,.32);border-radius:999px;background:rgba(57,255,20,.04);color:#f5fff1;padding:7px 10px;cursor:pointer;font:800 12px/1.1 inherit}
  .av-p0-city:hover,.av-p0-city:focus{border-color:#39ff14;outline:none}
  .av-p0-city-note{display:block;margin-top:8px;color:#bbb4a4;font-size:11px;line-height:1.45}
  .av-p0-intent{max-width:1180px;margin:18px auto 26px;padding:16px 18px;border:1px solid rgba(240,207,104,.3);border-radius:18px;background:rgba(4,4,4,.94);display:flex;align-items:center;justify-content:space-between;gap:16px;box-shadow:0 12px 34px rgba(0,0,0,.24)}
  .av-p0-intent strong{display:block;color:#f0cf68;font-size:17px}.av-p0-intent span{display:block;margin-top:3px;color:#eee5d1;font-size:13px}
  .av-p0-intent .av-p0-actions{margin:0;flex-shrink:0}
  @media(max-width:760px){.av-p0-funnel{padding:19px 16px;border-radius:17px}.av-p0-actions{display:grid;grid-template-columns:1fr}.av-p0-btn{width:100%;box-sizing:border-box}.av-p0-intent{margin:12px 10px 20px;display:block}.av-p0-intent .av-p0-actions{margin-top:12px;display:grid}.av-p0-cities{gap:6px}}
  `;
  const style = document.createElement('style');
  style.id = 'astrovip-p0-funnel-style';
  style.textContent = css;
  document.head.appendChild(style);

  function analyticsGranted() {
    try {
      const choice = JSON.parse(localStorage.getItem('astrovip_consent_v2') || 'null');
      return !!(choice && choice.v === 2 && choice.analytics === true);
    } catch (_) {
      return false;
    }
  }

  function emit(name, detail={}) {
    if (!analyticsGranted()) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:name, ...detail});
  }

  function funnelCard({eyebrow='INTERPRETARE PREMIUM', title, body, secondaryHref, secondaryLabel, hidden=false}) {
    const card = document.createElement('section');
    card.className = 'av-p0-funnel';
    card.dataset.avP0Funnel = path;
    card.hidden = hidden;
    card.innerHTML = `<div class="av-p0-eyebrow">✦ ${eyebrow}</div><h3>${title}</h3><p>${body}</p><div class="av-p0-proof"><span>Analiză umană</span><span>Metodă AstroVip</span><span>${PRICE}</span></div><div class="av-p0-actions"><a class="av-p0-btn primary" data-av-p0-cta="consultatie" href="${CONSULT}">CONSULTAȚIE ASTROLOGICĂ</a>${secondaryHref?`<a class="av-p0-btn secondary" data-av-p0-cta="continuare" href="${secondaryHref}">${secondaryLabel}</a>`:''}</div>`;
    return card;
  }

  function revealOnMutation(target, card) {
    if (!target || !card) return;
    const reveal = () => {
      if (!target.textContent.trim()) return;
      card.hidden = false;
      card.dataset.avP0Revealed = '1';
    };
    const observer = new MutationObserver(reveal);
    observer.observe(target, {childList:true, subtree:true, characterData:true});
    reveal();
  }

  function addCityPresets({placeId, latId, lonId, anchorId}) {
    const place = document.getElementById(placeId), lat = document.getElementById(latId), lon = document.getElementById(lonId);
    const anchor = document.getElementById(anchorId || placeId);
    if (!place || !lat || !lon || !anchor || anchor.dataset.avP0Cities) return;
    anchor.dataset.avP0Cities = '1';
    const wrap = document.createElement('div');
    wrap.className = 'av-p0-city-wrap';
    wrap.innerHTML = '<span class="av-p0-city-title">Completare rapidă coordonate</span><div class="av-p0-cities"></div><small class="av-p0-city-note">Coordonatele se completează automat. Verifică separat fusul orar legal valabil la data nașterii.</small>';
    const box = wrap.querySelector('.av-p0-cities');
    CITIES.forEach(([name, la, lo]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'av-p0-city';
      b.textContent = name;
      b.addEventListener('click', () => {
        place.value = `${name}, România`;
        lat.value = String(la);
        lon.value = String(lo);
        [place, lat, lon].forEach(el => el.dispatchEvent(new Event('input', {bubbles:true})));
        emit('astrovip_city_preset', {tool:path, city:name});
      });
      box.appendChild(b);
    });
    const label = anchor.closest('label');
    (label || anchor).insertAdjacentElement('afterend', wrap);
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-av-p0-cta]');
    if (!a) return;
    emit('astrovip_p0_cta', {tool:path, cta:a.dataset.avP0Cta, href:a.getAttribute('href')});
  }, true);

  function ascendant() {
    addCityPresets({placeId:'place', latId:'lat', lonId:'lon'});
    const result = document.getElementById('result');
    if (!result) return;
    const card = funnelCard({
      title:'Ascendentul este începutul interpretării, nu verdictul.',
      body:'În analiza profesională corelăm gradul ASC, guvernatorul lui, casele, planetele și timingul prin tranzite, Arce Solare și progresii. Astfel rezultatul calculatorului devine o hartă coerentă, nu o etichetă.',
      secondaryHref:'/harta-mea/',
      secondaryLabel:'CALCULEAZĂ HARTA NATALĂ',
      hidden:true
    });
    result.insertAdjacentElement('afterend', card);
    const status = document.getElementById('status');
    if (status) {
      const ob = new MutationObserver(() => { if (/Calculat/i.test(status.textContent)) card.hidden = false; });
      ob.observe(status, {childList:true, subtree:true, characterData:true});
    }
    document.getElementById('demo')?.addEventListener('click',()=>setTimeout(()=>{card.hidden=false},50));
  }

  function synastry() {
    addCityPresets({placeId:'aPlace', latId:'aLat', lonId:'aLon'});
    addCityPresets({placeId:'bPlace', latId:'bLat', lonId:'bLon'});
    const results = document.getElementById('results');
    const summary = document.getElementById('summary');
    if (!results || !summary) return;
    const card = funnelCard({
      title:'Compatibilitatea nu este un procent. Relația se citește ca un sistem.',
      body:'O analiză completă corelează sinastria cu harta compozită/Davison, casele relaționale și timingul. Calculatorul arată contactele; interpretarea profesională stabilește ce este central și ce este doar zgomot.',
      secondaryHref:'/harta-compozita/',
      secondaryLabel:'VEZI HARTA COMPOZITĂ'
    });
    summary.insertAdjacentElement('afterend', card);
  }

  function transits() {
    const kicker = document.querySelector('.avx-hero .avx-kicker');
    if (kicker && /PAGINĂ NOUĂ/i.test(kicker.textContent)) kicker.textContent = 'ASTROVIP · TRANZITE PERSONALE';
    const list = document.getElementById('av-personal-list');
    if (!list) return;
    const card = funnelCard({
      title:'Un tranzit exact este un semnal. Convergența tehnicilor dă greutatea predicției.',
      body:'În consultația AstroVip, tranzitele sunt corelate cu harta natală, axe, Arce Solare, progresii și contextul real. Asta separă un contact izolat de o fereastră astrologică relevantă.',
      secondaryHref:'/tranzite-astrologice/',
      secondaryLabel:'METODA TRANZITELOR',
      hidden:true
    });
    list.insertAdjacentElement('afterend', card);
    revealOnMutation(list, card);
  }

  function natalCalculator() {
    addCityPresets({placeId:'birthPlace', latId:'birthLat', lonId:'birthLon'});
    const wrap = document.querySelector('#resultsSection .av-wrap');
    if (!wrap) return;
    const card = funnelCard({
      title:'Ai calculat harta. Următorul pas este ierarhizarea informației.',
      body:'Interpretarea profesională leagă Ascendentul, stăpânii caselor, luminariile, aspectele și tehnicile predictive într-o singură concluzie. Primești context, priorități și ferestre de timing — nu o listă de poziții.',
      secondaryHref:'/tranzitele-mele/',
      secondaryLabel:'VEZI TRANZITELE PERSONALE'
    });
    const localSpace = wrap.querySelector('.av-upgrade:last-of-type');
    if (localSpace) localSpace.insertAdjacentElement('beforebegin', card); else wrap.appendChild(card);
  }

  function natalGuide() {
    const hero = document.querySelector('.guide-hero');
    if (!hero) return;
    const bar = document.createElement('div');
    bar.className = 'av-p0-intent';
    bar.innerHTML = `<div><strong>Ai ajuns la ghid. Acum calculează harta ta.</strong><span>Calculator gratuit + interpretare profesională opțională.</span></div><div class="av-p0-actions"><a class="av-p0-btn primary" data-av-p0-cta="calculator" href="/harta-mea/">CALCULEAZĂ GRATUIT</a><a class="av-p0-btn secondary" data-av-p0-cta="consultatie" href="${CONSULT}">CONSULTAȚIE</a></div>`;
    hero.insertAdjacentElement('afterend', bar);
  }

  const init = () => {
    if (path === '/calculator-ascendent/') ascendant();
    if (path === '/sinastrie-calculator/') synastry();
    if (path === '/tranzitele-mele/') transits();
    if (path === '/harta-mea/') natalCalculator();
    if (path === '/harta-natala/') natalGuide();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
