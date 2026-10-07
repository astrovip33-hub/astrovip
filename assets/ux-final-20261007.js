/* ASTROVIP UX FINAL 20261007-ux5 */
(()=>{
  'use strict';
  const labels={ro:['Deschide meniul','Închide meniul'],en:['Open menu','Close menu'],es:['Abrir menú','Cerrar menú'],it:['Apri menu','Chiudi menu'],zh:['打开菜单','关闭菜单'],ar:['افتح القائمة','أغلق القائمة'],ru:['Открыть меню','Закрыть меню']};
  function init(){
    const lang=(document.documentElement.lang||'ro').split('-')[0];
    const [openLabel,closeLabel]=labels[lang]||labels.ro;
    const header=document.querySelector('header.top'),menu=document.getElementById('menu'),hamb=document.getElementById('hamb');
    const css=document.getElementById('astrovip-ux-final-css');
    // The visual editor adds its stylesheet during DOMContentLoaded. Place final layout last once.
    if(css)document.head.appendChild(css);
    if(header){const size=()=>document.documentElement.style.setProperty('--avux-header-height',Math.ceil(header.getBoundingClientRect().height)+'px');size();if('ResizeObserver'in window)new ResizeObserver(size).observe(header)}
    if(!menu||!hamb)return;
    const background=[document.querySelector('main'),document.querySelector('footer')].filter(Boolean);
    let wasOpen=false;
    const focusable=()=>[...menu.querySelectorAll('a[href],button,summary'),hamb].filter(el=>el.getClientRects().length&&!el.disabled);
    const sync=()=>{
      const open=menu.classList.contains('open');
      hamb.setAttribute('aria-expanded',String(open));hamb.setAttribute('aria-label',open?closeLabel:openLabel);hamb.dataset.iconState=open?'open':'closed';
      document.body.classList.toggle('av-menu-open',open);
      background.forEach(el=>{el.inert=open});
      if(open&&!wasOpen){const first=focusable()[0];requestAnimationFrame(()=>first?.focus({preventScroll:true}))}
      wasOpen=open;
    };
    const close=(restore=false)=>{menu.classList.remove('open');menu.querySelectorAll('details[open]').forEach(el=>el.open=false);sync();if(restore)hamb.focus({preventScroll:true})};
    new MutationObserver(sync).observe(menu,{attributes:true,attributeFilter:['class']});
    hamb.addEventListener('click',()=>queueMicrotask(sync));
    menu.addEventListener('click',e=>{if(e.target.closest('a[href]'))close()});
    document.addEventListener('click',e=>{if(menu.classList.contains('open')&&!menu.contains(e.target)&&!hamb.contains(e.target))close()});
    document.addEventListener('keydown',e=>{
      if(!menu.classList.contains('open'))return;
      if(e.key==='Escape'){e.preventDefault();close(true);return}
      if(e.key==='Tab'){
        const items=focusable(),first=items[0],last=items[items.length-1];
        if(e.shiftKey&&(document.activeElement===first||!items.includes(document.activeElement))){e.preventDefault();last?.focus()}
        else if(!e.shiftKey&&(document.activeElement===last||!items.includes(document.activeElement))){e.preventDefault();first?.focus()}
      }
    });
    addEventListener('resize',()=>{if(innerWidth>1450)close()});
    sync();
    const booking=document.getElementById('bookingForm');
    if(booking){
      const panels=[...booking.querySelectorAll('[data-checkout-panel]')];
      const focusStep=()=>{const active=panels.find(el=>el.classList.contains('is-active'));if(!active)return;const target=active.querySelector('input:not([hidden]),select:not([hidden]),button');if(target)requestAnimationFrame(()=>target.focus({preventScroll:true}));document.querySelectorAll('[data-step-indicator]').forEach(el=>el.classList.contains('is-active')?el.setAttribute('aria-current','step'):el.removeAttribute('aria-current'))};
      panels.forEach(el=>new MutationObserver(focusStep).observe(el,{attributes:true,attributeFilter:['class']}));
      document.querySelector('[data-step-indicator="1"]')?.setAttribute('aria-current','step');
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
