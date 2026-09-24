
(function(){
  const root=document.getElementById('freeqChat');
  if(!root)return;

  const SUPABASE_URL='https://hhzsecdtqacyroxiywpm.supabase.co';
  const SUPABASE_KEY='sb_publishable_Q_uY9n72m2bRQswqfF9esg_TFrK9qJ8';

  const state={
    topic:'',question:'',context:'',name:'',birthDate:'',birthTime:'',birthPlace:'',
    targetPlace:'',contactChannel:'',contactValue:'',source:'direct',medium:'',campaign:'',
    referrer:document.referrer||'',marketingConsent:false,savedLeadId:''
  };

  const params=new URLSearchParams(location.search);
  state.source=params.get('utm_source')||params.get('source')||'direct';
  state.medium=params.get('utm_medium')||'';
  state.campaign=params.get('utm_campaign')||'';

  const chat=document.getElementById('freeqMessages');
  const controls=document.getElementById('freeqControls');
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  function msg(text,who='bot'){
    const d=document.createElement('div');
    d.className='freeq-msg '+who;
    d.innerHTML=esc(text).replace(/\n/g,'<br>');
    chat.appendChild(d);
    d.scrollIntoView({behavior:'smooth',block:'end'});
  }

  function clear(){controls.innerHTML='';}

  function event(name){
    try{
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:name,free_question_topic:state.topic,utm_source:state.source});
    }catch(e){}
  }

  function choices(items,cb){
    clear();
    const box=document.createElement('div');
    box.className='freeq-options';
    items.forEach(x=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='freeq-choice';
      b.textContent=x.label;
      b.onclick=()=>{msg(x.label,'user');cb(x.value,x.label)};
      box.appendChild(b);
    });
    controls.appendChild(box);
  }

  function field(opts,cb){
    clear();
    const box=document.createElement('div');
    box.className='freeq-inputbox';
    const lab=document.createElement('label');
    lab.textContent=opts.label;
    const el=document.createElement(opts.textarea?'textarea':'input');
    if(!opts.textarea)el.type=opts.type||'text';
    el.placeholder=opts.placeholder||'';
    el.maxLength=opts.max||200;
    if(opts.autocomplete)el.autocomplete=opts.autocomplete;
    if(opts.inputmode)el.inputMode=opts.inputmode;
    if(opts.required!==false)el.required=true;
    const b=document.createElement('button');
    b.type='button';
    b.className='freeq-action';
    b.textContent=opts.button||'Continuă';
    b.onclick=()=>{
      const v=el.value.trim();
      if(opts.required!==false&&!v){el.focus();return}
      if(opts.validate&&!opts.validate(v)){el.focus();return}
      msg(v||'Prefer să nu precizez','user');
      cb(v);
    };
    el.addEventListener('keydown',e=>{
      if(e.key==='Enter'&&!opts.textarea){e.preventDefault();b.click()}
    });
    box.append(lab,el,b);
    controls.appendChild(box);
    setTimeout(()=>el.focus(),100);
  }

  function start(){
    Object.assign(state,{
      topic:'',question:'',context:'',name:'',birthDate:'',birthTime:'',birthPlace:'',
      targetPlace:'',contactChannel:'',contactValue:'',marketingConsent:false,savedLeadId:''
    });
    chat.innerHTML='';
    clear();
    msg('Bun venit la AstroVip. Ai o mini-consultație gratuită pentru o singură întrebare. Alege domeniul:');
    choices([
      {label:'Carieră',value:'Carieră'},
      {label:'Dragoste',value:'Dragoste'},
      {label:'Relocare',value:'Relocare'}
    ],v=>{
      state.topic=v;
      event('astro_free_question_start');
      askQuestion();
    });
  }

  function askQuestion(){
    msg('Scrie o singură întrebare, cât mai clară. Răspunsul gratuit este scurt și orientativ.');
    field({
      label:'Întrebarea ta',
      placeholder:state.topic==='Carieră'
        ?'Ex.: Este o perioadă potrivită pentru schimbarea jobului?'
        :state.topic==='Dragoste'
          ?'Ex.: Ce temă importantă se activează acum în viața mea sentimentală?'
          :'Ex.: Ce ar trebui să analizez înainte de o relocare în Spania?',
      textarea:true,max:500
    },v=>{state.question=v;askContext()});
  }

  function askContext(){
    let ph='Context opțional';
    if(state.topic==='Carieră')ph='Ex.: domeniul actual, schimbarea avută în vedere';
    if(state.topic==='Dragoste')ph='Ex.: relație existentă / persoană nouă';
    if(state.topic==='Relocare')ph='Ex.: orașul actual și locul avut în vedere';
    field({label:'Context scurt (opțional)',placeholder:ph,textarea:true,max:350,required:false,button:'Continuă'},v=>{
      state.context=v;
      askName();
    });
  }

  function askName(){
    msg('Pentru a putea identifica solicitarea, am nevoie de numele tău.');
    field({label:'Nume',placeholder:'Numele tău',max:100,autocomplete:'name'},v=>{
      state.name=v;
      askContactMethod();
    });
  }

  function askContactMethod(){
    msg('Cum preferi să fii contactat pentru răspuns?');
    choices([
      {label:'WhatsApp',value:'whatsapp'},
      {label:'Email',value:'email'}
    ],v=>{
      state.contactChannel=v;
      askContactValue();
    });
  }

  function askContactValue(){
    if(state.contactChannel==='whatsapp'){
      field({
        label:'Număr WhatsApp',
        placeholder:'Ex.: 0722 123 456',
        max:30,
        autocomplete:'tel',
        inputmode:'tel',
        validate:v=>{
          const ok=(v.replace(/\D/g,'').length>=7);
          if(!ok)alert('Introdu un număr de telefon valid.');
          return ok;
        }
      },v=>{state.contactValue=v;askBirthDate()});
    }else{
      field({
        label:'Adresă de email',
        placeholder:'nume@exemplu.ro',
        max:180,
        autocomplete:'email',
        type:'email',
        validate:v=>{
          const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          if(!ok)alert('Introdu o adresă de email validă.');
          return ok;
        }
      },v=>{state.contactValue=v;askBirthDate()});
    }
  }

  function askBirthDate(){
    msg('Pentru interpretarea astrologică sunt utile datele de naștere.');
    field({
      label:'Data nașterii',
      type:'date',
      max:20,
      validate:v=>{
        if(!v)return false;
        const d=new Date(v+'T00:00:00');
        const ok=!Number.isNaN(d.getTime()) && d<=new Date();
        if(!ok)alert('Introdu o dată de naștere validă.');
        return ok;
      }
    },v=>{state.birthDate=v;askBirthTime()});
  }

  function askBirthTime(){
    field({label:'Ora nașterii (opțional)',type:'time',required:false,button:'Continuă'},v=>{
      state.birthTime=v;
      askBirthPlace();
    });
  }

  function askBirthPlace(){
    field({label:'Localitatea nașterii',placeholder:'Ex.: București, România',max:140},v=>{
      state.birthPlace=v;
      if(state.topic==='Relocare')askTarget();
      else review();
    });
  }

  function askTarget(){
    field({
      label:'Localitatea / țara avută în vedere',
      placeholder:'Ex.: Santander, Spania',
      max:140,
      required:false,
      button:'Continuă'
    },v=>{
      state.targetPlace=v;
      review();
    });
  }

  function buildText(){
    return [
      'ASTROVIP — 1 ÎNTREBARE GRATUITĂ',
      'Domeniu: '+state.topic,
      'Întrebare: '+state.question,
      state.context?'Context: '+state.context:'',
      'Nume: '+state.name,
      'Contact preferat: '+(state.contactChannel==='whatsapp'?'WhatsApp':'Email')+' — '+state.contactValue,
      'Data nașterii: '+state.birthDate,
      'Ora nașterii: '+(state.birthTime||'necunoscută'),
      'Loc naștere: '+state.birthPlace,
      state.targetPlace?'Relocare vizată: '+state.targetPlace:'',
      'Sursă: '+state.source
    ].filter(Boolean).join('\n');
  }

  function leadPayload(){
    return {
      topic:state.topic,
      question:state.question,
      context:state.context||null,
      name:state.name,
      birth_date:state.birthDate,
      birth_time:state.birthTime||null,
      birth_place:state.birthPlace,
      target_place:state.targetPlace||null,
      contact_channel:state.contactChannel,
      contact_value:state.contactValue,
      source:state.source||'direct',
      medium:state.medium||null,
      campaign:state.campaign||null,
      referrer:state.referrer||null,
      landing_url:location.href,
      consent_at:new Date().toISOString(),
      marketing_consent:!!state.marketingConsent
    };
  }

  async function saveLead(){
    if(state.savedLeadId)return {ok:true,id:state.savedLeadId};
    const res=await fetch(SUPABASE_URL+'/rest/v1/free_question_leads',{
      method:'POST',
      headers:{
        'apikey':SUPABASE_KEY,
        'Content-Type':'application/json',
        'Prefer':'return=minimal'
      },
      body:JSON.stringify(leadPayload())
    });
    if(!res.ok){
      const t=await res.text().catch(()=> '');
      throw new Error('Lead save failed '+res.status+' '+t);
    }
    state.savedLeadId='saved';
    event('astro_free_question_lead_saved');
    return {ok:true,id:state.savedLeadId};
  }

  function review(){
    clear();
    msg('Perfect. Verifică rezumatul. La trimitere, solicitarea și datele introduse vor fi salvate securizat de AstroVip pentru a putea răspunde și gestiona cererea.');
    msg(buildText(),'user');

    const box=document.createElement('div');
    box.className='freeq-inputbox';

    const consent=document.createElement('label');
    consent.className='freeq-consent';
    consent.innerHTML='<input id="fqConsent" type="checkbox"> <span>Sunt de acord ca AstroVip să salveze și să folosească datele introduse, inclusiv datele de naștere și contact, pentru gestionarea și răspunsul la această solicitare. Datele pentru solicitările gratuite sunt păstrate, de regulă, maximum 12 luni de la ultima interacțiune. <a href="/politica-confidentialitate/" target="_blank" rel="noopener">Politica de confidențialitate</a>.</span>';

    const marketing=document.createElement('label');
    marketing.className='freeq-consent';
    marketing.innerHTML='<input id="fqMarketing" type="checkbox"> <span>Opțional: doresc să pot fi contactat și cu informații despre servicii și oferte AstroVip relevante pentru mine. Pot retrage acordul ulterior.</span>';

    const status=document.createElement('div');
    status.className='freeq-status';
    status.id='freeqSaveStatus';
    status.textContent='Datele sunt salvate numai după ce apeși unul dintre butoanele de trimitere.';

    const sends=document.createElement('div');
    sends.className='freeq-send-grid';

    const wa=document.createElement('a');
    wa.className='freeq-action';
    wa.href='#';
    wa.textContent='Salvează + WhatsApp';

    const em=document.createElement('a');
    em.className='freeq-action secondary';
    em.href='#';
    em.textContent='Salvează + Email';

    function consentOk(){
      const c=document.getElementById('fqConsent');
      if(!c.checked){
        c.focus();
        alert('Bifează acordul pentru salvarea și folosirea datelor înainte de trimitere.');
        return false;
      }
      state.marketingConsent=!!document.getElementById('fqMarketing')?.checked;
      return true;
    }

    async function doSave(button){
      if(!consentOk())return false;
      const other=[wa,em].find(x=>x!==button);
      button.setAttribute('aria-disabled','true');
      other.setAttribute('aria-disabled','true');
      button.textContent='Se salvează...';
      status.textContent='Salvez solicitarea în siguranță...';
      try{
        await saveLead();
        status.textContent='Solicitarea a fost salvată. Poți continua cu trimiterea.';
        return true;
      }catch(err){
        console.error(err);
        status.textContent='Nu am putut salva automat solicitarea. Poți continua prin WhatsApp/email, dar datele nu au fost salvate în registru.';
        alert('Salvarea automată nu a reușit. Datele tale nu au fost salvate în registrul AstroVip.');
        return false;
      }finally{
        wa.removeAttribute('aria-disabled');
        em.removeAttribute('aria-disabled');
        wa.textContent='Salvează + WhatsApp';
        em.textContent='Salvează + Email';
      }
    }

    wa.onclick=async e=>{
      e.preventDefault();
      if(wa.getAttribute('aria-disabled')==='true')return;
      const ok=await doSave(wa);
      if(!ok)return;
      event('astro_free_question_submit_whatsapp');
      window.open('https://wa.me/40722128220?text='+encodeURIComponent(buildText()),'_blank','noopener');
    };

    em.onclick=async e=>{
      e.preventDefault();
      if(em.getAttribute('aria-disabled')==='true')return;
      const ok=await doSave(em);
      if(!ok)return;
      event('astro_free_question_submit_email');
      location.href='mailto:contact@astrovip.ro?subject='+encodeURIComponent('AstroVip — 1 întrebare gratuită — '+state.topic)+'&body='+encodeURIComponent(buildText());
    };

    sends.append(wa,em);

    const restart=document.createElement('button');
    restart.type='button';
    restart.className='freeq-action secondary';
    restart.textContent='Reîncepe conversația';
    restart.onclick=start;

    box.append(consent,marketing,status,sends,restart);
    controls.appendChild(box);
  }

  start();
})();
