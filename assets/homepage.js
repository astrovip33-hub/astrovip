(function(){'use strict';

    const hamb=document.getElementById('hamb'), menu=document.getElementById('menu');
    const toastEl=document.getElementById('toast');
    const toast=(message)=>{toastEl.textContent=message;toastEl.classList.add('show');clearTimeout(window.__astrovipToastTimer);window.__astrovipToastTimer=setTimeout(()=>toastEl.classList.remove('show'),2600)};
    function trackAstroVipEvent(name,params={}){
      if(typeof window.gtag!=='function')return;
      try{window.gtag('event',name,params)}catch(error){}
    }
    document.addEventListener('click',event=>{
      const link=event.target.closest&&event.target.closest('a[href]');
      if(!link)return;
      const rawHref=link.getAttribute('href')||'';
      const absoluteHref=link.href||rawHref;
      const label=(link.textContent||link.getAttribute('aria-label')||'').trim().slice(0,100);
      if(/wa\.me\/40722128220/i.test(absoluteHref)){
        trackAstroVipEvent('whatsapp_click',{link_text:label,link_url:absoluteHref,page_path:location.pathname});
      }
      if(/^tel:/i.test(rawHref)){
        trackAstroVipEvent('phone_click',{link_text:label,page_path:location.pathname});
      }
      if(/#programari/i.test(rawHref)){
        trackAstroVipEvent('booking_start',{link_text:label,page_path:location.pathname});
      }
      if(/buy\.stripe\.com/i.test(absoluteHref)){
        event.preventDefault();
        let navigated=false;
        const go=()=>{if(navigated)return;navigated=true;window.location.href=absoluteHref};
        trackAstroVipEvent('begin_checkout',{
          currency:'RON',value:500,
          items:[{item_id:'consultatie-premium-60',item_name:'Consultație premium 60 min',price:500,quantity:1}],
          page_path:location.pathname,
          event_callback:go,
          event_timeout:650
        });
        setTimeout(go,700);
      }
    },true);
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
    const revealEls=document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});revealEls.forEach(el=>io.observe(el));}else{revealEls.forEach(el=>el.classList.add('in'));}
    document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();const n=document.getElementById('name').value.trim(),p=document.getElementById('phone').value.trim(),s=document.getElementById('service').value,m=document.getElementById('message').value.trim();trackAstroVipEvent('generate_lead',{method:'contact_whatsapp',service:s,page_path:location.pathname});const text=`Bună ziua! Sunt ${n}. Telefon: ${p}. Doresc: ${s}.${m?` Mesaj: ${m}`:''}`;window.open('https://wa.me/40722128220?text='+encodeURIComponent(text),'_blank','noopener')});


    const articles={
      natal:{title:'Harta natală & casele astrologice',body:'Harta natală este fotografia simbolică a cerului la momentul nașterii. Interpretarea urmărește planetele, semnele, casele, axele și aspectele dintre ele pentru a înțelege predispoziții, resurse, tensiuni și domenii de viață care capătă o importanță specială.'},
      timing:{title:'Tranzite, arce solare & progresii',body:'În astrologia predictivă, întrebarea nu este doar ce se poate întâmpla, ci și când devine o temă activă. Arcele Solare, tranzitele și progresiile pot fi corelate pentru a identifica perioade în care aceeași decizie are un context mai favorabil sau mai solicitant. Scopul este pregătirea și alegerea mai informată.'},
      relocare:{title:'Astrocartografie & Local Space',body:'Relocarea astrologică compară modul în care aceeași hartă natală se exprimă în locații diferite. Harta relocată, astrocartografia și Local Space oferă perspective complementare asupra axelor, liniilor planetare și direcțiilor geografice.'},
      sinastrie:{title:'Sinastrie & compatibilitate',body:'Sinastria analizează interacțiunea dintre două hărți natale: comunicare, stabilitate, tensiune, nevoi emoționale și potențial de evoluție. Compatibilitatea nu este un scor unic, ci o structură complexă.'},
      numerologie:{title:'Numerologie aplicată',body:'Numerologia studiază simbolistica numerelor asociate datei de naștere, numelui și altor repere personale. Într-o analiză aplicată, aceste vibrații sunt folosite ca limbaj complementar pentru cicluri, identitate, alegerea numelui și semnificația unor numere recurente.'},
      studii:{title:'Studii de caz astrologice',body:'Studiile de caz compară evenimente reale cu indicatori astrologici concreți. Cronologia permite verificarea tranzitelor, arcelor solare, progresiilor și altor tehnici predictive, astfel încât interpretarea să poată fi analizată în raport cu fapte și momente precise.'}
    };
    const modal=document.getElementById('articleModal'), content=document.getElementById('articleContent');let articleTrigger=null;
    document.querySelectorAll('.article-open').forEach(b=>b.addEventListener('click',()=>{articleTrigger=b;const a=articles[b.dataset.article];content.innerHTML=`<h2>${a.title}</h2><p>${a.body}</p><p><strong>AstroVip:</strong> analiza completă este personalizată pe datele tale.</p>`;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');document.getElementById('articleClose').focus()}));
    const closeArticle=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');articleTrigger?.focus()};document.getElementById('articleClose').addEventListener('click',closeArticle);modal.addEventListener('click',e=>{if(e.target===modal)closeArticle()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeArticle()});

    const bookingApi='https://hhzsecdtqacyroxiywpm.supabase.co/rest/v1/booking_requests';
    const bookingKey='sb_publishable_Q_uY9n72m2bRQswqfF9esg_TFrK9qJ8';
    const d=document.getElementById('bookDate'),timeSelect=document.getElementById('bookTime'),availability=document.getElementById('bookingAvailability'),bookingForm=document.getElementById('bookingForm'),bookingSubmit=document.getElementById('bookingSubmit');
    const now=new Date(),pad=n=>String(n).padStart(2,'0');
    const localToday=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
    d.min=localToday;const maxDate=new Date(now);maxDate.setDate(maxDate.getDate()+60);d.max=`${maxDate.getFullYear()}-${pad(maxDate.getMonth()+1)}-${pad(maxDate.getDate())}`;
    const slotLabels={'10:00':'10:00–11:00','12:00':'12:00–13:00','14:00':'14:00–15:00','16:00':'16:00–17:00','18:00':'18:00–19:00'};
    const allSlots=Object.keys(slotLabels);
    async function refreshSlots(){
      const date=d.value;timeSelect.disabled=true;timeSelect.innerHTML='<option value="">Se verifică disponibilitatea…</option>';availability.textContent='Se verifică intervalele disponibile…';
      if(!date){timeSelect.innerHTML='<option value="">Alege mai întâi data</option>';availability.textContent='Selectează data pentru a vedea orele disponibile.';return}
      try{
        const response=await fetch(`${bookingApi}?select=booking_time&booking_date=eq.${encodeURIComponent(date)}`,{headers:{apikey:bookingKey},cache:'no-store'});
        if(!response.ok)throw new Error('availability unavailable');
        const rows=await response.json();
        const taken=new Set(rows.map(r=>String(r.booking_time||'').slice(0,5)));
        const isToday=date===localToday;
        const currentMinutes=now.getHours()*60+now.getMinutes();
        const open=allSlots.filter(slot=>{const parts=slot.split(':').map(Number),h=parts[0],m=parts[1];return !taken.has(slot)&&(!isToday||(h*60+m)>currentMinutes+60)});
        timeSelect.innerHTML='<option value="">Alege ora</option>'+open.map(slot=>`<option value="${slot}">${slotLabels[slot]}</option>`).join('');
        timeSelect.disabled=open.length===0;
        availability.textContent=open.length?`${open.length} intervale disponibile pentru data selectată.`:'Nu mai sunt intervale disponibile în această zi.';
      }catch(error){
        timeSelect.innerHTML='<option value="">Disponibilitatea nu poate fi încărcată</option>';availability.textContent='Încearcă din nou sau folosește WhatsApp.';toast('Calendarul nu a putut fi încărcat.');
      }
    }
    d.addEventListener('change',refreshSlots);
    bookingForm.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!bookingForm.reportValidity())return;
      const vals={name:document.getElementById('bookName').value.trim(),phone:document.getElementById('bookPhone').value.trim(),service:document.getElementById('bookService').value,booking_date:d.value,booking_time:timeSelect.value,mode:document.getElementById('bookMode').value,note:document.getElementById('bookNote').value.trim()||null};
      bookingSubmit.disabled=true;bookingSubmit.textContent='Se rezervă…';
      try{
        const response=await fetch(bookingApi,{method:'POST',headers:{apikey:bookingKey,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(vals)});
        if(response.status===409){await refreshSlots();toast('Intervalul tocmai a fost rezervat. Alege altă oră.');return}
        if(!response.ok)throw new Error('booking failed');
        const text=`Bună ziua! Am rezervat online un interval AstroVip. Nume: ${vals.name}. Telefon: ${vals.phone}. Serviciu: ${vals.service}. Data: ${vals.booking_date}. Ora: ${slotLabels[vals.booking_time]||vals.booking_time}. Format: ${vals.mode}.${vals.note?` Detalii: ${vals.note}`:''}`;
        trackAstroVipEvent('generate_lead',{method:'booking_form',service:vals.service,booking_mode:vals.mode,page_path:location.pathname});
        trackAstroVipEvent('booking_complete',{service:vals.service,booking_mode:vals.mode,page_path:location.pathname});
        toast('Programarea a fost înregistrată.');
        bookingForm.reset();timeSelect.disabled=true;timeSelect.innerHTML='<option value="">Alege mai întâi data</option>';availability.textContent='Programarea a fost înregistrată. Se deschide WhatsApp…';
        setTimeout(()=>{window.location.href='https://wa.me/40722128220?text='+encodeURIComponent(text)},450);
      }catch(error){
        toast('Programarea nu a putut fi salvată. Încearcă din nou.');
      }finally{
        bookingSubmit.disabled=false;bookingSubmit.textContent='Rezervă intervalul';
      }
    });

  
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'){closeMenuGroups();if(menu.classList.contains('open')){menu.classList.remove('open');hamb.setAttribute('aria-expanded','false');hamb.setAttribute('aria-label','Deschide meniul');hamb.textContent='☰';hamb.focus()}}
      if(event.key==='Tab'&&modal.classList.contains('open')){event.preventDefault();document.getElementById('articleClose').focus()}
    });
    document.addEventListener('click',event=>{if(menu.classList.contains('open')&&!menu.contains(event.target)&&!hamb.contains(event.target)){menu.classList.remove('open');hamb.setAttribute('aria-expanded','false');hamb.setAttribute('aria-label','Deschide meniul');hamb.textContent='☰'}});

})();


/* AstroVip professional-card de-duplication 2026-09-21 */
(function(){
  function dedupeProfessionalCards(){
    var shell=document.querySelector('.av-credentials-shell');
    if(!shell) return;
    var cards=Array.from(shell.children).filter(function(el){
      if(!el.matches || !el.matches('.av-credentials-card')) return false;
      var txt=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      var img=el.querySelector('img');
      var alt=img ? (img.getAttribute('alt')||'').toLowerCase() : '';
      return el.classList.contains('av-identity-image-card') ||
        txt.indexOf('date profesionale')!==-1 ||
        txt.indexOf('50191527')!==-1 ||
        txt.indexOf('ro08btrlroncrt0cs6331801')!==-1 ||
        alt.indexOf('50191527')!==-1 ||
        alt.indexOf('ro08btrlroncrt0cs6331801')!==-1;
    });
    if(cards.length>1){
      cards.slice(1).forEach(function(el){ el.remove(); });
    }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',dedupeProfessionalCards,{once:true});
  }else{
    dedupeProfessionalCards();
  }
  window.addEventListener('pageshow',dedupeProfessionalCards);
})();
