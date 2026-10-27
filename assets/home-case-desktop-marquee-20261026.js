(() => {
  'use strict';

  const STYLE_ID = 'av-case-desktop-marquee-style-20261026';
  const MARQUEE_CLASS = 'av-case-desktop-marquee-v9';

  const ensureStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes avCaseDesktopMarqueeV9 {
        from { transform: translate3d(0,0,0); }
        to { transform: translate3d(-50%,0,0); }
      }
      #studii-de-caz-home .${MARQUEE_CLASS}{display:none}
      @media(min-width:821px){
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid{display:none!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-mobile-nav-v7{display:none!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .${MARQUEE_CLASS}{display:block!important;width:100%!important;max-width:none!important;overflow:hidden!important;padding:10px 0 24px!important;box-sizing:border-box!important;mask-image:linear-gradient(90deg,transparent 0,#000 4%,#000 96%,transparent 100%);-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 4%,#000 96%,transparent 100%)}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-desktop-marquee-track-v9{display:flex!important;align-items:stretch!important;width:max-content!important;max-width:none!important;will-change:transform!important;animation:avCaseDesktopMarqueeV9 112s linear infinite!important;transform:translate3d(0,0,0)}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-desktop-marquee-group-v9{display:flex!important;align-items:stretch!important;flex:0 0 auto!important;gap:24px!important;padding-left:24px!important;box-sizing:border-box!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .${MARQUEE_CLASS} .av-case-showcase-card{display:flex!important;flex-direction:column!important;align-self:stretch!important;flex:0 0 min(62vw,680px)!important;width:min(62vw,680px)!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:0!important;margin:0!important;border-radius:22px!important;scroll-snap-align:none!important;scroll-snap-stop:normal!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .${MARQUEE_CLASS} .av-case-showcase-visual{flex:0 0 300px!important;width:100%!important;height:300px!important;min-height:0!important;max-height:300px!important;aspect-ratio:auto!important;overflow:hidden!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .${MARQUEE_CLASS} .av-case-showcase-visual>a,
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .${MARQUEE_CLASS} .av-case-showcase-visual img{display:block!important;width:100%!important;height:100%!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .${MARQUEE_CLASS} .av-case-showcase-visual img{object-fit:cover!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .${MARQUEE_CLASS} .av-case-showcase-copy{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;padding:22px 26px!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .${MARQUEE_CLASS} .av-case-showcase-cta{margin-top:auto!important}
      }
      @media(max-width:820px){
        #studii-de-caz-home .${MARQUEE_CLASS}{display:none!important}
      }
      @media(min-width:821px) and (prefers-reduced-motion:reduce){
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .${MARQUEE_CLASS}{display:none!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid{display:flex!important}
        html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-mobile-nav-v7{display:grid!important}
      }
    `;
    document.head.appendChild(style);
  };

  const neutralizeDuplicate = (node) => {
    node.setAttribute('aria-hidden', 'true');
    node.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
  };

  const install = () => {
    const section = document.getElementById('studii-de-caz-home');
    if (!section) return false;
    const source = section.querySelector('.av-case-showcase-grid');
    const frame = section.querySelector('.av-case-showcase-frame');
    if (!source || !frame) return false;

    ensureStyle();

    let marquee = frame.querySelector(`:scope > .${MARQUEE_CLASS}`);
    if (!marquee) {
      marquee = document.createElement('div');
      marquee.className = MARQUEE_CLASS;
      marquee.setAttribute('aria-label', 'Studii de caz AstroVip — derulare continuă');
      marquee.innerHTML = '<div class="av-case-desktop-marquee-track-v9"></div>';
      source.insertAdjacentElement('afterend', marquee);
    }

    const track = marquee.querySelector('.av-case-desktop-marquee-track-v9');
    let lastSignature = '';

    const rebuild = () => {
      const cards = [...source.querySelectorAll(':scope > .av-case-showcase-card')];
      if (!cards.length) return;
      const signature = cards.map(card => card.outerHTML).join('');
      if (signature === lastSignature && track.children.length === 2) return;
      lastSignature = signature;
      track.replaceChildren();
      for (let copy = 0; copy < 2; copy += 1) {
        const group = document.createElement('div');
        group.className = 'av-case-desktop-marquee-group-v9';
        if (copy === 1) group.setAttribute('aria-hidden', 'true');
        cards.forEach(card => {
          const clone = card.cloneNode(true);
          clone.querySelectorAll('img').forEach(img => {
            img.loading = 'eager';
            img.setAttribute('fetchpriority', 'low');
          });
          clone.removeAttribute('id');
          clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
          if (copy === 1) neutralizeDuplicate(clone);
          group.appendChild(clone);
        });
        track.appendChild(group);
      }
    };

    rebuild();
    if (!source.dataset.avDesktopMarqueeObserved) {
      source.dataset.avDesktopMarqueeObserved = '1';
      new MutationObserver(rebuild).observe(source, { childList: true, subtree: true, attributes: true,
        attributeFilter: ['src', 'srcset', 'sizes', 'alt', 'width', 'height'] });
      section.addEventListener('astrovip:cases-expanded', rebuild);
    }
    return true;
  };

  const boot = () => {
    if (install()) return;
    const observer = new MutationObserver(() => {
      if (install()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 15000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();