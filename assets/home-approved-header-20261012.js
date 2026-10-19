(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;
  const mobile=()=>window.matchMedia('(max-width:820px)').matches;
  const repairPayment=()=>{const bar=document.getElementById('av-home-payment-cta');if(!bar)return;bar.setAttribute('aria-label','Plată consultație AstroVip');const inner=bar.querySelector('.av-home-paybar-inner');const info=inner?.querySelector('div');const pay=inner?.querySelector('a');if(info){const s=info.querySelector('span'),strong=info.querySelector('strong'),small=info.querySelector('small');if(s)s.textContent='CONSULTAȚIE PREMIUM · 60 MIN';if(strong)strong.textContent='Plată securizată cu cardul';if(small)small.textContent='500 lei · procesare securizată prin Stripe';}if(pay){pay.textContent='PLĂTEȘTE CU CARDUL · 500 LEI →';pay.setAttribute('aria-label','Plătește consultația AstroVip cu cardul, 500 lei');pay.style.setProperty('box-sizing','border-box');pay.style.setProperty('max-width','100%');}if(inner){inner.style.setProperty('box-sizing','border-box');inner.style.setProperty('max-width','100%');inner.style.setProperty('overflow','hidden');if(mobile()){inner.style.setProperty('flex-direction','column');inner.style.setProperty('align-items','stretch');if(pay){pay.style.setProperty('width','100%');pay.style.setProperty('white-space','normal');pay.style.setProperty('text-align','center');}}}};
  const installCheckoutPayLabel=()=>{const pay=document.getElementById('bookingSubmit');if(!pay)return;pay.textContent='PLĂTEȘTE CU CARDUL · 500 LEI →';pay.setAttribute('aria-label','Plătește cu cardul 500 lei prin Stripe');pay.setAttribute('title','Plată securizată prin Stripe');};
  const installMobileApproved=()=>{
    if(!mobile())return;
    const header=document.querySelector('header.top');
    if(!header||header.dataset.avMobileHeaderBound==='1')return;
    header.id='av-site-header';
    const oldFlags=[...header.querySelectorAll('.av-lang-switch>a')];
    const menu=header.querySelector('#menu'),backdrop=header.querySelector('.av-pro-backdrop');
    if(menu){
      [...menu.querySelectorAll('a,button')].forEach(el=>{
        const t=(el.textContent||'').trim().toLocaleUpperCase('ro-RO').replace(/\s+/g,' ');
        if(/^PROGRAMEAZ[ĂA]-?TE(?:\b|\s|→)/.test(t)){el.style.setProperty('display','none','important');el.setAttribute('aria-hidden','true');el.setAttribute('tabindex','-1');}
      });
      header.appendChild(menu);
    }
    if(backdrop)header.appendChild(backdrop);
    let approvedHeader=header.querySelector('#av-mobile-approved-header');
    // Reuse the header already rendered in HTML; older cached pages get a fallback.
    if(!approvedHeader){
      approvedHeader=document.createElement('div');approvedHeader.id='av-mobile-approved-header';
      approvedHeader.setAttribute('aria-label','Header AstroVip mobil');
      approvedHeader.innerHTML='<a class="avm-logo" href="/" aria-label="AstroVip - Acasă"><span class="av-premium-title">ASTROLOGIE PREMIUM</span></a><button class="avm-hamb" type="button" aria-controls="menu" aria-expanded="false" aria-label="Deschide meniul"><span class="avm-hamb-glow" aria-hidden="true"><i></i><i></i><i></i></span></button>';
      header.prepend(approvedHeader);
    }
    const hamb=approvedHeader.querySelector('.avm-hamb');
    const syncMenu=()=>{
      const open=menu?.classList.contains('open')||false;
      hamb.setAttribute('aria-expanded',String(open));hamb.setAttribute('aria-label',open?'Închide meniul':'Deschide meniul');
      if(!open&&menu?.contains(document.activeElement))hamb.focus();
    };
    hamb.addEventListener('click',event=>{
      event.preventDefault();event.stopPropagation();
      if(menu){header.querySelector('#hamb')?.click();syncMenu();}
    });
    if(menu)new MutationObserver(syncMenu).observe(menu,{attributes:true,attributeFilter:['class']});
    const footer=document.querySelector('footer');const footerShell=footer?.querySelector('.av-footer-premium-single')||footer;if(footer&&!document.getElementById('av-footer-languages')){const lang=document.createElement('section');lang.id='av-footer-languages';lang.setAttribute('aria-label','Limba / Language');lang.innerHTML='<strong>LIMBA <span>/ LANGUAGE</span></strong><nav aria-label="Alege limba"></nav>';const nav=lang.querySelector('nav');oldFlags.slice(0,7).forEach(a=>{const c=a.cloneNode(true);c.className='';c.removeAttribute('style');nav.appendChild(c)});footerShell.appendChild(lang);const footerChat=document.createElement('button');footerChat.id='av-footer-chat-premium';footerChat.type='button';footerChat.setAttribute('aria-label','Deschide AstroVip Chat');footerChat.innerHTML='<span class="avfc-live" aria-hidden="true"></span><span><strong>CHAT ASTROVIP</strong><small>ONLINE · RĂSPUNS RAPID</small></span><b aria-hidden="true">→</b>';footerChat.addEventListener('click',()=>header.querySelector('.avchat-launcher.avchat-header-slot')?.click());footerShell.appendChild(footerChat);if('IntersectionObserver' in window)new IntersectionObserver(entries=>{document.body.classList.toggle('av-footer-visible',entries.some(entry=>entry.isIntersecting));},{threshold:0}).observe(footer);}
    header.dataset.avMobileHeaderBound='1';
    document.documentElement.classList.add('av-mobile-approved');
  };
  const install=()=>{repairPayment();installCheckoutPayLabel();installMobileApproved();};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
