(() => {
  'use strict';
  const id = 'av-language-cards-lux-20261026';
  if (document.getElementById(id)) return;
  const style = document.createElement('link');
  style.id = id;
  style.rel = 'stylesheet';
  style.href = '/assets/language-cards-lux-20261026.css?v=1';
  document.head.appendChild(style);
  const languages = {
    ro: ['Română', 'RO', 'flag-ro.svg', '216,185,105'],
    en: ['English', 'EN', 'flag-us.svg', '117,158,214'],
    es: ['Español', 'ES', 'flag-es.svg', '217,175,79'],
    it: ['Italiano', 'IT', 'flag-it.svg', '103,178,135'],
    zh: ['中文', 'ZH', 'flag-cn.svg', '205,112,98'],
    ar: ['العربية', 'AR', 'flag-sa.svg', '103,180,147'],
    ru: ['Русский', 'RU', 'flag-ru.svg', '145,155,205']
  };
  const decorate = () => {
    document.querySelectorAll('#av-footer-languages,.av-language-picker .av-lang-switch').forEach(nav => {
      nav.classList.add('av-language-cards');
      nav.querySelectorAll(':scope > a').forEach(link => {
        if (link.dataset.avLanguageCard) return;
        const key = (link.lang || 'ro').split('-')[0];
        const spec = languages[key];
        if (!spec) return;
        const [name, code, flag, accent] = spec;
        const badge = document.createElement('span');
        badge.className = 'av-language-card-flag';
        badge.setAttribute('aria-hidden', 'true');
        const image = document.createElement('img');
        image.src = `/assets/${flag}`;
        image.alt = '';
        image.width = 30;
        image.height = 22;
        badge.appendChild(image);
        const label = document.createElement('span');
        label.className = 'av-language-card-name';
        label.textContent = name;
        label.dir = key === 'ar' ? 'rtl' : 'auto';
        const short = document.createElement('span');
        short.className = 'av-language-card-code';
        short.textContent = code;
        short.setAttribute('aria-hidden', 'true');
        link.replaceChildren(badge, label, short);
        link.style.setProperty('--av-language-accent', accent);
        link.dataset.avLanguageCard = key;
        if (key === document.documentElement.lang.split('-')[0]) link.setAttribute('aria-current', 'page');
      });
    });
  };
  const boot = () => {
    decorate();
    // The existing mobile header script creates footer language links after load.
    new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 &&
        (node.matches?.('#av-footer-languages,.av-language-cards,.av-language-picker') ||
         node.querySelector?.('#av-footer-languages,.av-language-picker'))))) decorate();
    }).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
