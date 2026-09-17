(function(){
  'use strict';
  const SIGNS=[['Berbec','♈'],['Taur','♉'],['Gemeni','♊'],['Rac','♋'],['Leu','♌'],['Fecioară','♍'],['Balanță','♎'],['Scorpion','♏'],['Săgetător','♐'],['Capricorn','♑'],['Vărsător','♒'],['Pești','♓']];
  const BODIES=[['Sun','Soare','☉'],['Moon','Lună','☽'],['Mercury','Mercur','☿'],['Venus','Venus','♀'],['Mars','Marte','♂'],['Jupiter','Jupiter','♃'],['Saturn','Saturn','♄'],['Uranus','Uranus','♅'],['Neptune','Neptun','♆'],['Pluto','Pluto','♇']];
  const norm=n=>((n%360)+360)%360;
  const longitude=(body,date)=>norm(Astronomy.Ecliptic(Astronomy.GeoVector(body,date,true)).elon);
  function planetItem([body,label,glyph],now,later){const lon=longitude(body,now),within=lon%30,degree=Math.floor(within),minute=Math.round((within-degree)*60),sign=SIGNS[Math.floor(lon/30)],delta=((longitude(body,later)-lon+540)%360)-180,retro=body!=='Sun'&&body!=='Moon'&&delta<-.0005;return `<span class="planet-item"><span class="planet-glyph">${glyph}</span><strong>${label}</strong><span>${degree}°${String(minute).padStart(2,'0')}′ ${sign[1]} ${sign[0]}</span>${retro?'<span class="planet-retro" title="Retrograd">℞</span>':''}</span>`}
  function renderTicker(){const host=document.querySelector('[data-planet-ticker]');if(!host)return;if(!window.Astronomy){host.textContent='Pozițiile planetare nu s-au putut încărca.';return}try{const now=new Date(),later=new Date(now.getTime()+86400000),items=BODIES.map(body=>planetItem(body,now,later)).join('');host.innerHTML=`<div class="planet-track">${items}${items}</div>`}catch(error){host.textContent='Pozițiile planetare nu s-au putut calcula.'}}
  const menu=document.getElementById('mainMenu'),toggle=document.getElementById('menuToggle');
  function closeMenu(){menu?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Deschide meniul')}
  toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Închide meniul':'Deschide meniul')});
  menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
  const date=document.getElementById('bookDate');if(date){const now=new Date(),pad=n=>String(n).padStart(2,'0');date.min=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`}
  const form=document.getElementById('bookingForm'),toast=document.getElementById('toast');
  function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(window.__avToast);window.__avToast=setTimeout(()=>toast.classList.remove('show'),2500)}
  form?.addEventListener('submit',event=>{event.preventDefault();const values={name:document.getElementById('bookName').value.trim(),phone:document.getElementById('bookPhone').value.trim(),service:document.getElementById('bookService').value,date:document.getElementById('bookDate').value,mode:document.getElementById('bookMode').value,note:document.getElementById('bookNote').value.trim()};const message=`Bună ziua! Doresc o programare AstroVip. Nume: ${values.name}. Telefon: ${values.phone}. Tema: ${values.service}. Data preferată: ${values.date}. Format: ${values.mode}.${values.note?` Detalii: ${values.note}`:''}`;const win=window.open(`https://wa.me/40722128220?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');if(!win)showToast('Browserul a blocat fereastra. Folosește butonul WhatsApp din dreapta jos.')});
  let attempts=0;const timer=setInterval(()=>{attempts++;if(window.Astronomy){clearInterval(timer);renderTicker()}else if(attempts>=30){clearInterval(timer);renderTicker()}},150);
})();
