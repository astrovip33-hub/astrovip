(() => {
  'use strict';
  const menu = document.getElementById('menu');
  const toggle = document.getElementById('hamb');
  const close = menu?.querySelector('.av-pro-menu-close');
  const backdrop = document.querySelector('.av-pro-backdrop');
  const picker = document.querySelector('.av-language-picker');
  const language = document.documentElement.lang.split('-')[0];
  const labels = {
    ro: ['Deschide meniul', 'Închide meniul'], en: ['Open menu', 'Close menu'],
    es: ['Abrir menú', 'Cerrar menú'], it: ['Apri menu', 'Chiudi menu'],
    zh: ['打开菜单', '关闭菜单'], ar: ['افتح القائمة', 'أغلق القائمة'], ru: ['Открыть меню', 'Закрыть меню']
  }[language] || ['Open menu', 'Close menu'];
  if (menu && toggle && backdrop) {
    const setOpen = (open, restoreFocus = false) => {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', labels[open ? 1 : 0]);
      toggle.dataset.iconState = open ? 'open' : 'closed';
      document.body.classList.toggle('av-menu-open', open);
      backdrop.hidden = !open;
      menu.inert = !open;
      if (open) { if (picker) picker.open = false; close?.focus(); }
      else if (restoreFocus) toggle.focus();
    };
    setOpen(false);
    toggle.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(!menu.classList.contains('open'));
    }, true);
    close?.addEventListener('click', () => setOpen(false, true));
    backdrop.addEventListener('click', () => setOpen(false, true));
    document.addEventListener('click', event => {
      if (event.target.closest?.('#menu a[href]')) setOpen(false);
    }, true);
    document.addEventListener('keydown', event => {
      if (!menu.classList.contains('open')) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); setOpen(false, true); }
      if (event.key === 'Tab') {
        const controls = [...menu.querySelectorAll('a,button,summary')].filter(el => el.getClientRects().length);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }, true);
    picker?.addEventListener('toggle', () => { if (picker.open) setOpen(false); });
    new MutationObserver(() => {
      if (!menu.classList.contains('open') && !backdrop.hidden) setOpen(false);
    }).observe(menu, {attributes: true, attributeFilter: ['class']});
  }
  document.addEventListener('click', event => {
    if (picker?.open && !picker.contains(event.target)) picker.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && picker?.open) { picker.open = false; picker.querySelector('summary')?.focus(); }
  });
  // Keep the selected step available to assistive technology.
  document.querySelectorAll('[data-checkout-panel]').forEach(panel => {
    const update = () => {
      const current = document.querySelector('[data-step-indicator].is-active');
      document.querySelectorAll('[data-step-indicator]').forEach(step => {
        if (step === current) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
    };
    new MutationObserver(update).observe(panel, {attributes: true, attributeFilter: ['class']});
    update();
  });
})();
