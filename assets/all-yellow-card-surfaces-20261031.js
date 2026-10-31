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

  const start = () => {
    apply();
    requestAnimationFrame(apply);
    setTimeout(apply, 350);
    setTimeout(apply, 1200);

    const observer = new MutationObserver(() => requestAnimationFrame(apply));
    observer.observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style']});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
