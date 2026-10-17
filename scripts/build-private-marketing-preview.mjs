// Build a self-contained private review outside the repository.
// Usage: node scripts/build-private-marketing-preview.mjs REPORT.json OUTPUT.html
// Never commit the generated file or its source research export.
import fs from 'node:fs/promises';
import path from 'node:path';
import esbuild from 'esbuild';
import {parseSnapshot} from '../command-center/v10/snapshot.js';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('Expected input JSON and output HTML paths');
const snapshot=parseSnapshot(await fs.readFile(input,'utf8'));
const root=new URL('../command-center/v10/',import.meta.url);
const html=await fs.readFile(new URL('index.html',root),'utf8');
const css=await fs.readFile(new URL('os.css',root),'utf8');
const bundled=await esbuild.build({entryPoints:[new URL('app.js',root).pathname],bundle:true,write:false,format:'iife',plugins:[{name:'offline-private-review',setup(build){
  build.onLoad({filter:/\/v10\/app\.js$/},async args=>{
    let contents=await fs.readFile(args.path,'utf8');
    if(!contents.includes('const previewOnly=isVisualPreview(location);'))throw Error('Preview source contract changed');
    contents=contents.replace('const previewOnly=isVisualPreview(location);','const previewOnly=true;')
      .replace('if(previewOnly){authenticated=true;',"if(previewOnly){store.importSnapshot(parseSnapshot(JSON.stringify(globalThis.__ASTROVIP_PRIVATE_RESEARCH__)));authenticated=true;")
      .replaceAll('PREVIEW · FĂRĂ DATE','PREVIEW PRIVAT · EXPORT DATAT')
      .replaceAll('Datele private nu sunt încărcate','Export SE Ranking datat · alte surse neconectate')
      .replace("location.assign('/command-center/v10/')","location.assign('https://astrovip.ro/command-center/v10/')");
    return {contents,loader:'js'};
  });
}}]});
const data=JSON.stringify(snapshot).replace(/</g,'\\u003c');
let js=bundled.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
js+=`\ndocument.getElementById('preview-notice').innerHTML='Preview privat · export SE Ranking ${snapshot.capturedDate}. GA4 și Google Business nu sunt conectate în acest fișier. <button id="download-research" class="button" type="button">Descarcă raportul pentru import în V10</button>';
document.getElementById('download-research').onclick=()=>{const blob=new Blob([JSON.stringify(globalThis.__ASTROVIP_PRIVATE_RESEARCH__)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='AstroVip_SE_Ranking_privat.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
document.addEventListener('click',event=>{const a=event.target.closest('a[href]');const href=a?.getAttribute('href');if(href?.startsWith('/')){event.preventDefault();window.open('https://astrovip.ro'+href,'_blank','noopener,noreferrer');}});`;
const page=html.replace('<link rel="stylesheet" href="./os.css">','<style>'+css+'</style>')
  .replace('<script type="module" src="./app.js"></script>','')
  .replace('</body>','<script>globalThis.__ASTROVIP_PRIVATE_RESEARCH__='+data+';\n'+js+'</script></body>');
await fs.mkdir(path.dirname(path.resolve(output)),{recursive:true});await fs.writeFile(output,page);
console.log('Private offline review built. No tokens or provider calls.');
