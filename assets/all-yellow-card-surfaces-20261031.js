/* AstroVip — apply the approved gold→cyan gradient to every yellow/gold surface inside homepage cards down to the footer. */
(() => {
  'use strict';

  const CARD_HINT = /(card|cta|tile|panel|offer|service|interest|booking|payment|paybar|actions|feature|benefit|case|review|testimonial|consult|price|premium)/i;
  const ROOT_SELECTORS = ['#av-mobile-approved-home', 'main', '#astrovip-footer'];

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h *= 60;
    }
    return [h, s * 100, l * 100];
  };

  const isGoldRgb = (r, g, b, a = 1) => {
    if (a <= 0.05) return false;
    const [h, s, l] = rgbToHsl(r, g, b);
    return h >= 32 && h <= 66 && s >= 28 && l >= 28 && l <= 92;
  };

  const extractRgb = value => {
    const out = [];
    const re = /rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})(?:\s*[,\/]\s*([\d.]+))?\s*\)/gi;
    let m;
    while ((m = re.exec(value || ''))) out.push([+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]]);
    return out;
  };

  const hasCardContext = (el, root) => {
    let node = el;
    while (node && node !== root.parentElement) {
      const key = `${node.id || ''} ${typeof node.className === 'string' ? node.className : ''}`;
      if (CARD_HINT.test(key)) return true;
      if (node === root) break;
      node = node.parentElement;
    }
    return false;
  };

  const isYellowSurface = style => {
    const bg = extractRgb(style.backgroundColor);
    if (bg.some(c => isGoldRgb(...c))) return true;

    if (style.backgroundImage && style.backgroundImage !== 'none') {
      const stops = extractRgb(style.backgroundImage);
      if (stops.length && stops.every(c => isGoldRgb(...c))) return true;
    }
    return false;
  };

  const apply = () => {
    ROOT_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(root => {
        [root, ...root.querySelectorAll('*')].forEach(el => {
          if (!(el instanceof HTMLElement)) return;
          if (!hasCardContext(el, root)) return;
          if (el.classList.contains('av-all-yellow-card-gradient')) return;
          const style = getComputedStyle(el);
          if (!isYellowSurface(style)) return;
          el.classList.add('av-all-yellow-card-gradient');
        });
      });
    });
  };

  /* The premium mobile menu is rendered as accordion <details> rows.
     Contact is created independently from any legacy #contact anchor so it is
     guaranteed to appear in the visible accordion, before “Mai multe”. */
  const installContactMenuGroup = () => {
    const menu = document.getElementById('menu');
    if (!menu || menu.querySelector('.av-menu-contact-group')) return;

    const detailsRows = [...menu.children].filter(el => el.tagName === 'DETAILS');
    if (!detailsRows.length) return;

    const details = document.createElement('details');
    details.className = 'av-menu-group av-menu-contact-group';

    const summary = document.createElement('summary');
    summary.textContent = 'Contact';
    summary.setAttribute('aria-label', 'Contact AstroVip');

    const links = document.createElement('div');
    links.className = 'av-menu-group-links';

    [
      ['Telefon · 0722 128 220', 'tel:+40722128220'],
      ['WhatsApp · mesaj direct', 'https://wa.me/40722128220'],
      ['Email · contact@astrovip.ro', 'mailto:contact@astrovip.ro'],
      ['Adresă · Bulevardul Unirii 33', 'https://www.google.com/maps?cid=15612666586801751925']
    ].forEach(([label, href]) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      if (/^https?:/i.test(href)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      links.appendChild(a);
    });

    const hours = document.createElement('span');
    hours.className = 'av-menu-contact-hours';
    hours.textContent = 'Program · Luni–Vineri · 10:00–17:00';
    links.appendChild(hours);

    details.append(summary, links);

    const legacyContact = menu.querySelector('a[href="#contact"]');
    if (legacyContact) legacyContact.remove();

    const more = detailsRows.find(el => {
      const s = el.querySelector(':scope > summary');
      return /^\s*Mai multe\s*$/i.test((s?.textContent || '').trim());
    }) || [...menu.children].find(el => /\bMai multe\b/i.test((el.textContent || '').trim()));

    menu.insertBefore(details, more || null);

    details.addEventListener('toggle', () => {
      if (!details.open) return;
      [...menu.children].forEach(node => {
        if (node !== details && node.tagName === 'DETAILS' && node.open) node.open = false;
      });
    });

    if (!document.getElementById('av-menu-contact-hours-css')) {
      const style = document.createElement('style');
      style.id = 'av-menu-contact-hours-css';
      style.textContent = `
        #menu .av-menu-contact-group{display:block!important;visibility:visible!important;opacity:1!important}
        #menu .av-menu-contact-hours{
          display:block;
          padding:10px 14px 12px;
          color:#26384a;
          font:800 12px/1.35 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;
          opacity:.82;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const runEnhancements = () => {
    apply();
    installContactMenuGroup();
  };

  const start = () => {
    runEnhancements();
    requestAnimationFrame(runEnhancements);
    setTimeout(runEnhancements, 150);
    setTimeout(runEnhancements, 500);
    setTimeout(runEnhancements, 1200);
    setTimeout(runEnhancements, 2500);

    const observer = new MutationObserver(() => requestAnimationFrame(runEnhancements));
    observer.observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'open']});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
