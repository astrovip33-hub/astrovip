(function(){
  'use strict';
  function load(src){
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    document.head.appendChild(s);
  }
  load('/assets/planetary-ticker-core.js?v=20260916');
  load('/assets/home-opportunities.js?v=20260916');
})();