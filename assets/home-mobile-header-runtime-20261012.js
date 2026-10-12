(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;
  if(!matchMedia('(max-width:820px)').matches)return;

  const apply=()=>{
    document.documentElement.classList.add('av-ultra-home-production','av-mobile-approved');
    const header=document.querySelector('header.top');
    if(!header||document.getElementById('av-mobile-approved-header'))return;

    const oldBrand=header.querySelector('.brand.av-brand-premium');
    const oldLogo=oldBrand?.querySelector('.av-brand-logo');
    const oldFlags=[...(header.querySelectorAll('.av-lang-switch>a')||[])];
    const oldChat=header.querySelector('.avchat-launcher.avchat-header-slot');
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

    const flags=document.createElement('nav');
    flags.className='avm-flags';
    flags.setAttribute('aria-label','Alege limba');
    oldFlags.slice(0,7).forEach(a=>{
      const clone=a.cloneNode(true);
      clone.className='';
      clone.removeAttribute('style');
      flags.appendChild(clone);
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
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
