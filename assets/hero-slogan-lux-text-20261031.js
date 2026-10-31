(() => {
  'use strict';
  const apply = () => {
    const title = document.querySelector('#av-mobile-approved-home .avm-hero-copy h2.avm-hero-title');
    if (!title) return;
    title.setAttribute('aria-label', 'ANALIZA MEA – DECIZIILE TALE!');
    title.innerHTML = '<span>ANALIZA MEA</span><span>— DECIZIILE TALE!</span>';
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();
  setTimeout(apply, 250);
})();
