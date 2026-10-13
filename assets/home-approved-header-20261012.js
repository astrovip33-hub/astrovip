(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;

  const mobile=()=>window.matchMedia('(max-width:820px)').matches;

  const installElegantLevelOne=()=>{
    if(document.getElementById('av-premium-elegant-header-level1'))return;
    const style=document.createElement('style');
    style.id='av-premium-elegant-header-level1';
    style.textContent=`
      body:not(.guide-page) header.top{
        background:
          radial-gradient(circle at 15% -60%,rgba(225,188,92,.12),transparent 34%),
          linear-gradient(180deg,rgba(8,8,8,.985),rgba(2,3,2,.975))!important;
        border-top:1px solid rgba(255,255,255,.08)!important;
        border-bottom:1px solid rgba(224,190,92,.42)!important;
        box-shadow:0 12px 36px rgba(0,0,0,.42),0 1px 0 rgba(255,255,255,.025) inset!important;
        backdrop-filter:blur(22px) saturate(125%)!important;
        -webkit-backdrop-filter:blur(22px) saturate(125%)!important;
      }
      body:not(.guide-page) header.top:after{
        content:'';
        position:absolute;
        left:0;right:0;bottom:-1px;height:1px;
        pointer-events:none;
        background:linear-gradient(90deg,transparent 4%,rgba(229,196,103,.2) 18%,rgba(255,226,137,.85) 50%,rgba(229,196,103,.2) 82%,transparent 96%);
        box-shadow:0 0 14px rgba(226,192,93,.18);
      }
      body:not(.guide-page) header.top .brand.av-brand-premium{
        filter:drop-shadow(0 0 8px rgba(228,194,97,.10));
      }
      body:not(.guide-page) header.top .brand.av-brand-premium .av-brand-logo{
        filter:drop-shadow(0 0 8px rgba(228,194,97,.12));
      }
      body:not(.guide-page) header.top .menu>a,
      body:not(.guide-page) header.top .av-menu-trigger{
        color:#f4f0e8!important;
        letter-spacing:.035em!important;
        font-weight:800!important;
        border-radius:999px!important;
        transition:color .18s ease,background .18s ease,transform .18s ease!important;
      }
      body:not(.guide-page) header.top .menu>a:hover,
      body:not(.guide-page) header.top .av-menu-trigger:hover{
        color:#f7d878!important;
        background:rgba(236,201,104,.055)!important;
        transform:translateY(-1px)!important;
      }
      body:not(.guide-page) header.top .nav-actions .nav-book{
        border:1px solid rgba(255,229,148,.78)!important;
        background:linear-gradient(180deg,#fff0ad 0,#e5c362 52%,#b8842b 100%)!important;
        color:#171006!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.72),0 8px 24px rgba(205,160,56,.18),0 0 14px rgba(232,197,96,.10)!important;
        text-shadow:0 1px 0 rgba(255,255,255,.18)!important;
      }
      body:not(.guide-page) header.top .nav-actions .avchat-launcher.avchat-header-slot{
        border:1px solid rgba(49,235,127,.50)!important;
        background:linear-gradient(180deg,rgba(9,29,17,.96),rgba(3,10,6,.98))!important;
        color:#f4fff7!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 8px 24px rgba(0,0,0,.22),0 0 14px rgba(41,235,119,.08)!important;
      }
      body:not(.guide-page) header.top .nav-actions .avchat-launcher.avchat-header-slot:hover{
        border-color:rgba(89,255,158,.72)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 10px 26px rgba(0,0,0,.26),0 0 18px rgba(49,239,128,.12)!important;
      }
      @media(min-width:1381px){
        body:not(.guide-page) header.top{min-height:76px!important}
        body:not(.guide-page) header.top .brand.av-brand-premium{width:214px!important;max-width:214px!important;height:54px!important}
        body:not(.guide-page) header.top .menu>a,
        body:not(.guide-page) header.top .av-menu-trigger{font-size:10.7px!important;padding:8px 5px!important}
      }
      @media(min-width:1181px) and (max-width:1380px){
        body:not(.guide-page) header.top .brand.av-brand-premium{width:170px!important;max-width:170px!important;height:49px!important}
      }
      @media(max-width:820px){
        body:not(.guide-page) header.top{
          min-height:68px!important;
          background:linear-gradient(180deg,rgba(7,8,7,.995),rgba(2,3,2,.99))!important;
          border-bottom-color:rgba(226,192,94,.40)!important;
          box-shadow:0 10px 28px rgba(0,0,0,.44)!important;
        }
        #av-mobile-approved-header{
          height:68px!important;
          padding-top:7px!important;
          padding-bottom:7px!important;
          background:transparent!important;
        }
        #av-mobile-approved-header .avm-logo{
          height:52px!important;
          filter:drop-shadow(0 0 9px rgba(229,194,96,.12));
        }
        #av-mobile-approved-header .avm-chat{
          height:38px!important;
          border:1px solid rgba(54,238,130,.48)!important;
          background:linear-gradient(180deg,rgba(9,29,17,.97),rgba(3,10,6,.99))!important;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 7px 18px rgba(0,0,0,.22),0 0 13px rgba(42,236,122,.08)!important;
        }
        #av-mobile-approved-header .avm-hamb{
          border:0!important;
          outline:0!important;
          box-shadow:none!important;
        }
        #av-mobile-approved-header .avm-hamb i{
          height:2px!important;
          background:linear-gradient(90deg,#d4a93f,#ffe79a)!important;
          box-shadow:0 0 7px rgba(233,199,102,.16)!important;
        }
      }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add('av-header-premium-elegant-level1');
  };

  const installCheckoutPayLabel=()=>{
    const pay=document.getElementById('bookingSubmit');
    if(!pay)return;
    pay.textContent='PLĂTEȘTE CU CARDUL · 500 LEI →';
    pay.setAttribute('aria-label','Plătește cu cardul 500 lei prin Stripe');
    pay.setAttribute('title','Plată securizată prin Stripe');
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
    installElegantLevelOne();
    installCheckoutPayLabel();
    installMobileApproved();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
