(() => {
  'use strict';

  const install = () => {
    const section = document.getElementById('studii-de-caz-home');
    if (!section) return;

    if (!document.getElementById('av-case-midpoint-geometry-20261102-v2')) {
      const style = document.createElement('style');
      style.id = 'av-case-midpoint-geometry-20261102-v2';
      style.textContent = `
        /* 2026-11-02: case studies now use the exact midpoint-slider footprint. */
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-frame{
          width:min(760px,100%)!important;
          margin-left:auto!important;
          margin-right:auto!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid{
          display:flex!important;
          gap:0!important;
          padding:0!important;
          overflow-x:auto!important;
          overflow-y:hidden!important;
          scroll-snap-type:x mandatory!important;
          scrollbar-width:none!important;
          border-radius:18px!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid::-webkit-scrollbar{display:none!important}
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{
          display:grid!important;
          grid-template-columns:190px minmax(0,1fr)!important;
          grid-template-rows:300px!important;
          align-items:stretch!important;
          flex:0 0 100%!important;
          width:100%!important;
          min-width:100%!important;
          height:300px!important;
          min-height:300px!important;
          max-height:300px!important;
          scroll-snap-align:start!important;
          border-radius:18px!important;
          overflow:hidden!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual,
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-interventie-2016 .av-case-showcase-visual,
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-clasa-1-1984 .av-case-showcase-visual{
          grid-column:1!important;
          grid-row:1!important;
          flex:0 0 190px!important;
          width:190px!important;
          height:300px!important;
          min-height:300px!important;
          max-height:300px!important;
          margin:0!important;
          aspect-ratio:auto!important;
          overflow:hidden!important;
          background:#030a13!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual>a,
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual img,
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-interventie-2016 .av-case-showcase-visual>a,
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-interventie-2016 .av-case-showcase-visual img,
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-clasa-1-1984 .av-case-showcase-visual>a,
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-clasa-1-1984 .av-case-showcase-visual img{
          display:block!important;
          width:100%!important;
          height:300px!important;
          min-height:300px!important;
          max-height:300px!important;
          aspect-ratio:auto!important;
          object-fit:cover!important;
          object-position:center 48%!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy{
          grid-column:2!important;
          grid-row:1!important;
          display:flex!important;
          flex-direction:column!important;
          justify-content:center!important;
          min-width:0!important;
          height:300px!important;
          box-sizing:border-box!important;
          padding:22px 24px!important;
          overflow:hidden!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy h3{
          margin:0!important;
          font-size:clamp(27px,4.5vw,42px)!important;
          line-height:.98!important;
          letter-spacing:-.03em!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-eyebrow{
          margin:0 0 7px!important;
          font-size:10px!important;
          line-height:1.2!important;
          letter-spacing:.15em!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-meta{
          margin:7px 0 0!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-lead{
          display:-webkit-box!important;
          -webkit-box-orient:vertical!important;
          -webkit-line-clamp:3!important;
          overflow:hidden!important;
          margin:11px 0 13px!important;
          font-size:13px!important;
          line-height:1.5!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-cta{
          width:max-content!important;
          min-height:38px!important;
          margin-top:0!important;
          padding:8px 13px!important;
          border-radius:999px!important;
          font-size:11px!important;
          line-height:1!important;
        }

        @media(max-width:820px){
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home{height:auto!important;min-height:0!important;max-height:none!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home>.wrap{height:auto!important;min-height:0!important;max-height:none!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-frame{
            display:block!important;
            width:min(100%,430px)!important;
            height:auto!important;
            min-height:0!important;
            max-height:none!important;
            overflow:visible!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid{
            gap:0!important;
            height:230px!important;
            min-height:230px!important;
            max-height:230px!important;
            padding:0!important;
            border-radius:18px!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{
            grid-template-columns:36% 64%!important;
            grid-template-rows:230px!important;
            flex:0 0 100%!important;
            width:100%!important;
            min-width:100%!important;
            height:230px!important;
            min-height:230px!important;
            max-height:230px!important;
            border-radius:18px!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-interventie-2016 .av-case-showcase-visual,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-clasa-1-1984 .av-case-showcase-visual{
            grid-column:1!important;
            grid-row:1!important;
            flex:none!important;
            width:100%!important;
            height:230px!important;
            min-height:230px!important;
            max-height:230px!important;
            margin:0!important;
            aspect-ratio:auto!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual>a,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual img,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-interventie-2016 .av-case-showcase-visual>a,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-interventie-2016 .av-case-showcase-visual img,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-clasa-1-1984 .av-case-showcase-visual>a,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-clasa-1-1984 .av-case-showcase-visual img{
            height:230px!important;
            min-height:230px!important;
            max-height:230px!important;
            aspect-ratio:auto!important;
            object-fit:cover!important;
            object-position:center 47%!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy{
            height:230px!important;
            padding:13px 12px 13px 13px!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-eyebrow{
            margin:0 0 5px!important;
            font-size:8px!important;
            line-height:1.15!important;
            letter-spacing:.08em!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy h3{
            font-size:clamp(22px,7vw,29px)!important;
            line-height:.98!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-meta{
            margin:5px 0!important;
            font-size:8.5px!important;
            line-height:1.2!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-lead{
            -webkit-line-clamp:3!important;
            margin:7px 0 9px!important;
            font-size:11px!important;
            line-height:1.42!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-cta{
            min-height:34px!important;
            padding:7px 10px!important;
            font-size:9px!important;
          }
        }

        @media(max-width:390px){
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid{
            height:215px!important;
            min-height:215px!important;
            max-height:215px!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{
            grid-template-columns:37% 63%!important;
            grid-template-rows:215px!important;
            height:215px!important;
            min-height:215px!important;
            max-height:215px!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-interventie-2016 .av-case-showcase-visual,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-clasa-1-1984 .av-case-showcase-visual,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual>a,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual img,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-interventie-2016 .av-case-showcase-visual>a,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-interventie-2016 .av-case-showcase-visual img,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-clasa-1-1984 .av-case-showcase-visual>a,
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home #studiu-clasa-1-1984 .av-case-showcase-visual img{
            height:215px!important;
            min-height:215px!important;
            max-height:215px!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy{
            height:215px!important;
            padding:12px 10px!important;
          }
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy h3{font-size:clamp(20px,6.5vw,26px)!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-lead{font-size:10.5px!important}
        }

        @media(max-width:360px){
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{grid-template-columns:38% 62%!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-copy h3{font-size:21px!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-lead{line-height:1.42!important}
          html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-cta{padding-left:9px!important;padding-right:9px!important}
        }
      `;
      document.head.appendChild(style);
    }

    const forceMidpointGeometry = () => {
      if (window.innerWidth > 820) return;
      const compactHeight = window.innerWidth <= 390 ? 215 : 230;
      const wrap = section.querySelector(':scope > .wrap');
      const frame = section.querySelector('.av-case-showcase-frame');
      const track = section.querySelector('.av-case-showcase-grid');
      if (!frame || !track) return;

      [section, wrap, frame].filter(Boolean).forEach((node) => {
        node.style.setProperty('height', 'auto', 'important');
        node.style.setProperty('min-height', '0', 'important');
        node.style.setProperty('max-height', 'none', 'important');
      });
      frame.style.setProperty('display', 'block', 'important');
      frame.style.setProperty('width', 'min(100%, 430px)', 'important');
      frame.style.setProperty('margin-left', 'auto', 'important');
      frame.style.setProperty('margin-right', 'auto', 'important');
      frame.style.setProperty('overflow', 'visible', 'important');
      track.style.setProperty('display', 'flex', 'important');
      track.style.setProperty('gap', '0', 'important');
      track.style.setProperty('padding', '0', 'important');
      track.style.setProperty('height', `${compactHeight}px`, 'important');
      track.style.setProperty('min-height', `${compactHeight}px`, 'important');
      track.style.setProperty('max-height', `${compactHeight}px`, 'important');
      track.style.setProperty('align-items', 'stretch', 'important');
      track.style.setProperty('overflow-x', 'auto', 'important');
      track.style.setProperty('overflow-y', 'hidden', 'important');
      track.style.setProperty('scroll-snap-type', 'x mandatory', 'important');

      const cards = [...track.querySelectorAll('.av-case-showcase-card')];
      cards.forEach((card) => {
        card.style.setProperty('flex', '0 0 100%', 'important');
        card.style.setProperty('width', '100%', 'important');
        card.style.setProperty('min-width', '100%', 'important');
      });

      const allStudies = frame.querySelector(':scope > div[style*="text-align:center"]');
      if (allStudies) allStudies.style.setProperty('margin-top', '12px', 'important');
    };

    forceMidpointGeometry();
    requestAnimationFrame(forceMidpointGeometry);
    [80, 250, 700, 1400].forEach((delay) => setTimeout(forceMidpointGeometry, delay));
    if (!window.__avCaseMidpointResizeBound) {
      window.__avCaseMidpointResizeBound = true;
      window.addEventListener('resize', forceMidpointGeometry, {passive:true});
    }

    if (!window.__avCaseMidpointControlFix) {
      window.__avCaseMidpointControlFix = true;
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

        const step = Math.max(1, track.clientWidth);
        const targetLeft = Math.max(0, index * step);

        track.style.setProperty('scroll-behavior', 'auto', 'important');
        const lockPosition = () => {
          track.scrollTo({left: targetLeft, behavior: 'auto'});
          track.scrollLeft = targetLeft;
        };
        lockPosition();

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

        requestAnimationFrame(lockPosition);
        setTimeout(lockPosition, 80);
        setTimeout(lockPosition, 240);
      }, true);
    }

    // The shared responsive slider owns its track on every viewport.
    if (section.querySelector('.av-case-showcase-grid')) return;
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();