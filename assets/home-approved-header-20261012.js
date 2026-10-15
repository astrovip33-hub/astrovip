(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;

  const mobile=()=>window.matchMedia('(max-width:820px)').matches;

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

    if(header){
      if(menu)header.appendChild(menu);
      if(backdrop)header.appendChild(backdrop);
      [...header.children].forEach(el=>{
        if(el.id!=='av-mobile-approved-header'&&el!==menu&&el!==backdrop)el.style.setProperty('display','none','important');
      });
    }

    if(header&&!document.getElementById('av-mobile-approved-header')){
      const approvedHeader=document.createElement('div');
      approvedHeader.id='av-mobile-approved-header';
      approvedHeader.setAttribute('aria-label','Header AstroVip mobil');
      header.style.setProperty('border-bottom','0','important');
      header.style.setProperty('box-shadow','none','important');
      approvedHeader.style.setProperty('border-bottom','0','important');
      approvedHeader.style.setProperty('box-shadow','none','important');

      const logoLink=document.createElement('a');
      logoLink.className='avm-logo';
      logoLink.href='/';
      logoLink.setAttribute('aria-label','AstroVip - Acasă');
      logoLink.innerHTML='<img src="/assets/astrovip-header-premium-20261015.png?v=20261015-1" alt="AstroVip - Timing-ul conteaza!" width="2171" height="724" decoding="async" fetchpriority="high">';

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
      hamb.innerHTML='<span class="avm-hamb-glow" aria-hidden="true"><i></i><i></i><i></i></span>';
      const syncMenu=()=>{
        const open=menu?.classList.contains('open')||false;
        hamb.setAttribute('aria-expanded',String(open));
        hamb.setAttribute('aria-label',open?'Închide meniul':'Deschide meniul');
      };
      hamb.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        if(!menu)return;
        const open=!menu.classList.contains('open');
        menu.classList.toggle('open',open);
        menu.style.setProperty('display',open?'flex':'none','important');
        if(open)menu.removeAttribute('inert'); else menu.setAttribute('inert','');
        if(backdrop)backdrop.hidden=!open;
        syncMenu();
      });
      if(menu)new MutationObserver(syncMenu).observe(menu,{attributes:true,attributeFilter:['class']});

      approvedHeader.append(logoLink,hamb);
      const footer=document.querySelector('footer');
      if(footer&&!document.getElementById('av-footer-languages')){
        const lang=document.createElement('section');
        lang.id='av-footer-languages';
        lang.setAttribute('aria-label','Limba / Language');
        lang.innerHTML='<strong>LIMBA <span>/ LANGUAGE</span></strong><nav aria-label="Alege limba"></nav>';
        const nav=lang.querySelector('nav');
        oldFlags.slice(0,7).forEach(a=>{const c=a.cloneNode(true);c.className='';c.removeAttribute('style');nav.appendChild(c)});
        footer.appendChild(lang);
        const footerChat=document.createElement('button');
        footerChat.id='av-footer-chat-premium';
        footerChat.type='button';
        footerChat.setAttribute('aria-label','Deschide AstroVip Chat');
        footerChat.innerHTML='<span class="avfc-live" aria-hidden="true"></span><span><strong>CHAT ASTROVIP</strong><small>ONLINE · RĂSPUNS RAPID</small></span><b aria-hidden="true">→</b>';
        footerChat.addEventListener('click',()=>header.querySelector('.avchat-launcher.avchat-header-slot')?.click());
        footer.appendChild(footerChat);
      }
      header.appendChild(approvedHeader);
      document.documentElement.classList.add('av-mobile-approved');
    }

  };

  const install=()=>{
    installCheckoutPayLabel();
    installMobileApproved();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
