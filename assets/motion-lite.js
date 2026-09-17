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
      @media (max-width: 560px) {
        body:not(.guide-page) .trust-refs {
          padding: 12px 0 14px !important;
        }
        body:not(.guide-page) .trust-icons-only {
          display: grid !important;
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          align-items: stretch !important;
          justify-content: center !important;
          gap: 6px !important;
          width: 100% !important;
        }
        body:not(.guide-page) .trust-icon-only,
        body:not(.guide-page) .trust-icon-only:first-child,
        body:not(.guide-page) .trust-icon-only:last-child,
        body:not(.guide-page) .trust-commerce-card {
          order: initial !important;
          grid-column: auto !important;
          grid-row: auto !important;
          width: 100% !important;
          min-width: 0 !important;
          height: 112px !important;
          min-height: 112px !important;
          padding: 8px !important;
          border-radius: 10px !important;
          align-self: stretch !important;
          position: static !important;
          top: auto !important;
          transform: none !important;
        }
        body:not(.guide-page) .trust-icon-only {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        body:not(.guide-page) .trust-icon-only:first-child img {
          max-width: 92% !important;
          max-height: 76px !important;
        }
        body:not(.guide-page) .trust-icon-only:last-child img {
          max-width: 98% !important;
          max-height: 68px !important;
        }
        body:not(.guide-page) .trust-commerce-card {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 4px !important;
          text-align: center !important;
          padding: 8px 5px !important;
        }
        body:not(.guide-page) .trust-commerce-kicker {
          font-size: 8.5px !important;
          line-height: 1.1 !important;
          letter-spacing: .025em !important;
          white-space: normal !important;
        }
        body:not(.guide-page) .trust-commerce-card strong {
          font-size: 14px !important;
          line-height: 1.1 !important;
          white-space: nowrap !important;
        }
        body:not(.guide-page) .trust-commerce-points {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 4px !important;
          width: 100% !important;
          margin: 0 !important;
        }
        body:not(.guide-page) .trust-commerce-points span {
          font-size: 9px !important;
          line-height: 1.1 !important;
          padding: 3px 4px !important;
          white-space: nowrap !important;
          width: 100% !important;
        }
      }
      @media (max-width: 370px) {
        body:not(.guide-page) .trust-icons-only {
          gap: 5px !important;
        }
        body:not(.guide-page) .trust-icon-only,
        body:not(.guide-page) .trust-icon-only:first-child,
        body:not(.guide-page) .trust-icon-only:last-child,
        body:not(.guide-page) .trust-commerce-card {
          height: 106px !important;
          min-height: 106px !important;
          padding: 6px !important;
        }
        body:not(.guide-page) .trust-icon-only:first-child img {
          max-height: 70px !important;
        }
        body:not(.guide-page) .trust-icon-only:last-child img {
          max-height: 62px !important;
        }
        body:not(.guide-page) .trust-commerce-kicker {
          font-size: 7.5px !important;
        }
        body:not(.guide-page) .trust-commerce-card strong {
          font-size: 12.5px !important;
        }
        body:not(.guide-page) .trust-commerce-points span {
          font-size: 8.2px !important;
          padding: 3px 2px !important;
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
