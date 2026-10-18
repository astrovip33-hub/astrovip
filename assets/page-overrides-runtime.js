// Apply only edits saved by the current Studio. Legacy header effects stay retired.
(()=>{
  if(location.pathname.startsWith('/command-center'))return;
  const allowed=new Set(['color','backgroundColor','borderColor','borderWidth','borderStyle','borderRadius','opacity','fontSize','fontWeight','padding','boxShadow','display']);
  function apply(config){
    const path=location.pathname,items=config?.pages?.[path]||config?.pages?.[path.replace(/\/$/,'')+'/']||[];
    for(const item of items){
      if(item?.editorVersion!==2||typeof item.selector!=='string')continue;
      try{
        const element=document.querySelector(item.selector);if(!element)continue;
        if(typeof item.text==='string')element.textContent=item.text;
        for(const [key,value] of Object.entries(item.style||{})){
          if(allowed.has(key)&&typeof value==='string')element.style[key]=value;
        }
      }catch{/* A removed target or an old invalid selector cannot block the page. */}
    }
  }
  window.AstroVipPageOverrides={apply};
  fetch('/assets/site-page-overrides.json',{cache:'no-store'})
    .then(response=>response.ok?response.json():null).then(apply).catch(()=>{});
})();
