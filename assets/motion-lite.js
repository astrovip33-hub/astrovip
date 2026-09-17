/* No image replacement, hidden content or continuous render loops. */
(function () {
  'use strict';
  if (document.documentElement.dataset.avMotionLoaded) return;
  document.documentElement.dataset.avMotionLoaded = '1';

  function ensureMobileTrustLayout() {
    if (document.getElementById('av-mobile-trust-layout')) return;
    const style = document.createElement('style');
    style.id = 'av-mobile-trust-layout';
    style.textContent = `
      @media (max-width: 820px) {
        body:not(.guide-page) .trust-icons-only {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          align-items: stretch !important;
          justify-content: center !important;
          gap: 8px !important;
        }

        body:not(.guide-page) .trust-icons-only > :first-child {
          grid-column: 1 / -1 !important;
          grid-row: 1 !important;
          justify-self: stretch !important;
          order: 1 !important;
          width: 100% !important;
          max-width: none !important;
          height: 118px !important;
          min-height: 118px !important;
          aspect-ratio: auto !important;
          padding: 10px 18px !important;
          border-radius: 10px !important;
        }

        body:not(.guide-page) .trust-icons-only > :first-child img {
          width: 100% !important;
          height: 100% !important;
          max-width: 92% !important;
          max-height: 92% !important;
          object-fit: contain !important;
          margin: auto !important;
        }

        body:not(.guide-page) .trust-icons-only > :nth-child(2),
        body:not(.guide-page) .trust-icons-only > :nth-child(3) {
          grid-row: 2 !important;
          grid-column: auto !important;
          order: 2 !important;
          width: 100% !important;
          max-width: none !important;
          height: auto !important;
          min-height: 0 !important;
          aspect-ratio: 1 / 1 !important;
          align-self: stretch !important;
          border-radius: 9px !important;
        }

        body:not(.guide-page) .trust-icons-only > :nth-child(2) {
          grid-column: 1 !important;
        }

        body:not(.guide-page) .trust-icons-only > :nth-child(3) {
          grid-column: 2 !important;
        }
      }

      @media (max-width: 390px) {
        body:not(.guide-page) .trust-icons-only > :first-child {
          height: 108px !important;
          min-height: 108px !important;
          padding: 8px 14px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    document.body.classList.add('av-motion-live');
    ensureMobileTrustLayout();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine) and (min-width: 981px)').matches) return;
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--av-mx', `${100 * (event.clientX - box.left) / box.width}%`);
        card.style.setProperty('--av-my', `${100 * (event.clientY - box.top) / box.height}%`);
      }, {passive: true});
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true}); else init();
})();
