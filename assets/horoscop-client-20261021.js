import {positionsAt, BODIES, positionLabel, bucharestDay} from './horoscop-core-20261021.mjs';
function render(){
  if(!globalThis.Astronomy) return;
  const now=new Date(), day=bucharestDay(now);
  // Refresh the server-rendered daily text after a date rollover in an open tab.
  const dateNode=document.querySelector('[data-today]');
  if(dateNode && dateNode.getAttribute('datetime')!==day){location.reload();return;}
  const box=document.querySelector('[data-live-sky]');
  if(box){const pos=positionsAt(globalThis.Astronomy,now);box.replaceChildren(...BODIES.map(([body,label,symbol])=>{const el=document.createElement('div');el.className='planet';const name=document.createElement('b');name.textContent=symbol+' '+label;el.append(name,document.createTextNode(positionLabel(pos[body])));return el;}));}
}
window.addEventListener('load',()=>{render();setInterval(render,60000)});
