(function(){'use strict';

    const hamb=document.getElementById('hamb'), menu=document.getElementById('menu');
    const toastEl=document.getElementById('toast');
    const toast=(message)=>{toastEl.textContent=message;toastEl.classList.add('show');clearTimeout(window.__astrovipToastTimer);window.__astrovipToastTimer=setTimeout(()=>toastEl.classList.remove('show'),2600)};
    const visitorCountEl=document.getElementById('visitorCount');
    (async()=>{
      if(!visitorCountEl)return;
      try{
        const key='sb_publishable_Q_uY9n72m2bRQswqfF9esg_TFrK9qJ8';
        const response=await fetch('https://hhzsecdtqacyroxiywpm.supabase.co/rest/v1/rpc/register_site_visit',{
          method:'POST',
          headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},
          body:'{}',
          cache:'no-store'
        });
        if(!response.ok)throw new Error('counter unavailable');
        const value=Number(await response.json());
        if(!Number.isFinite(value))throw new Error('invalid counter');
        visitorCountEl.textContent=new Intl.NumberFormat('ro-RO').format(value);
      }catch(error){
        visitorCountEl.textContent='—';
        visitorCountEl.closest('.visitor-counter')?.classList.add('offline');
      }
    })();
    hamb.addEventListener('click',()=>{const open=menu.classList.toggle('open');hamb.setAttribute('aria-expanded',open);hamb.textContent=open?'✕':'☰';hamb.setAttribute('aria-label',open?'Închide meniul':'Deschide meniul')});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');hamb.setAttribute('aria-expanded','false');hamb.textContent='☰';hamb.setAttribute('aria-label','Deschide meniul')}));
    const revealEls=document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});revealEls.forEach(el=>io.observe(el));}else{revealEls.forEach(el=>el.classList.add('in'));}
    document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();const n=document.getElementById('name').value.trim(),p=document.getElementById('phone').value.trim(),s=document.getElementById('service').value,m=document.getElementById('message').value.trim();const text=`Bună ziua! Sunt ${n}. Telefon: ${p}. Doresc: ${s}.${m?` Mesaj: ${m}`:''}`;window.open('https://wa.me/40722128220?text='+encodeURIComponent(text),'_blank','noopener')});


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

    const d=document.getElementById('bookDate'),now=new Date(),pad=n=>String(n).padStart(2,'0');d.min=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
    document.getElementById('bookingForm').addEventListener('submit',e=>{e.preventDefault();const vals={n:document.getElementById('bookName').value.trim(),p:document.getElementById('bookPhone').value.trim(),s:document.getElementById('bookService').value,d:document.getElementById('bookDate').value,t:document.getElementById('bookTime').value,m:document.getElementById('bookMode').value,note:document.getElementById('bookNote').value.trim()};const text=`Bună ziua! Doresc o programare AstroVip. Nume: ${vals.n}. Telefon: ${vals.p}. Serviciu: ${vals.s}. Data preferată: ${vals.d}. Interval: ${vals.t}. Format: ${vals.m}.${vals.note?` Detalii: ${vals.note}`:''}`;window.open('https://wa.me/40722128220?text='+encodeURIComponent(text),'_blank','noopener')});

  
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&menu.classList.contains('open')){menu.classList.remove('open');hamb.setAttribute('aria-expanded','false');hamb.setAttribute('aria-label','Deschide meniul');hamb.textContent='☰';hamb.focus()}
      if(event.key==='Tab'&&modal.classList.contains('open')){event.preventDefault();document.getElementById('articleClose').focus()}
    });
    document.addEventListener('click',event=>{if(menu.classList.contains('open')&&!menu.contains(event.target)&&!hamb.contains(event.target)){menu.classList.remove('open');hamb.setAttribute('aria-expanded','false');hamb.setAttribute('aria-label','Deschide meniul');hamb.textContent='☰'}});

})();
