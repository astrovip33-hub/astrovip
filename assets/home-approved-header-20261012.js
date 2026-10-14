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
      [...header.children].forEach(el=>{
        if(el.id!=='av-mobile-approved-header')el.style.setProperty('display','none','important');
      });
    }

    if(header&&!document.getElementById('av-mobile-approved-header')){
      const approvedHeader=document.createElement('div');
      approvedHeader.id='av-mobile-approved-header';
      approvedHeader.setAttribute('aria-label','Header AstroVip mobil');

      const logoLink=document.createElement('a');
      logoLink.className='avm-logo';
      logoLink.href='/';
      logoLink.setAttribute('aria-label','AstroVip - Acasă');
      const premiumLogo=document.createElement('img');
      premiumLogo.src='/assets/astrovip-header-final.png';
      premiumLogo.alt='AstroVip — Timing-ul contează!';
      premiumLogo.width=1536; premiumLogo.height=512; premiumLogo.decoding='async'; premiumLogo.fetchPriority='high';
      logoLink.appendChild(premiumLogo);

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
        // The original outside-click handler only recognizes #hamb. Forward
        // the click there without also treating this visible button as outside.
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
