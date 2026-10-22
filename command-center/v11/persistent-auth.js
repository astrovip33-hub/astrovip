(()=>{
  'use strict';

  const SESSION_KEY='avcc_v3_token';
  const REMEMBER_KEY='avcc_v11_remembered_access';
  const REMEMBER_TTL_MS=90*24*60*60*1000;

  function clearRemembered(){
    try{localStorage.removeItem(REMEMBER_KEY);}catch{}
  }

  function readRemembered(){
    try{
      const raw=localStorage.getItem(REMEMBER_KEY);
      if(!raw)return '';
      const saved=JSON.parse(raw);
      if(!saved||typeof saved.token!=='string'||!saved.token||!Number.isFinite(saved.expiresAt)||saved.expiresAt<=Date.now()){
        clearRemembered();
        return '';
      }
      return saved.token;
    }catch{
      clearRemembered();
      return '';
    }
  }

  function remember(token){
    try{
      localStorage.setItem(REMEMBER_KEY,JSON.stringify({token,expiresAt:Date.now()+REMEMBER_TTL_MS}));
    }catch{}
  }

  const remembered=readRemembered();
  if(remembered){
    try{sessionStorage.setItem(SESSION_KEY,remembered);}catch{}
  }

  document.addEventListener('submit',event=>{
    if(event.target?.id!=='login-form')return;
    const token=document.getElementById('token')?.value.trim()||'';
    const keep=document.getElementById('remember-access')?.checked===true;
    if(token&&keep)remember(token);else clearRemembered();
  },true);

  document.addEventListener('click',event=>{
    if(event.target?.closest?.('#logout'))clearRemembered();
  },true);

  document.addEventListener('DOMContentLoaded',()=>{
    const checkbox=document.getElementById('remember-access');
    if(checkbox)checkbox.checked=Boolean(readRemembered());

    const error=document.getElementById('login-error');
    if(!error)return;
    const observer=new MutationObserver(()=>{
      if(error.textContent.trim()){
        clearRemembered();
        if(checkbox)checkbox.checked=false;
      }
    });
    observer.observe(error,{childList:true,subtree:true,characterData:true});
  },{once:true});
})();
