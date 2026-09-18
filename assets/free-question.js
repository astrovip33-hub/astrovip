
(function(){
  const root=document.getElementById('freeqChat');
  if(!root)return;
  const state={topic:'',question:'',context:'',name:'',birthDate:'',birthTime:'',birthPlace:'',targetPlace:'',source:'direct'};
  const params=new URLSearchParams(location.search);
  state.source=params.get('utm_source')||params.get('source')||'direct';
  const chat=document.getElementById('freeqMessages');
  const controls=document.getElementById('freeqControls');
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function msg(text,who='bot'){const d=document.createElement('div');d.className='freeq-msg '+who;d.innerHTML=esc(text).replace(/\n/g,'<br>');chat.appendChild(d);d.scrollIntoView({behavior:'smooth',block:'end'});}
  function clear(){controls.innerHTML='';}
  function event(name){try{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:name,free_question_topic:state.topic,utm_source:state.source});}catch(e){}}
  function choices(items,cb){clear();const box=document.createElement('div');box.className='freeq-options';items.forEach(x=>{const b=document.createElement('button');b.type='button';b.className='freeq-choice';b.textContent=x.label;b.onclick=()=>{msg(x.label,'user');cb(x.value,x.label)};box.appendChild(b)});controls.appendChild(box);}
  function field(opts,cb){clear();const box=document.createElement('div');box.className='freeq-inputbox';const lab=document.createElement('label');lab.textContent=opts.label;const el=document.createElement(opts.textarea?'textarea':'input');if(!opts.textarea)el.type=opts.type||'text';el.placeholder=opts.placeholder||'';el.maxLength=opts.max||200;if(opts.autocomplete)el.autocomplete=opts.autocomplete;if(opts.required!==false)el.required=true;const b=document.createElement('button');b.type='button';b.className='freeq-action';b.textContent=opts.button||'Continuă';b.onclick=()=>{const v=el.value.trim();if(opts.required!==false&&!v){el.focus();return}msg(v||'Prefer să nu precizez','user');cb(v)};el.addEventListener('keydown',e=>{if(e.key==='Enter'&&!opts.textarea){e.preventDefault();b.click()}});box.append(lab,el,b);controls.appendChild(box);setTimeout(()=>el.focus(),100);}
  function start(){state.topic='';chat.innerHTML='';clear();msg('Bun venit la AstroVip. Ai o mini-consultație gratuită pentru o singură întrebare. Alege domeniul:');choices([{label:'Carieră',value:'Carieră'},{label:'Dragoste',value:'Dragoste'},{label:'Relocare',value:'Relocare'}],(v)=>{state.topic=v;event('astro_free_question_start');askQuestion()});}
  function askQuestion(){msg('Scrie o singură întrebare, cât mai clară. Răspunsul gratuit este scurt și orientativ.');field({label:'Întrebarea ta',placeholder:state.topic==='Carieră'?'Ex.: Este o perioadă potrivită pentru schimbarea jobului?':state.topic==='Dragoste'?'Ex.: Ce temă importantă se activează acum în viața mea sentimentală?':'Ex.: Ce ar trebui să analizez înainte de o relocare în Spania?',textarea:true,max:500},v=>{state.question=v;askContext()});}
  function askContext(){let ph='Context opțional';if(state.topic==='Carieră')ph='Ex.: domeniul actual, schimbarea avută în vedere';if(state.topic==='Dragoste')ph='Ex.: relație existentă / persoană nouă';if(state.topic==='Relocare')ph='Ex.: orașul actual și locul avut în vedere';field({label:'Context scurt (opțional)',placeholder:ph,textarea:true,max:350,required:false,button:'Continuă'},v=>{state.context=v;askName()});}
  function askName(){msg('Pentru a putea identifica solicitarea, am nevoie de numele tău.');field({label:'Nume',placeholder:'Numele tău',max:100,autocomplete:'name'},v=>{state.name=v;askBirthDate()});}
  function askBirthDate(){msg('Pentru interpretarea astrologică sunt utile datele de naștere.');field({label:'Data nașterii',type:'date',max:20},v=>{state.birthDate=v;askBirthTime()});}
  function askBirthTime(){field({label:'Ora nașterii (opțional)',type:'time',required:false,button:'Continuă'},v=>{state.birthTime=v;askBirthPlace()});}
  function askBirthPlace(){field({label:'Localitatea nașterii',placeholder:'Ex.: București, România',max:140},v=>{state.birthPlace=v;if(state.topic==='Relocare')askTarget();else review()});}
  function askTarget(){field({label:'Localitatea / țara avută în vedere',placeholder:'Ex.: Santander, Spania',max:140,required:false,button:'Continuă'},v=>{state.targetPlace=v;review()});}
  function buildText(){
    return [
      'ASTROVIP — 1 ÎNTREBARE GRATUITĂ',
      'Domeniu: '+state.topic,
      'Întrebare: '+state.question,
      state.context?'Context: '+state.context:'',
      'Nume: '+state.name,
      'Data nașterii: '+state.birthDate,
      'Ora nașterii: '+(state.birthTime||'necunoscută'),
      'Loc naștere: '+state.birthPlace,
      state.targetPlace?'Relocare vizată: '+state.targetPlace:'',
      'Sursă: '+state.source
    ].filter(Boolean).join('\n');
  }
  function review(){clear();msg('Perfect. Verifică rezumatul și apoi alege cum trimiți întrebarea.');msg(buildText(),'user');
    const box=document.createElement('div');box.className='freeq-inputbox';
    const consent=document.createElement('label');consent.className='freeq-consent';consent.innerHTML='<input id="fqConsent" type="checkbox"> <span>Sunt de acord ca datele introduse să fie folosite pentru a răspunde acestei solicitări. La trimitere se deschide WhatsApp sau aplicația de email; datele nu sunt salvate de acest chat. <a href="/politica-confidentialitate/" target="_blank" rel="noopener">Politica de confidențialitate</a>.</span>';
    const sends=document.createElement('div');sends.className='freeq-send-grid';
    const wa=document.createElement('a');wa.className='freeq-action';wa.href='#';wa.textContent='Trimite pe WhatsApp';
    const em=document.createElement('a');em.className='freeq-action secondary';em.href='#';em.textContent='Trimite prin email';
    function ok(){const c=document.getElementById('fqConsent');if(!c.checked){c.focus();alert('Bifează acordul privind datele înainte de trimitere.');return false}return true}
    wa.onclick=e=>{e.preventDefault();if(!ok())return;event('astro_free_question_submit_whatsapp');window.open('https://wa.me/40722128220?text='+encodeURIComponent(buildText()),'_blank','noopener')};
    em.onclick=e=>{e.preventDefault();if(!ok())return;event('astro_free_question_submit_email');location.href='mailto:astrovip33@gmail.com?subject='+encodeURIComponent('AstroVip — 1 întrebare gratuită — '+state.topic)+'&body='+encodeURIComponent(buildText())};
    sends.append(wa,em);
    const restart=document.createElement('button');restart.type='button';restart.className='freeq-action secondary';restart.textContent='Reîncepe conversația';restart.onclick=start;
    box.append(consent,sends,restart);controls.appendChild(box);
  }
  start();
})();
