/* Preserve the existing menu and chat handlers; support keyboard use in every language. */
(()=>{const menu=document.getElementById('menu'),button=document.getElementById('hamb');if(!menu||!button)return;
 const close=()=>{menu.classList.remove('open');button.setAttribute('aria-expanded','false');button.textContent='☰';menu.querySelectorAll('.is-open').forEach(e=>e.classList.remove('is-open'));menu.querySelectorAll('[aria-expanded=true]').forEach(e=>e.setAttribute('aria-expanded','false'))};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){close();button.focus()}});
 document.addEventListener('click',e=>{if(menu.classList.contains('open')&&!menu.contains(e.target)&&!button.contains(e.target))close()});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 const labels={ro:'AstroVip Chat',en:'AstroVip Chat',es:'AstroVip Chat',it:'AstroVip Chat',zh:'在线咨询',ar:'المحادثة',ru:'Чат AstroVip'};
 const setLabel=()=>document.querySelectorAll('.top .avchat-launcher-label').forEach(e=>{e.textContent=matchMedia('(max-width:820px)').matches?(document.documentElement.lang==='zh'?'咨询':document.documentElement.lang==='ar'?'محادثة':'Chat'):(labels[document.documentElement.lang]||'AstroVip Chat')});
 setLabel();window.addEventListener('resize',setLabel,{passive:true});
})();
