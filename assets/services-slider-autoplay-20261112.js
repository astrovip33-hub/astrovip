(()=>{'use strict';
const root=document.getElementById('av-services-slider');if(!root)return;
const track=root.querySelector('.sv-track');if(!track||track.dataset.autoplayReady)return;
const originals=[...track.querySelectorAll(':scope > .sv-card')];if(originals.length!==14)return;
track.dataset.autoplayReady='true';
// Reviews: 21 cards at 225px + 10px gap over 95s = ~52px per second.
const speed=21*(225+10)/95;
originals.forEach(card=>{const clone=card.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('a,button,input,summary,[tabindex]').forEach(el=>el.setAttribute('tabindex','-1'));track.append(clone)});
let paused=false,last=0,frame=0,manualUntil=0;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const pause=()=>{paused=true},resume=()=>{paused=false};
root.addEventListener('mouseenter',pause);root.addEventListener('mouseleave',resume);
root.addEventListener('focusin',pause);root.addEventListener('focusout',()=>{if(!root.contains(document.activeElement))resume()});
root.addEventListener('pointerdown',()=>{manualUntil=performance.now()+4500},{passive:true});
root.querySelectorAll('[data-sv-prev],[data-sv-next]').forEach(btn=>btn.addEventListener('click',()=>{manualUntil=performance.now()+4500}));
function cycleWidth(){return originals[0]?.offsetLeft+originals.length*(originals[0]?.getBoundingClientRect().width||244)+(originals.length-1)*(parseFloat(getComputedStyle(track).columnGap)||12)-originals[0]?.offsetLeft+(parseFloat(getComputedStyle(track).columnGap)||12)}
function tick(now){if(!last)last=now;const dt=Math.min(80,now-last);last=now;
if(!paused&&!reduced.matches&&!document.hidden&&now>manualUntil){const span=track.children[originals.length].offsetLeft-originals[0].offsetLeft;if(span>0){let next=track.scrollLeft+speed*dt/1000;if(next>=span)next-=span;track.scrollLeft=next}}
frame=requestAnimationFrame(tick)}
frame=requestAnimationFrame(tick);
})();
