(() => {
  'use strict';

  const install = () => {
    const section = document.getElementById('studii-de-caz-home');
    if (!section) return;

    if (!document.getElementById('av-case-compact-midpoint-size-20261102')) {
      const style = document.createElement('style');
      style.id = 'av-case-compact-midpoint-size-20261102';
      style.textContent = `
        /* 2026-11-02: align case-study card footprint with the compact midpoint series. */
        @media(min-width:821px){
          html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-frame{--av-desktop-case-width:min(56vw,620px)!important}
          html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{display:grid!important;grid-template-columns:190px minmax(0,1fr)!important;grid-template-rows:300px!important;align-items:stretch!important;height:300px!important;min-height:300px!important;max-height:300px!important;border-radius:18px!important;overflow:hidden!important}
          html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual{grid-column:1!important;grid-row:1!important;flex:0 0 190px!important;width:190px!important;height:300px!important;min-height:300px!important;max-height:300px!important;margin:0!important}
          html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy{grid-column:2!important;grid-row:1!important;min-width:0!important;height:300px!important;box-sizing:border-box!important;padding:20px 22px!important;overflow:hidden!important}
          html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy h3{font-size:clamp(23px,2.3vw,30px)!important;line-height:1.04!important}
          html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-lead{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;overflow:hidden!important}
          html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-cta{min-height:36px!important;padding:8px 12px!important;font-size:10px!important}
        }
        @media(max-width:820px){
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid{gap:10px!important;padding:4px 8% 8px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{display:grid!important;grid-template-columns:37% minmax(0,1fr)!important;grid-template-rows:230px!important;align-items:stretch!important;flex:0 0 88%!important;width:88%!important;min-width:88%!important;height:230px!important;min-height:230px!important;max-height:230px!important;border-radius:16px!important;overflow:hidden!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual{grid-column:1!important;grid-row:1!important;flex:none!important;width:100%!important;height:230px!important;min-height:230px!important;max-height:230px!important;margin:0!important;aspect-ratio:auto!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy{grid-column:2!important;grid-row:1!important;min-width:0!important;height:230px!important;box-sizing:border-box!important;padding:12px 10px 11px!important;overflow:hidden!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-eyebrow{margin:0 0 5px!important;font-size:8px!important;line-height:1.15!important;letter-spacing:.08em!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy h3{margin:0!important;font-size:clamp(15px,4.4vw,18px)!important;line-height:1.04!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-meta{margin:5px 0!important;font-size:8.5px!important;line-height:1.2!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-lead{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:4!important;overflow:hidden!important;margin:5px 0 7px!important;font-size:9.5px!important;line-height:1.3!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-cta{min-height:31px!important;margin-top:auto!important;padding:6px 8px!important;border-radius:999px!important;font-size:8px!important;line-height:1.1!important;letter-spacing:.025em!important}
        }
        @media(max-width:390px){
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{grid-template-columns:37% minmax(0,1fr)!important;grid-template-rows:215px!important;height:215px!important;min-height:215px!important;max-height:215px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual{height:215px!important;min-height:215px!important;max-height:215px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy{height:215px!important;padding:11px 9px 10px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy h3{font-size:15px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-lead{-webkit-line-clamp:3!important;font-size:9px!important}
        }
        @media(max-width:360px){
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{grid-template-columns:38% minmax(0,1fr)!important;grid-template-rows:210px!important;height:210px!important;min-height:210px!important;max-height:210px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual{height:210px!important;min-height:210px!important;max-height:210px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy{height:210px!important;padding:10px 8px 9px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy h3{font-size:14px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-meta{font-size:8px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-lead{font-size:8.6px!important;line-height:1.25!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-cta{min-height:29px!important;padding:5px 7px!important;font-size:7.5px!important}
        }
      `;
      document.head.appendChild(style);
    }

    if (!window.__avCaseCompactControlFix) {
      window.__avCaseCompactControlFix = true;
      document.addEventListener('click', (event) => {
        const control = event.target.closest('#studii-de-caz-home [data-case-next], #studii-de-caz-home [data-case-prev], #studii-de-caz-home .av-case-dot-v7');
        if (!control) return;

        const liveSection = document.getElementById('studii-de-caz-home');
        const track = liveSection?.querySelector('.av-case-showcase-grid');
        const cards = track ? [...track.querySelectorAll('.av-case-showcase-card')] : [];
        if (!track || cards.length < 2) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        const count = liveSection.querySelector('[data-case-count]');
        const currentFromCount = Math.max(0, (parseInt(count?.textContent || '1', 10) || 1) - 1);
        const dots = [...liveSection.querySelectorAll('.av-case-dot-v7')];
        let index = currentFromCount;
        if (control.matches('[data-case-next]')) index += 1;
        else if (control.matches('[data-case-prev]')) index -= 1;
        else index = dots.indexOf(control);
        index = Math.max(0, Math.min(cards.length - 1, index));

        const firstRect = cards[0].getBoundingClientRect();
        const secondRect = cards[1].getBoundingClientRect();
        const step = Math.max(1, Math.abs(secondRect.left - firstRect.left));
        const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        const targetLeft = pad + index * step;

        track.style.setProperty('scroll-snap-type', 'none', 'important');
        track.scrollTo({left: targetLeft, behavior: 'auto'});
        track.scrollLeft = targetLeft;

        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === index);
          if (i === index) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
        if (count) count.textContent = `${index + 1} / ${cards.length}`;
        const prev = liveSection.querySelector('[data-case-prev]');
        const next = liveSection.querySelector('[data-case-next]');
        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index === cards.length - 1;

        requestAnimationFrame(() => { track.scrollLeft = targetLeft; });
        setTimeout(() => {
          track.scrollLeft = targetLeft;
          track.style.setProperty('scroll-snap-type', 'x mandatory', 'important');
        }, 160);
      }, true);
    }

    // The shared responsive slider owns its track on every viewport.
    // Keep its navigation and the complete case list after DOMContentLoaded.
    if (section.querySelector('.av-case-showcase-grid')) return;
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();