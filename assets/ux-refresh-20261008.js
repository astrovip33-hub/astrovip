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

  const installPremiumMenuGroups = () => {
    if (!menu || menu.dataset.avAccordionReady === '1') return;
    menu.dataset.avAccordionReady = '1';

    const style = document.createElement('style');
    style.id = 'av-menu-accordion-chat-clean-20261009';
    style.textContent = `
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group{display:block!important;width:100%!important;margin:0!important;border:0!important;background:transparent!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group>summary,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-more>summary{position:relative!important;justify-content:space-between!important;gap:14px!important;cursor:pointer!important;list-style:none!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group>summary::-webkit-details-marker,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-more>summary::-webkit-details-marker{display:none!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group>summary::after,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-more>summary::after{content:'+'!important;display:grid!important;place-items:center!important;flex:0 0 28px!important;width:28px!important;height:28px!important;margin-left:auto!important;border:1px solid rgba(227,189,97,.36)!important;border-radius:8px!important;background:rgba(227,189,97,.06)!important;color:#e3bd61!important;font:800 20px/1 Arial,sans-serif!important;transform:none!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group[open]>summary::after,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-more[open]>summary::after{content:'−'!important;color:#39ff14!important;border-color:rgba(57,255,20,.34)!important;background:rgba(57,255,20,.05)!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links{display:grid!important;grid-template-columns:1fr!important;gap:2px!important;width:100%!important;margin:2px 0 7px!important;padding:7px 9px!important;border:1px solid rgba(227,189,97,.13)!important;border-radius:12px!important;background:#0d1610!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group:not([open]) .av-menu-group-links{display:none!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links a{display:flex!important;align-items:center!important;min-height:42px!important;padding:9px 10px!important;border-radius:9px!important;color:#d8dfda!important;font-size:14px!important;font-weight:600!important;line-height:1.35!important;text-decoration:none!important;white-space:normal!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links a:hover,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links a:focus-visible{background:#17241b!important;color:#f8f3e8!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links a:first-child{color:#e3bd61!important;font-weight:700!important}
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot,
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot:hover,
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot:focus{width:auto!important;min-width:0!important;max-width:none!important;min-height:44px!important;height:44px!important;padding:8px 7px!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;background-image:none!important;box-shadow:none!important;filter:none!important;transform:none!important;color:#f8f3e8!important}
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot::before,
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot::after{content:none!important;display:none!important;border:0!important;box-shadow:none!important}
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions .avchat-launcher.avchat-header-slot .avchat-launcher-label{color:#f8f3e8!important;font-size:12px!important;font-weight:800!important;letter-spacing:.06em!important}
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions .avchat-launcher.avchat-header-slot .avchat-launcher-dot{flex:0 0 8px!important;width:8px!important;height:8px!important;background:#39ff14!important;box-shadow:0 0 8px rgba(57,255,20,.72)!important}
      @media(max-width:820px){
        html body.av-ux-refresh header.top nav#menu.menu{padding:14px!important}
        html body.av-ux-refresh header.top nav#menu.menu .av-menu-group>summary,
        html body.av-ux-refresh header.top nav#menu.menu .av-menu-more>summary{min-height:48px!important;padding:10px 11px!important}
        html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot{min-height:40px!important;height:40px!important;padding:7px 5px!important}
        html body.av-ux-refresh:not(.guide-page) header.top .nav-actions .avchat-launcher.avchat-header-slot .avchat-launcher-label{font-size:11px!important}
      }
    `;
    document.head.appendChild(style);

    const groups = [
      {
        selector: 'a[href="#servicii"]',
        title: 'Servicii',
        links: [
          ['Toate serviciile', '#servicii'], ['Oferte și tarife', '#oferte'],
          ['Hartă natală', '/harta-natala/'], ['Previziuni & Timing', '/astrologie-predictiva/'],
          ['Dragoste & Sinastrie', '/sinastrie/'], ['Relocare & Local Space', '/astrocartografie-local-space/'],
          ['Numerologie', '/numerologie/']
        ]
      },
      {
        selector: 'a[href="/astrologie/"]',
        title: 'Astrologie',
        links: [
          ['Astrologie — ghid principal', '/astrologie/'], ['Arce Solare', '/arce-solare/'],
          ['Tranzite astrologice', '/tranzite-astrologice/'], ['Progresii secundare', '/progresii-secundare/'],
          ['Puncte Mijlocii', '/puncte-mijlocii/'], ['Astrologie Orară', '/astrologie-orara/']
        ]
      },
      {
        selector: 'a[href="/instrumente-astrologie/"]',
        title: 'Instrumente',
        links: [
          ['Toate instrumentele', '/instrumente-astrologie/'], ['Calculator Ascendent', '/calculator-ascendent/'],
          ['Pozițiile planetelor live', '/pozitii-planete-live/'], ['Efemeride astrologice', '/efemeride-astrologice/'],
          ['Harta mea', '/harta-mea/'], ['Calculator numerologie', '/calculator-numerologie/']
        ]
      },
      {
        selector: 'a[href="/studii-de-caz/"]',
        title: 'Studii de caz',
        links: [
          ['Toate studiile de caz', '/studii-de-caz/'],
          ['Dragoste — București 2001', '/studii-de-caz/intalnire-dragoste-arce-solare-2001/'],
          ['Relocare — Spania 2003', '/studii-de-caz/relocare-geografica-spania-2003/'],
          ['Job — București 2000', '/studii-de-caz/incepere-job-1-martie-2000/'],
          ['Loto — Roma 2020', '/studii-de-caz/castig-loto-roma-2020/']
        ]
      },
      {
        selector: 'a[href="/despre-astrovip/"]',
        title: 'Despre mine',
        links: [
          ['Despre AstroVip', '/despre-astrovip/'], ['Certificare astrolog', '/studii-de-caz/diploma-astrologie-2014/'],
          ['Recenzii', '/recenzii/'], ['Presă', '/presa/']
        ]
      }
    ];

    const detailsNodes = [];
    groups.forEach(group => {
      const anchor = [...menu.children].find(el => el.matches?.(group.selector));
      if (!anchor) return;
      const details = document.createElement('details');
      details.className = 'av-menu-group';
      const summary = document.createElement('summary');
      summary.textContent = group.title;
      const links = document.createElement('div');
      links.className = 'av-menu-group-links';
      group.links.forEach(([label, href]) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        links.appendChild(a);
      });
      details.append(summary, links);
      anchor.replaceWith(details);
      detailsNodes.push(details);
    });

    const existingMore = menu.querySelector('.av-menu-more');
    if (existingMore) detailsNodes.push(existingMore);
    detailsNodes.forEach(details => {
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        detailsNodes.forEach(other => { if (other !== details) other.open = false; });
      });
    });
  };

  installPremiumMenuGroups();

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
