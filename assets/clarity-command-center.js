(()=>{
  'use strict';
  const K='avcc_v3_token';
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));
  const fmt=(x,d=0)=>x==null||x===''?'—':new Intl.NumberFormat('ro-RO',{maximumFractionDigits:d}).format(+x);
  function setBadge(text,kind='warn'){
    const b=document.getElementById('av-clarity-badge');if(!b)return;
    b.textContent=text;b.className='badge '+(kind==='ok'?'':kind==='bad'?'red':'warn');
  }
  function install(){
    if(document.getElementById('av-clarity-card'))return;
    const grid=document.querySelector('main.grid');if(!grid)return;
    const card=document.createElement('section');
    card.id='av-clarity-card';card.className='card exec gold';
    card.innerHTML='<div class="sec"><b>MICROSOFT CLARITY · UX</b><span id="av-clarity-badge" class="badge warn">MANUAL</span></div><div class="kpi four"><div><small>Sesiuni · 24h</small><strong id="av-clarity-sessions">—</strong></div><div><small>Utilizatori</small><strong id="av-clarity-users">—</strong></div><div><small>Rage clicks</small><strong id="av-clarity-rage">—</strong></div><div><small>Dead clicks</small><strong id="av-clarity-dead">—</strong></div></div><div class="list"><div class="row"><span>Script errors</span><span id="av-clarity-errors" class="v">—</span></div><div class="row"><span>Bot sessions</span><span id="av-clarity-bots" class="v">—</span></div><div class="row"><span>Perioadă API</span><span id="av-clarity-period" class="v">24H · UTC</span></div></div><div class="mut" style="margin-top:10px">Actualizare manuală pentru a proteja limita Microsoft de 10 cereri API/zi/proiect.</div><div class="card-actions"><button id="av-clarity-refresh" class="btn primary" type="button">Actualizează Clarity</button><a class="btn" href="https://clarity.microsoft.com/" target="_blank" rel="noopener">Heatmaps & Recordings</a></div>';
    const alerts=[...grid.querySelectorAll('section.card')].find(x=>/ALERTS CENTER/i.test(x.textContent||''));
    alerts?grid.insertBefore(card,alerts):grid.appendChild(card);
    document.getElementById('av-clarity-refresh')?.addEventListener('click',()=>refresh(true));

    const chips=document.querySelector('.chips');
    if(chips&&!document.getElementById('av-clarity-chip')){
      const chip=document.createElement('button');chip.id='av-clarity-chip';chip.className='chip';chip.type='button';chip.textContent='Clarity UX';chip.addEventListener('click',()=>refresh(true));chips.appendChild(chip);
    }

    const original=window.runOperator;
    if(typeof original==='function'&&!window.__avClarityOperatorWrapped){
      window.__avClarityOperatorWrapped=true;
      window.runOperator=function(){
        const q=String(document.getElementById('command')?.value||'').toLowerCase();
        if(q.includes('clarity')||q.includes('heatmap')||q.includes('rage click')||q.includes('dead click'))return refresh(true);
        return original.apply(this,arguments);
      };
    }
  }
  async function refresh(loud=false){
    const token=sessionStorage.getItem(K)||'';
    if(!token){setBadge('NEAUTENTIFICAT','bad');return;}
    setBadge('ÎNCĂRCARE','warn');
    try{
      const r=await fetch('/api/command/clarity?days=1&dimension1=Device',{headers:{authorization:'Bearer '+token}});
      const d=await r.json().catch(()=>({}));
      if(!r.ok)throw Error(d.error||('HTTP '+r.status));
      const m=d.data?.summary||{};
      document.getElementById('av-clarity-sessions').textContent=fmt(m.sessions);
      document.getElementById('av-clarity-users').textContent=fmt(m.users);
      document.getElementById('av-clarity-rage').textContent=fmt(m.rageClicks);
      document.getElementById('av-clarity-dead').textContent=fmt(m.deadClicks);
      document.getElementById('av-clarity-errors').textContent=fmt(m.scriptErrors);
      document.getElementById('av-clarity-bots').textContent=fmt(m.botSessions);
      document.getElementById('av-clarity-period').textContent=fmt((d.data?.numOfDays||1)*24)+'H · '+esc(d.data?.timezone||'UTC');
      setBadge('LIVE','ok');
      if(loud&&typeof window.logAction==='function')window.logAction('ux','Microsoft Clarity actualizat');
      if(loud&&typeof window.toast==='function')window.toast('Clarity UX actualizat');
    }catch(e){
      const map={clarity_api_token_not_configured:'Lipsește CLARITY_API_TOKEN.',clarity_api_token_invalid_or_unauthorized:'Tokenul Clarity nu este valid sau autorizat.',clarity_daily_quota_exceeded:'Limita zilnică Clarity a fost atinsă.'};
      setBadge('ATENȚIE','bad');
      const msg=map[e.message]||e.message||'Eroare Clarity';
      if(loud&&typeof window.toast==='function')window.toast(msg);
    }
  }
  window.avClarityRefresh=refresh;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
