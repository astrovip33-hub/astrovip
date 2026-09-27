(()=>{'use strict';
const hamb=document.getElementById('hamb'),menu=document.getElementById('menu');
if(!hamb||!menu)return;
const menuGroups=[...menu.querySelectorAll('.av-menu-group')];
const closeMenuGroups=()=>menuGroups.forEach(group=>{group.classList.remove('is-open');group.querySelector('.av-menu-trigger')?.setAttribute('aria-expanded','false')});
hamb.addEventListener('click',()=>{const open=menu.classList.toggle('open');hamb.setAttribute('aria-expanded',open);hamb.textContent=open?'✕':'☰';hamb.setAttribute('aria-label',open?'Închide meniul':'Deschide meniul');if(!open)closeMenuGroups()});
menu.querySelectorAll('.av-menu-trigger').forEach(trigger=>trigger.addEventListener('click',event=>{
  event.preventDefault();
  const group=trigger.closest('.av-menu-group');
  const willOpen=!group.classList.contains('is-open');
  menuGroups.forEach(item=>{if(item!==group){item.classList.remove('is-open');item.querySelector('.av-menu-trigger')?.setAttribute('aria-expanded','false')}});
  group.classList.toggle('is-open',willOpen);
  trigger.setAttribute('aria-expanded',String(willOpen));
}));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');closeMenuGroups();hamb.setAttribute('aria-expanded','false');hamb.textContent='☰';hamb.setAttribute('aria-label','Deschide meniul')}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenuGroups();if(menu.classList.contains('open')){menu.classList.remove('open');hamb.setAttribute('aria-expanded','false');hamb.setAttribute('aria-label','Deschide meniul');hamb.textContent='☰';hamb.focus()}}});
document.addEventListener('click',event=>{if(menu.classList.contains('open')&&!menu.contains(event.target)&&!hamb.contains(event.target)){menu.classList.remove('open');hamb.setAttribute('aria-expanded','false');hamb.setAttribute('aria-label','Deschide meniul');hamb.textContent='☰'}});
})();