(() => {
  'use strict';
  if (!document.body.classList.contains('av-ux-home')) return;
  const flagStyle = document.createElement('style');
  flagStyle.id = 'astrovip-ux-full-flags-20261007';
  flagStyle.textContent = 'html body.av-ux-home.av-ux-home.av-ux-home .av-lang-switch>a{width:44px!important;min-width:44px!important;max-width:44px!important;height:44px!important;min-height:44px!important;max-height:44px!important;padding:5px!important}html body.av-ux-home.av-ux-home.av-ux-home .av-lang-switch>a img{display:block!important;width:36px!important;height:26px!important;min-width:36px!important;max-width:36px!important;min-height:26px!important;max-height:26px!important;border-radius:5px!important;object-fit:cover!important}';
  document.head.appendChild(flagStyle);
  const locale = document.documentElement.lang.split('-')[0];
  const labels = {
    ro:['Deschide meniul','Închide meniul','Sari la conținut'],
    en:['Open menu','Close menu','Skip to content'],
    es:['Abrir menú','Cerrar menú','Saltar al contenido'],
    it:['Apri menu','Chiudi menu','Vai al contenuto'],
    zh:['打开菜单','关闭菜单','跳到主要内容'],
    ar:['فتح القائمة','إغلاق القائمة','انتقل إلى المحتوى'],
    ru:['Открыть меню','Закрыть меню','Перейти к содержимому']
  }[locale] || ['Open menu','Close menu','Skip to content'];
  const header = document.querySelector('header.top');
  const menu = document.getElementById('menu');
  const toggle = document.getElementById('hamb');
  const compact = matchMedia('(max-width:1459px)');
  const background = [document.querySelector('main'),document.querySelector('footer')].filter(Boolean);
  function setMenu(open, restoreFocus=false) {
    if (!menu || !toggle) return;
    menu.classList.toggle('open',open);
    menu.inert = compact.matches && !open;
    document.body.classList.toggle('av-menu-open',open && compact.matches);
    background.forEach(el => { el.inert = compact.matches && open; });
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',labels[open ? 1 : 0]);
    toggle.dataset.iconState = open ? 'open' : 'closed';
    if (!open) {
      menu.querySelectorAll('details[open]').forEach(el => el.open=false);
      menu.querySelectorAll('.av-menu-group.is-open').forEach(el => {
        el.classList.remove('is-open');
        el.querySelector('.av-menu-trigger')?.setAttribute('aria-expanded','false');
      });
      if (restoreFocus) toggle.focus({preventScroll:true});
    }
  }
  if (menu && toggle) {
    // Own the existing control without allowing older handlers to toggle it a second time.
    toggle.addEventListener('click',event => {
      event.preventDefault(); event.stopImmediatePropagation();
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
      if (open && event.detail === 0) menu.querySelector('a,summary,button')?.focus();
    },true);
    menu.addEventListener('click',event => {
      if (event.target.closest('a[href]')) setMenu(false);
    },true);
    document.addEventListener('click',event => {
      if (menu.classList.contains('open') && !header.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown',event => {
      if (!menu.classList.contains('open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();event.stopImmediatePropagation();setMenu(false,true);
      } else if (event.key === 'Tab' && compact.matches) {
        const items = [...header.querySelectorAll('a[href],button,summary')].filter(el => !el.closest('[inert]') && el.getClientRects().length && !el.disabled);
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
        else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
      }
    },true);
    compact.addEventListener('change',() => setMenu(false));
    setMenu(false);
  }
  const main = document.querySelector('main');
  if (main && !document.querySelector('.skip-link')) {
    main.id ||= 'main-content';main.tabIndex = -1;
    const skip = document.createElement('a');
    skip.className='skip-link';skip.href='#'+main.id;skip.textContent=labels[2];
    document.body.prepend(skip);
  }
  document.querySelectorAll('.av-lang-switch a[lang]').forEach(link => link.hreflang=link.lang);
  document.querySelectorAll('.av-offer [data-offer-contact]').forEach(link => {
    link.addEventListener('click',() => {
      const card = link.closest('.av-offer');
      const summary = document.getElementById('av-selected-offer');
      if (!summary) return;
      summary.textContent = 'Analiza aleasă: '+card.querySelector('h3').textContent.trim()+' · '+card.querySelector('.av-offer-price').textContent.trim()+'. Contactează AstroVip pentru detalii și disponibilitate.';
      summary.hidden=false;
    });
  });
  // Reflect the calendar's existing active panel for assistive technology; no booking writes.
  const form = document.getElementById('bookingForm');
  if (form) {
    const panels = [...form.querySelectorAll('[data-checkout-panel]')];
    function updateSteps() {
      const active = panels.find(panel => panel.classList.contains('is-active'));
      panels.forEach(panel => panel.inert = panel !== active);
      document.querySelectorAll('[data-step-indicator]').forEach(indicator => {
        if (indicator.dataset.stepIndicator === active?.dataset.checkoutPanel) indicator.setAttribute('aria-current','step');
        else indicator.removeAttribute('aria-current');
      });
    }
    const observer = new MutationObserver(() => {
      updateSteps();
      if (form.contains(document.activeElement)) {
        const active = panels.find(panel => panel.classList.contains('is-active'));
        active?.querySelector('input:not([hidden]),select:not([hidden]),button')?.focus({preventScroll:true});
      }
    });
    panels.forEach(panel => observer.observe(panel,{attributes:true,attributeFilter:['class']}));
    updateSteps();
  }
})();
