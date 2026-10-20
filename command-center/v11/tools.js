export const TOOLS=Object.freeze({
  studio:{path:'/command-center/site-builder/',title:'Site Studio V11'},
  connections:{path:'/command-center/connections/',title:'Conexiuni V11'},
  google:{path:'/command-center/google/',title:'Acces Google V11'},
  operations:{path:'/command-center/operations/',title:'Publicare, backup și recuperare V11'},
});
export function toolTarget(value,origin){
  const url=new URL(value,origin);
  if(url.origin!==origin)return null;
  if(url.pathname==='/command-center/'||url.pathname==='/command-center')return {module:url.hash.slice(1)||'cockpit',search:url.search};
  const id=Object.keys(TOOLS).find(id=>TOOLS[id].path===url.pathname||TOOLS[id].path.slice(0,-1)===url.pathname);
  if(id)return {module:id,search:url.search};
  if(/^\/command-center\/editor(?:-original)?\/?$/.test(url.pathname))return {module:'studio',search:''};
  return null;
}
export function toolUrl(id,search=''){
  if(!Object.hasOwn(TOOLS,id))throw Error('Unknown tool');
  const query=new URLSearchParams();query.set('embedded','1');
  const input=new URLSearchParams(search);
  for(const key of ['focus','connected','error'])if(input.has(key))query.set(key,input.get(key));
  return TOOLS[id].path+'?'+query;
}
