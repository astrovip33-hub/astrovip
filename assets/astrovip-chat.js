(()=>{"use strict";
const ENDPOINT="https://hhzsecdtqacyroxiywpm.supabase.co/functions/v1/astrovip-chat";
const STORE="astrovip_chat_v1";
const LANGS=["auto","en","es","it","zh-CN"];
const COPY={
  ro:{title:"AstroVip · Chat",sub:"Traducere automată RO ↔ EN · ES · IT · 中文",hello:"Scrie-mi în limba ta. Mesajul tău este tradus automat în română, iar răspunsul meu revine în limba ta.",placeholder:"Scrie mesajul...",send:"Trimite",original:"Original în română",translated:"Traducere automată",connecting:"Conectare...",online:"Conectat",error:"Conexiunea nu este disponibilă momentan.",open:"Chat AstroVip"},
  en:{title:"AstroVip · Live Chat",sub:"Automatic translation to/from Romanian",hello:"Write in English. Your message is translated automatically into Romanian, and my reply is translated back into English.",placeholder:"Write a message...",send:"Send",original:"Original in Romanian",translated:"Automatic translation",connecting:"Connecting...",online:"Connected",error:"Chat is temporarily unavailable.",open:"AstroVip Chat"},
  es:{title:"AstroVip · Chat",sub:"Traducción automática con rumano",hello:"Escribe en español. Tu mensaje se traduce automáticamente al rumano y mi respuesta vuelve traducida al español.",placeholder:"Escribe un mensaje...",send:"Enviar",original:"Original en rumano",translated:"Traducción automática",connecting:"Conectando...",online:"Conectado",error:"El chat no está disponible temporalmente.",open:"Chat AstroVip"},
  it:{title:"AstroVip · Chat",sub:"Traduzione automatica con il rumeno",hello:"Scrivi in italiano. Il tuo messaggio viene tradotto automaticamente in rumeno e la mia risposta torna tradotta in italiano.",placeholder:"Scrivi un messaggio...",send:"Invia",original:"Originale in rumeno",translated:"Traduzione automatica",connecting:"Connessione...",online:"Connesso",error:"La chat non è temporaneamente disponibile.",open:"Chat AstroVip"},
  "zh-CN":{title:"AstroVip · 在线聊天",sub:"与罗马尼亚语自动互译",hello:"请用中文留言。您的消息会自动翻译成罗马尼亚语，我的回复也会自动翻译成中文。",placeholder:"输入消息...",send:"发送",original:"罗马尼亚语原文",translated:"自动翻译",connecting:"正在连接...",online:"已连接",error:"聊天暂时不可用。",open:"AstroVip 在线聊天"}
};
function browserLang(){const l=(navigator.language||"ro").toLowerCase();if(l.startsWith("es"))return"es";if(l.startsWith("it"))return"it";if(l.startsWith("zh"))return"zh-CN";if(l.startsWith("en"))return"en";return"ro"}
function uiLang(v){return v==="auto"?browserLang():(COPY[v]?v:"ro")}
function load(){try{return JSON.parse(localStorage.getItem(STORE)||"{}")}catch(e){return{}}}
const saved=load();
const state={session:saved.session||crypto.randomUUID(),thread:saved.thread||"",lang:saved.lang||"auto",lastId:0,busy:false,loaded:false};
function persist(){localStorage.setItem(STORE,JSON.stringify({session:state.session,thread:state.thread,lang:state.lang}))}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function currentCopy(){return COPY[uiLang(state.lang)]||COPY.ro}
function post(payload){return fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}).then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||("HTTP "+r.status));return j})}
const launcher=document.createElement("button");launcher.className="avchat-launcher";launcher.type="button";launcher.innerHTML='<span class="avchat-launcher-dot"></span><span class="avchat-launcher-label"></span>';
const panel=document.createElement("section");panel.className="avchat-panel";panel.setAttribute("aria-label","AstroVip multilingual chat");panel.innerHTML='<header class="avchat-head"><div class="avchat-brand"><strong></strong><span></span></div><div class="avchat-head-actions"><select class="avchat-lang" aria-label="Chat language"><option value="auto">Auto</option><option value="en">EN</option><option value="es">ES</option><option value="it">IT</option><option value="zh-CN">中文</option></select><button class="avchat-close" type="button" aria-label="Close">×</button></div></header><div class="avchat-body"><div class="avchat-empty"><strong></strong><span></span><div class="avchat-encryption">● AstroVip secure chat</div><div class="avchat-privacy">Mesajele sunt procesate pentru funcționarea conversației și traducere. <a href="/politica-confidentialitate/" target="_blank" rel="noopener">Confidențialitate</a></div></div><div class="avchat-messages"></div></div><footer class="avchat-composer"><div class="avchat-row"><textarea class="avchat-input" rows="1" maxlength="1500"></textarea><button class="avchat-send" type="button" aria-label="Send">➤</button></div><div class="avchat-status"></div></footer>';
document.body.append(launcher,panel);
const desktopChatMq=window.matchMedia("(min-width:981px)");
function placeLauncher(){
  const desktopHost=document.querySelector(".av-langbar .wrap");
  const useHeaderSlot=desktopChatMq.matches&&desktopHost;
  launcher.classList.toggle("avchat-header-slot",!!useHeaderSlot);
  if(useHeaderSlot){
    if(launcher.parentNode!==desktopHost)desktopHost.appendChild(launcher);
  }else if(launcher.parentNode!==document.body){
    document.body.appendChild(launcher);
  }
}
function alignLauncher(){
  launcher.style.removeProperty("top");
  launcher.style.removeProperty("right");
  launcher.style.removeProperty("bottom");
  launcher.style.removeProperty("left");
}
function alignPanel(){
  if(!desktopChatMq.matches){
    panel.style.removeProperty("right");
    panel.style.removeProperty("top");
    panel.style.removeProperty("bottom");
    return;
  }
  const r=launcher.getBoundingClientRect();
  panel.style.right=Math.max(12,window.innerWidth-r.right)+"px";
  panel.style.top=Math.round(r.bottom+8)+"px";
  panel.style.removeProperty("bottom");
}
const $=s=>panel.querySelector(s),body=$(".avchat-body"),messages=$(".avchat-messages"),empty=$(".avchat-empty"),input=$(".avchat-input"),send=$(".avchat-send"),status=$(".avchat-status"),langSel=$(".avchat-lang");
langSel.value=state.lang;
function paintCopy(){const c=currentCopy();launcher.querySelector(".avchat-launcher-label").textContent=desktopChatMq.matches?"Chat":c.open;launcher.setAttribute("aria-label",c.open);$(".avchat-brand strong").textContent=c.title;$(".avchat-brand span").textContent=c.sub;$(".avchat-empty strong").textContent=c.title;$(".avchat-empty span").textContent=c.hello;input.placeholder=c.placeholder;send.title=c.send}
function setStatus(t="",err=false){status.textContent=t;status.classList.toggle("error",!!err)}
function showMsg(m){if(messages.querySelector('[data-id="'+m.id+'"]'))return;const c=currentCopy(),d=document.createElement("div");d.className="avchat-msg "+m.sender;d.dataset.id=m.id;if(m.sender==="admin"){const shown=m.translated_for_visitor||m.original_text;d.innerHTML=esc(shown);if(m.translated_for_visitor&&m.translated_for_visitor!==m.original_text)d.innerHTML+='<small>'+esc(c.translated)+'</small><details><summary>'+esc(c.original)+'</summary>'+esc(m.original_text)+'</details>'}else{d.textContent=m.original_text}messages.appendChild(d);state.lastId=Math.max(state.lastId,Number(m.id)||0);empty.style.display="none"}
async function ensureThread(){if(state.thread)return state.thread;setStatus(currentCopy().connecting);const r=await post({action:"create_thread",session_token:state.session,preferred_lang:state.lang,page_url:location.href});state.thread=r.thread.id;persist();setStatus(currentCopy().online);return state.thread}
async function poll(){if(!state.thread||state.busy)return;try{const r=await post({action:"poll_visitor",thread_id:state.thread,session_token:state.session,after_id:state.loaded?state.lastId:0});(r.messages||[]).forEach(showMsg);state.loaded=true;setStatus(currentCopy().online);body.scrollTop=body.scrollHeight}catch(e){setStatus(currentCopy().error,true)}}
async function sendMsg(){const text=input.value.trim();if(!text||state.busy)return;state.busy=true;send.disabled=true;try{await ensureThread();const r=await post({action:"send_visitor",thread_id:state.thread,session_token:state.session,text,source_lang:state.lang});input.value="";showMsg(r.message);setStatus(currentCopy().online);body.scrollTop=body.scrollHeight}catch(e){setStatus(currentCopy().error,true)}finally{state.busy=false;send.disabled=false;input.focus()}}
launcher.onclick=async()=>{panel.classList.toggle("is-open");if(panel.classList.contains("is-open")){paintCopy();alignLauncher();alignPanel();try{await ensureThread();await poll()}catch(e){setStatus(currentCopy().error,true)}setTimeout(()=>input.focus(),80)}};
$(".avchat-close").onclick=()=>panel.classList.remove("is-open");
send.onclick=sendMsg;input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg()}});
langSel.onchange=async()=>{state.lang=langSel.value;persist();paintCopy();if(state.thread){try{const oldThread=state.thread;state.thread="";state.lastId=0;state.loaded=false;messages.innerHTML="";empty.style.display="block";await ensureThread();if(oldThread!==state.thread){}await poll()}catch(e){setStatus(currentCopy().error,true)}}};
paintCopy();
placeLauncher();
alignLauncher();
const onChatViewportChange=()=>{placeLauncher();alignLauncher();paintCopy();alignPanel()};
desktopChatMq.addEventListener?.("change",onChatViewportChange);
window.addEventListener("resize",()=>{alignLauncher();if(panel.classList.contains("is-open"))alignPanel()},{passive:true});
window.addEventListener("scroll",()=>{if(desktopChatMq.matches){alignLauncher();if(panel.classList.contains("is-open"))alignPanel()}},{passive:true});
setInterval(()=>{if(state.thread)poll()},panel.classList.contains("is-open")?4000:12000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&state.thread)poll()});
})();