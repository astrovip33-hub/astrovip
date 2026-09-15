(() => {
  'use strict';
  const cfg = window.ASTROVIP_FORUM_CONFIG || {};
  const hasBackend = Boolean(cfg.url && cfg.anonKey && window.supabase);
  const db = hasBackend ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
  const demoKey = 'astrovip_forum_demo_v2';
  const $ = s => document.querySelector(s);
  const els = {
    statusDot: $('#statusDot'), statusTitle: $('#statusTitle'), statusText: $('#statusText'), demoNotice: $('#demoNotice'),
    categoryList: $('#categoryList'), topicList: $('#topicList'), topicHeading: $('#topicHeading'), topicCategory: $('#topicCategory'),
    statCategories: $('#statCategories'), statTopics: $('#statTopics'), statReplies: $('#statReplies'), statMembers: $('#statMembers'),
    authBtn: $('#authBtn'), authModal: $('#authModal'), authForm: $('#authForm'), authMsg: $('#authMsg'), displayName: $('#displayName'),
    topicModal: $('#topicModal'), topicForm: $('#topicForm'), topicMsg: $('#topicMsg'), threadModal: $('#threadModal'), threadContent: $('#threadContent'),
    replyForm: $('#replyForm'), replyBody: $('#replyBody'), replyMsg: $('#replyMsg'), searchInput: $('#searchInput'), sortSelect: $('#sortSelect'), toast: $('#toast')
  };
  const categoriesFallback = [
    {id:'natal',slug:'astrologie-natala',name:'Astrologie natală',description:'Planete, case, aspecte și axe',icon:'✦',position:1},
    {id:'timing',slug:'previziuni-timing',name:'Previziuni & timing',description:'Tranzite, arce solare și progresii',icon:'◷',position:2},
    {id:'sinastrie',slug:'relatii-sinastrie',name:'Relații & sinastrie',description:'Compatibilitate și dinamici de cuplu',icon:'♡',position:3},
    {id:'relocare',slug:'relocare-local-space',name:'Relocare & Local Space',description:'Astrocartografie și hărți relocate',icon:'⌖',position:4},
    {id:'numerologie',slug:'numerologie',name:'Numerologie',description:'Nume, date și cicluri numerice',icon:'#',position:5},
    {id:'general',slug:'intrebari-generale',name:'Întrebări generale',description:'Discuții despre astrologie',icon:'?',position:6}
  ];
  let categories = [], topics = [], selectedCategory = null, currentTopic = null, currentUser = null, authMode = 'login';
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const fmt = value => { if(!value) return 'acum'; const d=new Date(value); return new Intl.DateTimeFormat('ro-RO',{day:'2-digit',month:'short',year:'numeric'}).format(d); };
  const toast = m => { els.toast.textContent=m; els.toast.classList.add('show'); clearTimeout(window.__forumToast); window.__forumToast=setTimeout(()=>els.toast.classList.remove('show'),2600); };
  const openModal = el => { el.classList.add('open'); el.setAttribute('aria-hidden','false'); };
  const closeModal = el => { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); };
  const initials = name => (name || 'A').trim().slice(0,1).toUpperCase();

  function demoData(){
    let stored; try { stored=JSON.parse(localStorage.getItem(demoKey)||'null'); } catch {}
    if(stored) return stored;
    return {topics:[{id:'welcome',category_id:'general',title:'Bine ai venit în Comunitatea AstroVip',body:'Acesta este spațiul pentru întrebări și discuții astrologice. În modul demonstrativ, subiectele create de tine rămân doar în browser până la conectarea bazei de date.',author_name:'AstroVip',created_at:new Date().toISOString(),reply_count:0,replies:[]}]};
  }
  function saveDemo(){ localStorage.setItem(demoKey,JSON.stringify({topics})); }

  async function init(){
    if(hasBackend){
      els.statusDot.classList.add('online'); els.statusTitle.textContent='Forum online'; els.statusText.textContent='Postările sunt sincronizate public';
      const {data:{session}} = await db.auth.getSession(); currentUser=session?.user || null; updateAuthUI();
      db.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;updateAuthUI();});
      await loadRemote();
    } else {
      els.statusTitle.textContent='Forum în pregătire'; els.statusText.textContent='Mod local până la conectarea bazei de date'; els.demoNotice.hidden=false;
      categories=categoriesFallback; topics=demoData().topics; renderAll();
    }
  }

  async function loadRemote(){
    const [catRes,topicRes,replyRes] = await Promise.all([
      db.from('forum_categories').select('*').order('position'),
      db.from('forum_topics').select('id,category_id,title,body,author_id,author_name,created_at,updated_at,is_pinned,status').eq('status','open').order('is_pinned',{ascending:false}).order('updated_at',{ascending:false}),
      db.from('forum_replies').select('id,topic_id',{count:'exact',head:true})
    ]);
    if(catRes.error || topicRes.error){
      els.statusDot.classList.remove('online'); els.statusTitle.textContent='Conexiune indisponibilă'; els.statusText.textContent='Verifică configurarea Supabase';
      categories=categoriesFallback; topics=demoData().topics; els.demoNotice.hidden=false; renderAll(); return;
    }
    categories=catRes.data||[]; topics=topicRes.data||[];
    if(topics.length){
      const ids=topics.map(t=>t.id); const {data:replies}=await db.from('forum_replies').select('topic_id').in('topic_id',ids);
      const counts={}; (replies||[]).forEach(r=>counts[r.topic_id]=(counts[r.topic_id]||0)+1); topics=topics.map(t=>({...t,reply_count:counts[t.id]||0}));
    }
    els.statMembers.textContent='✓'; renderAll();
  }

  function renderAll(){ renderCategories(); renderTopics(); renderStats(); fillCategorySelect(); }
  function renderStats(){ els.statCategories.textContent=categories.length; els.statTopics.textContent=topics.length; els.statReplies.textContent=topics.reduce((n,t)=>n+(t.reply_count||t.replies?.length||0),0); }
  function fillCategorySelect(){ els.topicCategory.innerHTML='<option value="">Alege categoria</option>'+categories.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join(''); }
  function renderCategories(){
    const counts={}; topics.forEach(t=>counts[t.category_id]=(counts[t.category_id]||0)+1);
    els.categoryList.innerHTML=`<button class="category ${selectedCategory===null?'active':''}" data-category=""><span class="cat-icon">◎</span><span><strong>Toate discuțiile</strong><small>Activitatea comunității</small></span><span class="count">${topics.length}</span></button>`+
      categories.map(c=>`<button class="category ${String(selectedCategory)===String(c.id)?'active':''}" data-category="${esc(c.id)}"><span class="cat-icon">${esc(c.icon||'✦')}</span><span><strong>${esc(c.name)}</strong><small>${esc(c.description||'')}</small></span><span class="count">${counts[c.id]||0}</span></button>`).join('');
    els.categoryList.querySelectorAll('.category').forEach(btn=>btn.addEventListener('click',()=>{selectedCategory=btn.dataset.category||null; const c=categories.find(x=>String(x.id)===String(selectedCategory)); els.topicHeading.textContent=c?c.name:'Discuții recente'; renderAll(); document.querySelector('#discutii').scrollIntoView({behavior:'smooth'});}));
  }
  function filteredTopics(){
    let list=[...topics]; if(selectedCategory) list=list.filter(t=>String(t.category_id)===String(selectedCategory));
    const q=els.searchInput.value.trim().toLowerCase(); if(q) list=list.filter(t=>(t.title+' '+t.body).toLowerCase().includes(q));
    if(els.sortSelect.value==='replies') list.sort((a,b)=>(b.reply_count||0)-(a.reply_count||0));
    else list.sort((a,b)=>new Date(b.updated_at||b.created_at)-new Date(a.updated_at||a.created_at));
    return list;
  }
  function renderTopics(){
    const list=filteredTopics(); if(!list.length){els.topicList.innerHTML='<div class="empty">Nu există încă discuții aici. Deschide primul subiect.</div>';return;}
    els.topicList.innerHTML=list.map(t=>{const c=categories.find(x=>String(x.id)===String(t.category_id)); const author=t.author_name||'Membru AstroVip'; return `<article class="topic-row" data-topic="${esc(t.id)}"><div class="avatar">${esc(initials(author))}</div><div><div class="topic-title">${t.is_pinned?'📌 ':''}${esc(t.title)}</div><div class="topic-meta">${esc(c?.name||'General')} · ${esc(author)} · ${fmt(t.created_at)}</div></div><div class="topic-count"><strong>${t.reply_count||t.replies?.length||0}</strong><small>răspunsuri</small></div><div class="last"><small>Actualizat</small><br>${fmt(t.updated_at||t.created_at)}</div></article>`;}).join('');
    els.topicList.querySelectorAll('.topic-row').forEach(row=>row.addEventListener('click',()=>openThread(row.dataset.topic)));
  }

  async function openThread(id){
    currentTopic=topics.find(t=>String(t.id)===String(id)); if(!currentTopic)return;
    let replies=currentTopic.replies||[];
    if(hasBackend){ const {data}=await db.from('forum_replies').select('*').eq('topic_id',id).order('created_at'); replies=data||[]; }
    const author=currentTopic.author_name||'Membru AstroVip';
    els.threadContent.innerHTML=`<div class="thread-head"><span class="kicker">${esc(categories.find(c=>String(c.id)===String(currentTopic.category_id))?.name||'Forum')}</span><h2 id="threadTitle">${esc(currentTopic.title)}</h2><div class="thread-meta">${esc(author)} · ${fmt(currentTopic.created_at)}</div></div><div class="post-body">${esc(currentTopic.body)}</div><div class="replies"><h3>Răspunsuri (${replies.length})</h3>${replies.length?replies.map(r=>`<div class="reply"><strong>${esc(r.author_name||'Membru AstroVip')}</strong><small>${fmt(r.created_at)}</small><p>${esc(r.body)}</p></div>`).join(''):'<div class="empty">Niciun răspuns încă.</div>'}</div>`;
    openModal(els.threadModal);
  }

  function requireUser(){ if(hasBackend && !currentUser){openModal(els.authModal);toast('Autentifică-te pentru a publica.');return false;} return true; }
  function startTopic(){ if(!requireUser())return; els.topicMsg.textContent=''; openModal(els.topicModal); }
  function updateAuthUI(){ els.authBtn.textContent=currentUser?'Contul meu':'Autentificare'; }

  $('#newTopicBtn').addEventListener('click',startTopic); $('#newTopicTop').addEventListener('click',startTopic);
  els.searchInput.addEventListener('input',renderTopics); els.sortSelect.addEventListener('change',renderTopics);
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(document.getElementById(b.dataset.close))));
  document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m);}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal.open').forEach(closeModal);});
  els.authBtn.addEventListener('click',async()=>{if(currentUser&&hasBackend){await db.auth.signOut();toast('Ai ieșit din cont.');}else openModal(els.authModal);});
  document.querySelectorAll('[data-auth-mode]').forEach(b=>b.addEventListener('click',()=>{authMode=b.dataset.authMode;document.querySelectorAll('[data-auth-mode]').forEach(x=>x.classList.toggle('active',x===b));els.displayName.hidden=authMode!=='signup';$('#authTitle').textContent=authMode==='signup'?'Creează cont':'Autentificare';}));

  els.authForm.addEventListener('submit',async e=>{
    e.preventDefault(); els.authMsg.textContent=''; if(!hasBackend){els.authMsg.textContent='Baza de date nu este conectată încă.';return;}
    const email=$('#email').value.trim(),password=$('#password').value,name=els.displayName.value.trim();
    const res=authMode==='signup'?await db.auth.signUp({email,password,options:{data:{display_name:name||email.split('@')[0]}}}):await db.auth.signInWithPassword({email,password});
    if(res.error){els.authMsg.textContent=res.error.message;return;} closeModal(els.authModal);toast(authMode==='signup'?'Cont creat. Verifică emailul dacă este necesar.':'Autentificare reușită.');
  });

  els.topicForm.addEventListener('submit',async e=>{
    e.preventDefault(); els.topicMsg.textContent=''; const title=$('#topicTitle').value.trim(),body=$('#topicBody').value.trim(),category_id=els.topicCategory.value;
    if(hasBackend){
      if(!currentUser){closeModal(els.topicModal);openModal(els.authModal);return;}
      const author_name=currentUser.user_metadata?.display_name||currentUser.email?.split('@')[0]||'Membru AstroVip';
      const {error}=await db.from('forum_topics').insert({category_id,author_id:currentUser.id,author_name,title,body}); if(error){els.topicMsg.textContent=error.message;return;} await loadRemote();
    } else {
      topics.unshift({id:'local-'+Date.now(),category_id,title,body,author_name:'Vizitator local',created_at:new Date().toISOString(),updated_at:new Date().toISOString(),reply_count:0,replies:[]}); saveDemo(); renderAll();
    }
    e.target.reset();closeModal(els.topicModal);toast(hasBackend?'Subiect publicat.':'Subiect salvat local.');
  });

  els.replyForm.addEventListener('submit',async e=>{
    e.preventDefault(); if(!currentTopic)return; const body=els.replyBody.value.trim(); if(!body)return;
    if(hasBackend){
      if(!currentUser){closeModal(els.threadModal);openModal(els.authModal);return;}
      const author_name=currentUser.user_metadata?.display_name||currentUser.email?.split('@')[0]||'Membru AstroVip';
      const {error}=await db.from('forum_replies').insert({topic_id:currentTopic.id,author_id:currentUser.id,author_name,body}); if(error){els.replyMsg.textContent=error.message;return;} await loadRemote();
    } else {
      currentTopic.replies=currentTopic.replies||[]; currentTopic.replies.push({id:'r-'+Date.now(),author_name:'Vizitator local',body,created_at:new Date().toISOString()}); currentTopic.reply_count=currentTopic.replies.length; currentTopic.updated_at=new Date().toISOString(); saveDemo(); renderAll();
    }
    els.replyBody.value=''; await openThread(currentTopic.id); toast(hasBackend?'Răspuns publicat.':'Răspuns salvat local.');
  });

  init();
})();
