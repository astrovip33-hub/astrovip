const ROOT='/command-center/';
const TOOLS=new Map([
  ['site-builder','studio'],['editor','studio'],['editor-original','studio'],
  ['connections','connections'],['google','google'],['operations','operations'],
]);
const ASSETS=new Set(['app.js','sources.js','intelligence.js','rooms.js','workflows.js','snapshot.js','os.css']);

// Preserve saved bookmarks while exposing a single Command Center.
export function commandCenterRedirect(url){
  const path=url.pathname.replace(/\/index\.html$/,'/').replace(/\/$/,'');
  if(url.pathname==='/command-center'||url.pathname==='/command-center/index.html')return ROOT+url.search;
  if(/^\/command-center\/v(?:3|9|10|11)$/.test(path))return ROOT+url.search;
  const legacy=url.pathname.match(/^\/command-center\/v10\/([^/]+)$/);
  if(legacy&&ASSETS.has(legacy[1]))return ROOT+'v11/'+legacy[1]+url.search;
  const tool=path.match(/^\/command-center\/([^/]+)$/)?.[1];
  if(TOOLS.has(tool)&&url.searchParams.get('embedded')!=='1'){
    const params=new URLSearchParams();
    for(const key of ['focus','connected','error'])if(url.searchParams.has(key))params.set(key,url.searchParams.get(key));
    return ROOT+(params.size?'?'+params:'')+'#'+TOOLS.get(tool);
  }
  return null;
}
