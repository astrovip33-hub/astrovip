(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;

  const mobile=()=>window.matchMedia('(max-width:820px)').matches;

  const languageCode=(href='')=>{
    try{
      const path=new URL(href,location.origin).pathname.replace(/^\/+|\/+$/g,'');
      if(!path)return 'RO';
      const code=path.split('/')[0].toUpperCase();
      return ({EN:'EN',ES:'ES',IT:'IT',ZH:'ZH',AR:'AR',RU:'RU'})[code]||code.slice(0,2);
    }catch(_){return 'RO';}
  };

  const buildLanguagePicker=(links,extraClass='')=>{
    const picker=document.createElement('div');
    picker.className=`av-premium-langpicker ${extraClass}`.trim();

    const current=links.find(a=>a.getAttribute('aria-current')==='page'||a.classList.contains('active'))||
      links.find(a=>{
        try{return new URL(a.href,location.origin).pathname===location.pathname;}catch(_){return false;}
      })||links[0];

    const trigger=document.createElement('button');
    trigger.type='button';
    trigger.className='av-premium-langtrigger';
    trigger.setAttribute('aria-haspopup','menu');
    trigger.setAttribute('aria-expanded','false');
    trigger.setAttribute('aria-label','Alege limba');

    const img=current?.querySelector('img');
    if(img)trigger.appendChild(img.cloneNode(true));

    const label=document.createElement('b');
    label.textContent=languageCode(current?.getAttribute('href')||location.pathname);
    trigger.appendChild(label);

    const chevron=document.createElement('i');
    chevron.setAttribute('aria-hidden','true');
    trigger.appendChild(chevron);

    const menu=document.createElement('div');
    menu.className='av-premium-langmenu';
    menu.setAttribute('role','menu');
    menu.hidden=true;

    links.slice(0,7).forEach(a=>{
      const item=a.cloneNode(true);
      item.className='av-premium-langitem';
      item.removeAttribute('style');
      item.setAttribute('role','menuitem');
      [...item.querySelectorAll('span')].forEach(s=>s.remove());
      const text=document.createElement('span');
      text.textContent=languageCode(a.getAttribute('href')||'');
      item.appendChild(text);
      menu.appendChild(item);
    });

    const close=()=>{
      picker.classList.remove('is-open');
      trigger.setAttribute('aria-expanded','false');
      menu.hidden=true;
    };

    trigger.addEventListener('click',event=>{
      event.stopPropagation();
      const open=!picker.classList.contains('is-open');
      document.querySelectorAll('.av-premium-langpicker.is-open').forEach(p=>{
        if(p!==picker){
          p.classList.remove('is-open');
          p.querySelector('.av-premium-langtrigger')?.setAttribute('aria-expanded','false');
          const m=p.querySelector('.av-premium-langmenu');
          if(m)m.hidden=true;
        }
      });
      picker.classList.toggle('is-open',open);
      trigger.setAttribute('aria-expanded',String(open));
      menu.hidden=!open;
    });

    picker.addEventListener('click',event=>event.stopPropagation());
    document.addEventListener('click',close);
    document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});

    picker.append(trigger,menu);
    return picker;
  };

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

      body:not(.guide-page) .av-langbar,
      body:not(.guide-page) .av-language-picker{
        display:none!important;
        height:0!important;
        min-height:0!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        overflow:hidden!important;
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

      .av-premium-langpicker{
        position:relative;
        z-index:180;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        font-family:Inter,system-ui,sans-serif;
      }
      .av-premium-langtrigger{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:7px;
        height:36px;
        min-width:72px;
        padding:0 11px;
        border:1px solid rgba(229,196,103,.45);
        border-radius:999px;
        background:linear-gradient(180deg,rgba(20,18,11,.96),rgba(7,7,6,.98));
        color:#f7f2e7;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 7px 22px rgba(0,0,0,.24);
        cursor:pointer;
      }
      .av-premium-langtrigger:hover,
      .av-premium-langpicker.is-open .av-premium-langtrigger{
        border-color:rgba(255,222,122,.78);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 8px 24px rgba(0,0,0,.28),0 0 14px rgba(225,189,88,.10);
      }
      .av-premium-langtrigger img{
        display:block!important;width:22px!important;height:16px!important;
        max-width:22px!important;max-height:16px!important;object-fit:cover!important;
        border-radius:2px!important;margin:0!important;border:0!important;
      }
      .av-premium-langtrigger b{
        font-size:11px;line-height:1;letter-spacing:.055em;color:#f5efe1;
      }
      .av-premium-langtrigger i{
        display:block;width:6px;height:6px;
        border-right:1.5px solid #e6cc7b;border-bottom:1.5px solid #e6cc7b;
        transform:rotate(45deg) translateY(-2px);transition:transform .18s ease;
      }
      .av-premium-langpicker.is-open .av-premium-langtrigger i{
        transform:rotate(225deg) translate(-1px,-1px);
      }
      .av-premium-langmenu{
        position:absolute;top:calc(100% + 9px);right:0;min-width:118px;padding:7px;
        border:1px solid rgba(229,196,103,.38);border-radius:14px;
        background:linear-gradient(180deg,rgba(13,13,11,.99),rgba(4,5,4,.995));
        box-shadow:0 18px 46px rgba(0,0,0,.52),0 0 18px rgba(226,192,93,.06);
        backdrop-filter:blur(16px);
      }
      .av-premium-langmenu[hidden]{display:none!important}
      .av-premium-langitem{
        display:flex!important;align-items:center!important;gap:9px!important;
        min-height:34px!important;padding:7px 9px!important;margin:0!important;border:0!important;
        border-radius:9px!important;background:transparent!important;color:#f5f1e8!important;
        text-decoration:none!important;box-shadow:none!important;
      }
      .av-premium-langitem:hover{background:rgba(231,199,105,.08)!important;color:#f7d878!important}
      .av-premium-langitem img{
        display:block!important;width:23px!important;height:16px!important;
        max-width:23px!important;max-height:16px!important;object-fit:cover!important;
        border-radius:2px!important;margin:0!important;border:0!important;
      }
      .av-premium-langitem span{
        font-size:11px!important;line-height:1!important;font-weight:850!important;letter-spacing:.06em!important;
      }

      @media(min-width:821px){
        body:not(.guide-page) header.top .av-lang-switch,
        body:not(.guide-page) header.top .av-header-language{
          display:none!important;
        }
        body:not(.guide-page) header.top .nav-actions{
          width:auto!important;min-width:0!important;max-width:none!important;gap:8px!important;
        }
        body:not(.guide-page) header.top .nav-actions .av-premium-langpicker{order:-1}
      }

      @media(min-width:1381px){
        body:not(.guide-page) header.top{min-height:76px!important}
        body:not(.guide-page) header.top .brand.av-brand-premium{
          width:214px!important;max-width:214px!important;height:54px!important;
        }
        body:not(.guide-page) header.top .menu>a,
        body:not(.guide-page) header.top .av-menu-trigger{
          font-size:10.7px!important;padding:8px 5px!important;
        }
      }

      @media(min-width:1181px) and (max-width:1380px){
        body:not(.guide-page) header.top .brand.av-brand-premium{
          width:170px!important;max-width:170px!important;height:49px!important;
        }
      }

      @media(max-width:820px){
        body:not(.guide-page) header.top{
          min-height:68px!important;
          background:linear-gradient(180deg,rgba(7,8,7,.995),rgba(2,3,2,.99))!important;
          border-bottom-color:rgba(226,192,94,.40)!important;
          box-shadow:0 10px 28px rgba(0,0,0,.44)!important;
        }

        body:not(.guide-page) header.top .brand.av-brand-premium,
        body:not(.guide-page) header.top .av-header-language,
        body:not(.guide-page) header.top .av-lang-switch,
        body:not(.guide-page) header.top .nav-actions{
          display:none!important;
        }

        #av-mobile-approved-header{
          position:absolute!important;
          z-index:170!important;
          inset:0!important;
          display:grid!important;
          grid-template-columns:118px minmax(58px,1fr) 62px 34px!important;
          align-items:center!important;
          gap:6px!important;
          width:100%!important;
          height:68px!important;
          padding:7px 8px!important;
          box-sizing:border-box!important;
          background:transparent!important;
        }
        #av-mobile-approved-header .avm-logo{
          display:flex!important;align-items:center!important;
          width:118px!important;height:52px!important;overflow:visible!important;
          filter:drop-shadow(0 0 9px rgba(229,194,96,.12));
        }
        #av-mobile-approved-header .avm-logo .av-brand-logo{
          display:block!important;width:118px!important;max-width:118px!important;height:auto!important;max-height:52px!important;
        }
        #av-mobile-approved-header .avm-language{justify-self:center;width:auto;min-width:0}
        #av-mobile-approved-header .av-premium-langtrigger{height:34px;min-width:61px;padding:0 8px;gap:5px}
        #av-mobile-approved-header .av-premium-langtrigger img{
          width:20px!important;height:14px!important;max-width:20px!important;max-height:14px!important;
        }
        #av-mobile-approved-header .av-premium-langtrigger b{font-size:10px}
        #av-mobile-approved-header .av-premium-langmenu{
          right:50%;transform:translateX(50%);top:calc(100% + 8px);
        }
        #av-mobile-approved-header .avm-chat{
          display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;
          width:62px!important;height:38px!important;padding:0!important;
          border:1px solid rgba(54,238,130,.48)!important;border-radius:999px!important;
          background:linear-gradient(180deg,rgba(9,29,17,.97),rgba(3,10,6,.99))!important;
          color:#fff!important;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 7px 18px rgba(0,0,0,.22),0 0 13px rgba(42,236,122,.08)!important;
          font:900 10px/1 Inter,system-ui,sans-serif!important;
        }
        #av-mobile-approved-header .avm-chat span{
          width:6px;height:6px;border-radius:50%;background:#38ff8d;box-shadow:0 0 8px #38ff8d;
        }
        #av-mobile-approved-header .avm-hamb{
          display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;
          gap:4px!important;width:34px!important;height:38px!important;margin:0!important;padding:0!important;
          border:0!important;outline:0!important;background:transparent!important;box-shadow:none!important;
        }
        #av-mobile-approved-header .avm-hamb i{
          display:block!important;width:25px!important;height:2px!important;border-radius:99px!important;
          background:linear-gradient(90deg,#d4a93f,#ffe79a)!important;
          box-shadow:0 0 7px rgba(233,199,102,.16)!important;
        }
      }

      @media(max-width:370px){
        #av-mobile-approved-header{
          grid-template-columns:104px minmax(52px,1fr) 55px 31px!important;
          gap:4px!important;padding-left:6px!important;padding-right:6px!important;
        }
        #av-mobile-approved-header .avm-logo,
        #av-mobile-approved-header .avm-logo .av-brand-logo{
          width:104px!important;max-width:104px!important;
        }
        #av-mobile-approved-header .av-premium-langtrigger{min-width:54px;padding:0 6px;gap:4px}
        #av-mobile-approved-header .av-premium-langtrigger img{
          width:18px!important;height:13px!important;max-width:18px!important;max-height:13px!important;
        }
        #av-mobile-approved-header .avm-chat{width:55px!important;font-size:9px!important}
        #av-mobile-approved-header .avm-hamb{width:31px!important}
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

  const installDesktopLanguagePicker=()=>{
    if(mobile())return;
    document.querySelectorAll('#av-desktop-premium-language').forEach((el,i)=>{if(i)el.remove();});
    if(document.getElementById('av-desktop-premium-language'))return;

    const header=document.querySelector('header.top');
    const actions=header?.querySelector('.nav-actions');
    const links=[...(header?.querySelectorAll('.av-lang-switch>a')||[])];
    if(!header||!actions||!links.length)return;

    const picker=buildLanguagePicker(links,'av-desktop-language');
    picker.id='av-desktop-premium-language';
    actions.prepend(picker);
  };

  const installMobileApproved=()=>{
    if(!mobile())return;

    const header=document.querySelector('header.top');
    if(!header)return;

    const existing=[...header.querySelectorAll('#av-mobile-approved-header')];
    existing.slice(1).forEach(el=>el.remove());
    if(existing[0])return;

    const oldBrand=header.querySelector('.brand.av-brand-premium');
    const oldLogo=oldBrand?.querySelector('.av-brand-logo');
    const oldFlags=[...(header.querySelectorAll('.av-lang-switch>a')||[])];
    const oldHamb=header.querySelector('#hamb');
    const menu=header.querySelector('#menu');
    const backdrop=header.querySelector('.av-pro-backdrop');

    const approvedHeader=document.createElement('div');
    approvedHeader.id='av-mobile-approved-header';
    approvedHeader.setAttribute('aria-label','Header AstroVip mobil');

    const logoLink=document.createElement('a');
    logoLink.className='avm-logo';
    logoLink.href='/';
    logoLink.setAttribute('aria-label','AstroVip - Acasă');
    if(oldLogo)logoLink.appendChild(oldLogo.cloneNode(true));
    else logoLink.textContent='ASTROVIP';

    const language=buildLanguagePicker(oldFlags,'avm-language');

    const chat=document.createElement('button');
    chat.className='avm-chat';
    chat.type='button';
    chat.innerHTML='<span aria-hidden="true"></span><b>CHAT</b>';
    chat.setAttribute('aria-label','Deschide AstroVip Chat');
    chat.addEventListener('click',()=>{
      const source=header.querySelector('.avchat-launcher.avchat-header-slot');
      source?.click();
    });

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
      if(oldHamb){
        oldHamb.click();
        syncMenu();
        return;
      }
      if(!menu)return;
      const open=!menu.classList.contains('open');
      menu.classList.toggle('open',open);
      if(open)menu.removeAttribute('inert'); else menu.setAttribute('inert','');
      if(backdrop)backdrop.hidden=!open;
      syncMenu();
    });

    if(menu)new MutationObserver(syncMenu).observe(menu,{attributes:true,attributeFilter:['class']});

    approvedHeader.append(logoLink,language,chat,hamb);
    header.appendChild(approvedHeader);
    document.documentElement.classList.add('av-mobile-approved','av-mobile-single-header');
  };

  const install=()=>{
    installElegantLevelOne();
    installCheckoutPayLabel();
    installDesktopLanguagePicker();
    installMobileApproved();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
