// Same-origin tools share the V11 session and return navigation to its shell.
(()=>{
  if(window.top===window)return;
  const origin=location.origin;
  const endSession=()=>window.top.postMessage({type:'avcc:session-ended'},origin);
  addEventListener('avcc:session-ended',endSession);
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link||link.target==='_blank'||event.ctrlKey||event.metaKey)return;
    const url=new URL(link.href,location.href);
    if(url.origin===origin&&/^\/command-center(?:\/|$)/.test(url.pathname)){
      event.preventDefault();window.top.postMessage({type:'avcc:navigate',href:url.href},origin);
    }
  });
  addEventListener('message',event=>{
    if(event.origin!==origin||event.source!==window.parent||event.data?.type!=='avcc:refresh')return;
    if(typeof window.runPreflight==='function')window.runPreflight();
    else if(typeof window.refreshAll==='function')window.refreshAll(true);
    else if(typeof window.refresh==='function')window.refresh();
  });
})();
