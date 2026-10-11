(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;

  const mobile=()=>window.matchMedia('(max-width:820px)').matches;

  const installMobileApproved=()=>{
    if(!mobile()||document.getElementById('av-mobile-approved-home'))return;

    document.documentElement.classList.add('av-mobile-approved');

    const header=document.querySelector('header.top');
    const oldBrand=header?.querySelector('.brand.av-brand-premium');
    const oldLogo=oldBrand?.querySelector('.av-brand-logo');
    const oldFlags=[...(header?.querySelectorAll('.av-lang-switch>a')||[])];
    const oldChat=header?.querySelector('.avchat-launcher.avchat-header-slot');
    const oldHamb=header?.querySelector('#hamb');
    const menu=header?.querySelector('#menu');
    const backdrop=header?.querySelector('.av-pro-backdrop');

    if(header&&!document.getElementById('av-mobile-approved-header')){
      const approvedHeader=document.createElement('div');
      approvedHeader.id='av-mobile-approved-header';
      approvedHeader.setAttribute('aria-label','Header AstroVip mobil');

      const logoLink=document.createElement('a');
      logoLink.className='avm-logo';
      logoLink.href='/';
      logoLink.setAttribute('aria-label','AstroVip - Acasă');
      if(oldLogo)logoLink.appendChild(oldLogo.cloneNode(true));
      else logoLink.textContent='ASTROVIP';

      const flags=document.createElement('nav');
      flags.className='avm-flags';
      flags.setAttribute('aria-label','Alege limba');
      oldFlags.slice(0,7).forEach(a=>{
        const c=a.cloneNode(true);
        c.className='';
        c.removeAttribute('style');
        flags.appendChild(c);
      });

      const chat=document.createElement('button');
      chat.className='avm-chat';
      chat.type='button';
      chat.innerHTML='<span aria-hidden="true"></span><b>CHAT</b>';
      chat.setAttribute('aria-label','Deschide AstroVip Chat');
      chat.addEventListener('click',()=>oldChat?.click());

      const hamb=document.createElement('button');
      hamb.className='avm-hamb';
      hamb.type='button';
      hamb.setAttribute('aria-label','Deschide meniul');
      hamb.innerHTML='<i></i><i></i><i></i>';
      hamb.addEventListener('click',()=>{
        if(oldHamb){oldHamb.click();return;}
        if(!menu)return;
        const open=!menu.classList.contains('open');
        menu.classList.toggle('open',open);
        if(open)menu.removeAttribute('inert'); else menu.setAttribute('inert','');
        if(backdrop)backdrop.hidden=!open;
      });

      approvedHeader.append(logoLink,flags,chat,hamb);
      header.appendChild(approvedHeader);
    }

    const oldHero=document.querySelector('section.av-pro-hero');
    if(!oldHero)return;

    const section=document.createElement('section');
    section.id='av-mobile-approved-home';
    section.innerHTML=`
      <div class="avm-hero-copy">
        <div class="avm-kicker">ASTROLOGIE PREMIUM · ASTROVIP</div>
        <h1>CÂND CUNOȘTI <span>MOMENTUL,</span><br>TRĂIEȘTI VIITORUL.</h1>
        <p>Claritate pentru dragoste, carieră, afaceri și destin — într-o experiență astrologică premium 1:1, construită în jurul momentului potrivit.</p>
        <div class="avm-actions">
          <a class="avm-primary" href="#programari">PROGRAMEAZĂ CONSULTAȚIA →</a>
          <a class="avm-secondary" href="/despre-astrovip/">DESCOPERĂ ASTROVIP</a>
        </div>
      </div>
      <figure class="avm-photo">
        <img src="/assets/astrovip-hero-premium-mobile-20261001.webp?v=20261008-ux1" width="600" height="496" fetchpriority="high" loading="eager" decoding="async" alt="Cătălin Smaranda — AstroVip, astrologie premium">
      </figure>
      <div class="avm-trust" aria-label="Repere AstroVip">
        <div><strong>33+ ANI</strong><span>experiență</span></div>
        <div><strong>PREMIUM 1:1</strong><span>analiză personală</span></div>
        <div><strong>BUCUREȘTI</strong><span>și online</span></div>
      </div>
      <section class="avm-interests" aria-labelledby="avm-interests-title">
        <h2 id="avm-interests-title">CE TE INTERESEAZĂ?</h2>
        <div class="avm-grid">
          <a class="avm-card" href="/sinastrie/"><b>Dragoste</b><p>Compatibilitate, relații și momente importante.</p></a>
          <a class="avm-card" href="/astrologie-cariera-vocatie/"><b>Carieră</b><p>Vocație, direcție profesională și timing.</p></a>
          <a class="avm-card" href="/astrologie-afaceri/"><b>Afaceri &amp; Bani</b><p>Priorități, decizii și perioade importante.</p></a>
          <a class="avm-card" href="/harta-natala/"><b>Destin</b><p>Hartă natală, repere și direcții personale.</p></a>
        </div>
      </section>`;

    oldHero.parentNode.insertBefore(section,oldHero);

    const style=document.createElement('style');
    style.id='av-mobile-approved-style';
    style.textContent=`
      @media(max-width:820px){
        html.av-mobile-approved,html.av-mobile-approved body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:#020302!important}
        html.av-mobile-approved body:not(.guide-page) header.top{height:62px!important;min-height:62px!important;padding:0!important;margin:0!important;background:#050505!important;border-top:1px solid rgba(235,235,235,.82)!important;border-bottom:1px solid rgba(232,199,107,.30)!important;overflow:visible!important}
        html.av-mobile-approved body:not(.guide-page) header.top>.nav{position:relative!important;width:100%!important;max-width:100%!important;height:62px!important;min-height:62px!important;margin:0!important;padding:0!important;background:#050505!important;overflow:visible!important}
        html.av-mobile-approved body:not(.guide-page) header.top>.nav>.brand,
        html.av-mobile-approved body:not(.guide-page) header.top>.nav>.av-header-language,
        html.av-mobile-approved body:not(.guide-page) header.top>.nav>.nav-actions{display:none!important}
        html.av-mobile-approved body:not(.guide-page) header.top>.nav>.menu{top:62px!important;left:8px!important;right:8px!important;width:auto!important;max-width:none!important;z-index:120!important}
        #av-mobile-approved-header{position:absolute;z-index:110;inset:0;display:grid;grid-template-columns:108px minmax(0,1fr) 62px 32px;align-items:center;gap:5px;width:100%;height:62px;padding:5px 8px;background:#050505;box-sizing:border-box}
        #av-mobile-approved-header .avm-logo{display:flex;align-items:center;width:108px;height:48px;overflow:visible}
        #av-mobile-approved-header .avm-logo svg{display:block!important;width:108px!important;max-width:108px!important;height:auto!important;max-height:48px!important;overflow:visible!important}
        #av-mobile-approved-header .avm-logo .av-brand-tagline{display:block!important}
        #av-mobile-approved-header .avm-flags{display:flex;align-items:center;justify-content:center;gap:3px;min-width:0;overflow:visible}
        #av-mobile-approved-header .avm-flags a{display:block;flex:0 0 17px;width:17px;height:13px;padding:0!important;margin:0!important;border:1px solid rgba(255,255,255,.17);border-radius:2px;overflow:hidden;background:none!important;box-shadow:none!important}
        #av-mobile-approved-header .avm-flags img{display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;margin:0!important;padding:0!important;border:0!important}
        #av-mobile-approved-header .avm-flags span{display:none!important}
        #av-mobile-approved-header .avm-chat{display:flex;align-items:center;justify-content:center;gap:5px;width:62px;height:36px;padding:0;border:1px solid rgba(37,239,118,.78);border-radius:999px;background:linear-gradient(180deg,#092313,#031009);color:#fff;box-shadow:0 0 12px rgba(37,239,118,.16);font:900 10px/1 Inter,system-ui,sans-serif}
        #av-mobile-approved-header .avm-chat span{width:6px;height:6px;border-radius:50%;background:#38ff8d;box-shadow:0 0 8px #38ff8d}
        #av-mobile-approved-header .avm-chat b{font:inherit;color:#fff}
        #av-mobile-approved-header .avm-hamb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:32px;height:36px;margin:0;padding:0;border:0;background:transparent}
        #av-mobile-approved-header .avm-hamb i{display:block;width:25px;height:3px;border-radius:99px;background:linear-gradient(90deg,#16e875,#d8f500);box-shadow:0 0 7px rgba(37,239,118,.28)}

        html.av-mobile-approved body:not(.guide-page) section.av-pro-hero,
        html.av-mobile-approved body:not(.guide-page) #servicii.av-pro-interests,
        html.av-mobile-approved body:not(.guide-page) #av-ultra-home{display:none!important}

        #av-mobile-approved-home{display:block!important;width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;background:#020302!important;border:0!important;overflow:hidden!important}
        #av-mobile-approved-home .avm-hero-copy{width:100%;max-width:100%;padding:24px 18px 18px;box-sizing:border-box;text-align:left;background:radial-gradient(circle at 10% 30%,rgba(36,239,118,.05),transparent 25%),#020302}
        #av-mobile-approved-home .avm-kicker{display:inline-flex;align-items:center;margin:0 0 12px;padding:6px 10px;border:1px solid rgba(231,198,106,.42);border-radius:999px;color:#f9e6a3;font-size:10px;font-weight:900;letter-spacing:.09em}
        #av-mobile-approved-home h1{width:100%;max-width:100%;margin:0!important;padding:0!important;font-family:Georgia,'Times New Roman',serif!important;font-size:clamp(34px,9.6vw,43px)!important;line-height:.99!important;letter-spacing:-.035em!important;font-weight:900!important;color:#fff!important;text-shadow:none!important;text-align:left!important}
        #av-mobile-approved-home h1 span{background:linear-gradient(180deg,#fff6ca,#edce72 42%,#b5862c 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
        #av-mobile-approved-home .avm-hero-copy>p{max-width:100%;margin:16px 0 0;color:#ddd8cc;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.53}
        #av-mobile-approved-home .avm-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;margin-top:18px}
        #av-mobile-approved-home .avm-actions a{display:flex;align-items:center;justify-content:center;min-width:0;min-height:50px;padding:0 9px;border-radius:14px;text-align:center;text-decoration:none;font-size:10.5px;line-height:1.15;font-weight:950;letter-spacing:.01em;box-sizing:border-box}
        #av-mobile-approved-home .avm-primary{color:#181108;background:linear-gradient(180deg,#fff0a8 0,#e6c15d 52%,#b8862d 100%);border:1px solid #fff1ae;box-shadow:0 10px 28px rgba(216,174,72,.16)}
        #av-mobile-approved-home .avm-secondary{color:#f8e5a3;background:#07100b;border:1px solid rgba(231,198,106,.58)}
        #av-mobile-approved-home .avm-photo{position:relative;width:100%;height:auto;margin:0;padding:0;background:#000;line-height:0;overflow:hidden}
        #av-mobile-approved-home .avm-photo:before{content:'';position:absolute;z-index:2;inset:0 0 auto;height:55px;background:linear-gradient(#020302,transparent);pointer-events:none}
        #av-mobile-approved-home .avm-photo img{display:block;width:100%;height:auto;min-height:0;max-width:none;object-fit:cover;object-position:center center;margin:0;padding:0;border:0;border-radius:0;transform:none}
        #av-mobile-approved-home .avm-trust{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%;background:linear-gradient(180deg,#090b09,#030403);border-top:1px solid rgba(231,198,106,.24);border-bottom:1px solid rgba(231,198,106,.18)}
        #av-mobile-approved-home .avm-trust div{padding:12px 4px;text-align:center;border-right:1px solid rgba(255,255,255,.06)}
        #av-mobile-approved-home .avm-trust div:last-child{border-right:0}
        #av-mobile-approved-home .avm-trust strong{display:block;color:#f0d276;font-size:11px;line-height:1.1}
        #av-mobile-approved-home .avm-trust span{display:block;margin-top:3px;color:#b8b8b1;font-size:9px;line-height:1.2}
        #av-mobile-approved-home .avm-interests{display:block!important;width:100%!important;max-width:100%!important;margin:0!important;padding:24px 14px 30px!important;box-sizing:border-box!important;background:#030403!important;border:0!important}
        #av-mobile-approved-home .avm-interests h2{width:100%;margin:0 0 15px!important;padding:0!important;text-align:center!important;font-family:Georgia,'Times New Roman',serif!important;font-size:27px!important;line-height:1.08!important;font-weight:800!important;color:#eee6d5!important;text-shadow:none!important}
        #av-mobile-approved-home .avm-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}
        #av-mobile-approved-home .avm-card{display:block;min-width:0;min-height:112px;padding:13px;border:1px solid rgba(231,198,106,.40);border-radius:14px;background:linear-gradient(145deg,#0d120e,#050706);box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 12px 28px rgba(0,0,0,.25);text-decoration:none;box-sizing:border-box}
        #av-mobile-approved-home .avm-card b{display:block;margin-bottom:7px;color:#f3d77e;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.1}
        #av-mobile-approved-home .avm-card p{margin:0;color:#c6c8c3;font-size:11px;line-height:1.4}
      }
      @media(max-width:370px){
        #av-mobile-approved-header{grid-template-columns:96px minmax(0,1fr) 55px 29px;gap:3px;padding-left:6px;padding-right:6px}
        #av-mobile-approved-header .avm-logo,#av-mobile-approved-header .avm-logo svg{width:96px!important;max-width:96px!important}
        #av-mobile-approved-header .avm-flags{gap:2px}
        #av-mobile-approved-header .avm-flags a{flex-basis:15px;width:15px;height:12px}
        #av-mobile-approved-header .avm-chat{width:55px;font-size:9px}
        #av-mobile-approved-header .avm-hamb{width:29px}
        #av-mobile-approved-header .avm-hamb i{width:22px}
        #av-mobile-approved-home .avm-hero-copy{padding-left:14px;padding-right:14px}
        #av-mobile-approved-home h1{font-size:32px!important}
        #av-mobile-approved-home .avm-actions{gap:7px}
        #av-mobile-approved-home .avm-actions a{font-size:9.5px;padding-left:7px;padding-right:7px}
      }`;
    document.head.appendChild(style);
  };

  const apply=()=>{
    document.documentElement.classList.add('av-ultra-home-production');
    installMobileApproved();
    if(mobile())return;
    const firstOld=document.getElementById('intrebare-gratuita');
    if(!firstOld||document.getElementById('av-ultra-home'))return;
    const section=document.createElement('section');
    section.id='av-ultra-home';
    section.setAttribute('aria-labelledby','av-ultra-title');
    section.innerHTML=`<div class="av-ultra-shell"><p class="av-ultra-kicker">ASTROVIP · ASTROLOGIE PREMIUM</p><h2 class="av-ultra-title" id="av-ultra-title">Claritate. Timing. Decizii.</h2><p class="av-ultra-lead">Analiză astrologică personală pentru momentele în care vrei să înțelegi mai bine direcția, relațiile, cariera sau o schimbare importantă.</p><div class="av-ultra-actions"><a class="av-ultra-primary" href="#programari" aria-label="Plătește consultația AstroVip cu cardul prin Stripe, 500 lei">Plătește cu cardul · 500 lei</a><a class="av-ultra-secondary" href="https://wa.me/40722128220?text=Bun%C4%83%2C%20doresc%20o%20consulta%C8%9Bie%20AstroVip.">Programează pe WhatsApp →</a></div><p class="av-ultra-payment-note">Plată securizată prin <strong>Stripe</strong></p><div class="av-ultra-services" aria-label="Servicii esențiale"><span>Hartă natală</span><span>Previziuni</span><span>Relocare</span><span>Sinastrie</span></div><div class="av-ultra-proof"><span><strong>33+ ani</strong> experiență</span><span><strong>5★</strong> Google</span><span>Consultații <strong>1-la-1</strong></span></div><p class="av-ultra-signature">Viitorul favorizează oamenii pregătiți.</p></div>`;
    firstOld.parentNode.insertBefore(section,firstOld);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
