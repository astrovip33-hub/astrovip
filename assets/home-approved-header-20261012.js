(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;

  const mobile=()=>window.matchMedia('(max-width:820px)').matches;

  const installPreviewStyle=()=>{
    if(document.getElementById('av-header-tiered-preview-style'))return;
    const style=document.createElement('style');
    style.id='av-header-tiered-preview-style';
    style.textContent=`
      html.av-header-tiered-preview body:not(.guide-page) header.top{overflow:visible!important}
      html.av-header-tiered-preview body:not(.guide-page) header.top>.av-langbar,
      html.av-header-tiered-preview body:not(.guide-page) header.top .av-language-picker{display:none!important}
      #av-preview-language-row{display:none}

      @media(min-width:981px){
        html.av-header-tiered-preview body:not(.guide-page) header.top>.nav.wrap{width:min(1320px,calc(100% - 30px))!important;min-height:82px!important;height:auto!important;gap:14px!important}
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium{width:218px!important;min-width:218px!important;height:auto!important;margin:0!important}
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium .av-brand-logo{display:block!important;width:218px!important;height:auto!important;max-height:none!important;object-fit:contain!important}
        #av-preview-language-row{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:9px!important;width:100%!important;min-height:50px!important;padding:7px 18px 9px!important;border-top:1px solid rgba(229,198,103,.16)!important;border-bottom:1px solid rgba(255,255,255,.045)!important;background:linear-gradient(180deg,rgba(2,5,3,.78),rgba(1,2,1,.94))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.02)!important;z-index:2!important}
        #av-preview-language-row:before{content:"";position:absolute;left:50%;top:0;width:min(680px,72%);height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgba(229,198,103,.34),rgba(57,255,20,.25),rgba(229,198,103,.34),transparent)}
        #av-preview-language-row>a{display:grid!important;place-items:center!important;width:44px!important;height:34px!important;margin:0!important;padding:4px!important;border:1px solid rgba(229,198,103,.32)!important;border-radius:9px!important;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.012))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important;opacity:.92!important;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease!important}
        #av-preview-language-row>a:hover{transform:translateY(-1px)!important;border-color:rgba(229,198,103,.72)!important;box-shadow:0 0 13px rgba(229,198,103,.11)!important;opacity:1!important}
        #av-preview-language-row>a[aria-current="page"]{border-color:#d8b85c!important;box-shadow:0 0 0 1px rgba(57,255,20,.18),0 0 13px rgba(229,198,103,.12)!important;background:linear-gradient(180deg,rgba(229,198,103,.11),rgba(57,255,20,.025))!important}
        #av-preview-language-row img,#av-preview-language-row .av-mini-flag{display:block!important;width:30px!important;height:21px!important;max-width:30px!important;max-height:21px!important;object-fit:cover!important;border-radius:3px!important}
      }

      @media(min-width:1200px){
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium{width:236px!important;min-width:236px!important}
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium .av-brand-logo{width:236px!important}
        #av-preview-language-row>a{width:46px!important;height:35px!important}
        #av-preview-language-row img,#av-preview-language-row .av-mini-flag{width:31px!important;height:22px!important;max-width:31px!important;max-height:22px!important}
      }

      @media(min-width:821px) and (max-width:980px){
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium{width:226px!important;max-width:226px!important;height:auto!important}
        html.av-header-tiered-preview body:not(.guide-page) header.top .brand.av-brand-premium .av-brand-logo{width:226px!important;height:auto!important;max-height:none!important}
        #av-preview-language-row{display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;min-height:47px!important;padding:7px 12px 8px!important;border-top:1px solid rgba(229,198,103,.15)!important;background:rgba(2,5,3,.9)!important}
        #av-preview-language-row>a{display:grid!important;place-items:center!important;width:42px!important;height:33px!important;padding:4px!important;border:1px solid rgba(229,198,103,.3)!important;border-radius:9px!important;background:rgba(255,255,255,.025)!important}
        #av-preview-language-row img,#av-preview-language-row .av-mini-flag{display:block!important;width:29px!important;height:20px!important;max-width:29px!important;max-height:20px!important;object-fit:cover!important;border-radius:3px!important}
      }

      @media(max-width:820px){
        html.av-header-tiered-preview.av-mobile-approved body:not(.guide-page) header.top{padding:0!important;background:linear-gradient(180deg,rgba(5,8,6,.99),rgba(1,3,2,.99))!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header{position:relative!important;display:grid!important;grid-template-columns:52px minmax(0,1fr) 52px!important;grid-template-areas:"chat logo hamb" "flags flags flags"!important;align-items:center!important;column-gap:8px!important;row-gap:7px!important;width:100%!important;min-height:116px!important;margin:0!important;padding:7px 10px 8px!important;background:transparent!important;border:0!important;box-shadow:none!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-logo{grid-area:logo!important;display:flex!important;align-items:center!important;justify-content:center!important;width:min(100%,210px)!important;max-width:210px!important;min-width:0!important;height:58px!important;margin:0 auto!important;padding:0!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-logo img{display:block!important;width:100%!important;max-width:210px!important;height:auto!important;max-height:58px!important;object-fit:contain!important;object-position:center!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-chat{grid-area:chat!important;justify-self:start!important;margin:0!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-hamb{grid-area:hamb!important;justify-self:end!important;margin:0!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags{grid-area:flags!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;width:100%!important;min-width:0!important;margin:0!important;padding:7px 4px 0!important;border-top:1px solid rgba(229,198,103,.16)!important;background:linear-gradient(180deg,rgba(255,255,255,.018),transparent)!important;overflow:visible!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags:before{content:"";position:absolute;left:50%;top:-1px;width:72%;height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgba(229,198,103,.38),rgba(57,255,20,.2),rgba(229,198,103,.38),transparent)}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags>a{display:grid!important;place-items:center!important;width:clamp(36px,9.6vw,40px)!important;height:32px!important;min-width:0!important;margin:0!important;padding:3px!important;border:1px solid rgba(229,198,103,.34)!important;border-radius:8px!important;background:rgba(255,255,255,.028)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags>a[aria-current="page"]{border-color:#d8b85c!important;box-shadow:0 0 0 1px rgba(57,255,20,.16),0 0 11px rgba(229,198,103,.1)!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags img,
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags .av-mini-flag{display:block!important;width:27px!important;height:19px!important;max-width:27px!important;max-height:19px!important;object-fit:cover!important;border-radius:3px!important}
        #av-preview-language-row{display:none!important}
      }

      @media(max-width:360px){
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header{grid-template-columns:48px minmax(0,1fr) 48px!important;column-gap:5px!important;padding-left:7px!important;padding-right:7px!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-logo{max-width:192px!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-logo img{max-width:192px!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags{gap:4px!important;padding-left:1px!important;padding-right:1px!important}
        html.av-header-tiered-preview.av-mobile-approved #av-mobile-approved-header .avm-flags>a{width:36px!important;height:31px!important}
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
