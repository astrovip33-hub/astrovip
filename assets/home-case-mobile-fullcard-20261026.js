(() => {
  'use strict';

  const STYLE_ID = 'av-case-mobile-fullcard-style-20261026';

  const ensureStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @media(max-width:820px){
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-frame{
          overflow:hidden!important;
          padding-left:10px!important;
          padding-right:10px!important;
          box-sizing:border-box!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid{
          display:flex!important;
          grid-template-columns:none!important;
          align-items:stretch!important;
          gap:10px!important;
          width:100%!important;
          max-width:100%!important;
          margin:0!important;
          padding:4px 0 8px!important;
          box-sizing:border-box!important;
          overflow-x:auto!important;
          overflow-y:hidden!important;
          scroll-snap-type:x mandatory!important;
          scroll-padding-inline:0!important;
          scrollbar-width:none!important;
          overscroll-behavior-inline:contain!important;
          touch-action:pan-x pan-y!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid::-webkit-scrollbar{
          display:none!important;
        }
        html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{
          flex:0 0 100%!important;
          width:100%!important;
          min-width:100%!important;
          max-width:100%!important;
          margin:0!important;
          box-sizing:border-box!important;
          scroll-snap-align:start!important;
          scroll-snap-stop:always!important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const normalizeFirstCard = () => {
    if (!window.matchMedia('(max-width:820px)').matches) return false;
    const track = document.querySelector('#studii-de-caz-home .av-case-showcase-grid');
    if (!track) return false;
    ensureStyle();
    if (!track.dataset.avMobileFullCardReady) {
      track.dataset.avMobileFullCardReady = '1';
      requestAnimationFrame(() => {
        if (track.scrollLeft < 40) track.scrollTo({ left: 0, behavior: 'auto' });
      });
    }
    return true;
  };

  const boot = () => {
    ensureStyle();
    if (normalizeFirstCard()) return;
    const observer = new MutationObserver(() => {
      if (normalizeFirstCard()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 15000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
