(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;

  const mobile=()=>window.matchMedia('(max-width:820px)').matches;

  const installPreviewStyle=()=>{
    if(document.getElementById('av-header-tiered-preview-style'))return;
    const style=document.createElement('style');
    style.id='av-header-tiered-preview-style';
    style.textContent=`
      html.av-header-tiered-preview body:not(.guide-page) header.top{overflow:visible!important;background:linear-gradient(180deg,#050705 0%,#010201 100%)!important}
      html.av-header-tiered-preview body:not(.guide-page) header.top>.av-langbar,
      html.av-header-tiered-preview body:not(.guide-page) header.top .av-language-picker{display:none!important}
      #av-preview-language-row{display:none}

      @media(min-width:981px){
        html.av-header-tiered-preview body:not(.guide-page) header.top>.nav.wrap{width:min(1380px,calc(100% - 28px))!important;min-height:94px!important;height:auto!important;gap:18px!important}
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium{width:270px!important;min-width:270px!important;height:auto!important;margin:0!important}
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium .av-brand-logo{display:block!important;width:270px!important;height:auto!important;max-height:78px!important;object-fit:contain!important}
        #av-preview-language-row{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:16px!important;width:100%!important;min-height:44px!important;padding:5px 18px 8px!important;border:0!important;border-top:1px solid rgba(229,198,103,.11)!important;background:linear-gradient(180deg,rgba(5,8,6,.62),rgba(1,2,1,.92))!important;z-index:2!important}
        #av-preview-language-row:before{content:"";position:absolute;left:50%;top:-1px;width:min(760px,66%);height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgba(229,198,103,.28),rgba(57,255,20,.12),rgba(229,198,103,.28),transparent)}
        #av-preview-language-row>a{position:relative!important;display:grid!important;place-items:center!important;width:42px!important;height:30px!important;margin:0!important;padding:2px!important;border:0!important;border-radius:5px!important;background:transparent!important;box-shadow:none!important;opacity:.82!important;transition:transform .18s ease,opacity .18s ease!important}
        #av-preview-language-row>a:hover{transform:translateY(-1px) scale(1.04)!important;opacity:1!important}
        #av-preview-language-row>a[aria-current="page"]{opacity:1!important}
        #av-preview-language-row>a[aria-current="page"]:after{content:"";position:absolute;left:7px;right:7px;bottom:-4px;height:1px;background:linear-gradient(90deg,transparent,#e7c96b,transparent);box-shadow:0 0 8px rgba(57,255,20,.22)}
        #av-preview-language-row img,#av-preview-language-row .av-mini-flag{display:block!important;width:36px!important;height:25px!important;max-width:36px!important;max-height:25px!important;object-fit:cover!important;border-radius:3px!important;filter:saturate(1.08) contrast(1.03)!important}
      }

      @media(min-width:1200px){
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium{width:292px!important;min-width:292px!important}
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium .av-brand-logo{width:292px!important;max-height:82px!important}
        #av-preview-language-row{gap:18px!important}
        #av-preview-language-row img,#av-preview-language-row .av-mini-flag{width:38px!important;height:26px!important;max-width:38px!important;max-height:26px!important}
      }

      @media(min-width:821px) and (max-width:980px){
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium{width:248px!important;max-width:248px!important;height:auto!important}
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium .av-brand-logo{width:248px!important;height:auto!important;max-height:72px!important}
        #av-preview-language-row{display:flex!important;align-items:center!important;justify-content:center!important;gap:13px!important;min-height:42px!important;padding:5px 12px 7px!important;border-top:1px solid rgba(229,198,103,.11)!important;background:rgba(2,5,3,.92)!important}
        #av-preview-language-row>a{display:grid!important;place-items:center!important;width:40px!important;height:29px!important;padding:2px!important;border:0!important;border-radius:5px!important;background:transparent!important}
        #av-preview-language-row img,#av-preview-language-row .av-mini-flag{display:block!important;width:34px!important;height:24px!important;max-width:34px!important;max-height:24px!important;object-fit:cover!important;border-radius:3px!important}
      }

      @media(max-width:820px){
        html.av-header-tiered-preview.av-mobile-approved body:not(.guide-page) header.top{padding:0!important;background:linear-gradient(180deg,#050806 0%,#010201 100%)!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header{position:relative!important;display:grid!important;grid-template-columns:54px minmax(0,1fr) 54px!important;grid-template-areas:"chat logo hamb" "flags flags flags"!important;align-items:center!important;column-gap:8px!important;row-gap:4px!important;width:100%!important;min-height:128px!important;margin:0!important;padding:8px 10px 7px!important;background:transparent!important;border:0!important;box-shadow:none!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-logo{grid-area:logo!important;display:flex!important;align-items:center!important;justify-content:center!important;width:min(100%,244px)!important;max-width:244px!important;min-width:0!important;height:70px!important;margin:0 auto!important;padding:0!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-logo img{display:block!important;width:100%!important;max-width:244px!important;height:auto!important;max-height:70px!important;object-fit:contain!important;object-position:center!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-chat{grid-area:chat!important;justify-self:start!important;margin:0!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-hamb{grid-area:hamb!important;justify-self:end!important;margin:0!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags{grid-area:flags!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;width:100%!important;min-width:0!important;margin:0!important;padding:7px 2px 0!important;border-top:1px solid rgba(229,198,103,.10)!important;background:transparent!important;overflow:visible!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags:before{content:"";position:absolute;left:50%;top:-1px;width:68%;height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgba(229,198,103,.28),rgba(57,255,20,.12),rgba(229,198,103,.28),transparent)}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags>a{position:relative!important;display:grid!important;place-items:center!important;width:38px!important;height:29px!important;min-width:0!important;margin:0!important;padding:2px!important;border:0!important;border-radius:5px!important;background:transparent!important;box-shadow:none!important;opacity:.84!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags>a[aria-current="page"]{opacity:1!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags>a[aria-current="page"]:after{content:"";position:absolute;left:7px;right:7px;bottom:-3px;height:1px;background:linear-gradient(90deg,transparent,#e7c96b,transparent);box-shadow:0 0 7px rgba(57,255,20,.2)}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags img,
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags .av-mini-flag{display:block!important;width:34px!important;height:24px!important;max-width:34px!important;max-height:24px!important;object-fit:cover!important;border-radius:3px!important;filter:saturate(1.08) contrast(1.03)!important}
        #av-preview-language-row{display:none!important}
      }

      @media(max-width:390px){
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header{grid-template-columns:50px minmax(0,1fr) 50px!important;column-gap:5px!important;padding-left:7px!important;padding-right:7px!important;min-height:124px!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-logo{max-width:226px!important;height:66px!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-logo img{max-width:226px!important;max-height:66px!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags{gap:5px!important;padding-left:0!important;padding-right:0!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags>a{width:36px!important;height:28px!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags img,
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags .av-mini-flag{width:32px!important;height:22px!important;max-width:32px!important;max-height:22px!important}
      }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add('av-header-tiered-preview');
  };

  const buildSecondaryLanguageRow=()=>{
    if(document.getElementById('av-preview-language-row'))return;
    const header=document.querySelector('header.top');
    if(!header)return;
    const oldFlags=[...(header.querySelectorAll('.av-lang-switch>a')||[])];
    if(!oldFlags.length)return;
    const row=document.createElement('nav');
    row.id='av-preview-language-row';
    row.setAttribute('aria-label','Alege limba');
    oldFlags.slice(0,7).forEach(a=>{
      const c=a.cloneNode(true);
      c.removeAttribute('style');
      row.appendChild(c);
    });
    header.appendChild(row);
  };

  const installMobileApproved=()=>{
    if(!mobile()||document.getElementById('av-mobile-approved-header'))return;

    const header=document.querySelector('header.top');
    const oldBrand=header?.querySelector('.brand.av-brand-premium');
    const oldLogo=oldBrand?.querySelector('.av-brand-logo');
    const oldFlags=[...(header?.querySelectorAll('.av-lang-switch>a')||[])];
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
      chat.addEventListener('click',()=>header.querySelector('.avchat-launcher.avchat-header-slot')?.click());

      const hamb=document.createElement('button');
      hamb.className='avm-hamb';
      hamb.type='button';
      hamb.setAttribute('aria-label','Deschide meniul');
      hamb.setAttribute('aria-expanded','false');
      hamb.innerHTML='<i></i><i></i><i></i>';
      const syncMenu=()=>{
        const open=menu?.classList.contains('open')||false;
        hamb.setAttribute('aria-expanded',String(open));
        hamb.setAttribute('aria-label',open?'Închide meniul':'Deschide meniul');
      };
      hamb.addEventListener('click',event=>{
        event.stopPropagation();
        if(oldHamb){oldHamb.click();syncMenu();return;}
        if(!menu)return;
        const open=!menu.classList.contains('open');
        menu.classList.toggle('open',open);
        if(open)menu.removeAttribute('inert'); else menu.setAttribute('inert','');
        if(backdrop)backdrop.hidden=!open;
        syncMenu();
      });
      if(menu)new MutationObserver(syncMenu).observe(menu,{attributes:true,attributeFilter:['class']});

      approvedHeader.append(logoLink,flags,chat,hamb);
      header.appendChild(approvedHeader);
      document.documentElement.classList.add('av-mobile-approved');
    }
  };

  const install=()=>{
    installPreviewStyle();
    buildSecondaryLanguageRow();
    installMobileApproved();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
