import {readFile, writeFile} from 'node:fs/promises';
import {renderHoroscopeHTML,renderHoroscopeSitemap} from '../horoscop-renderer.js';
import {SLUGS} from '../assets/horoscop-core-20261021.mjs';
const now=new Date();
for(const slug of ['',...SLUGS]){
 const path='/horoscop-azi/'+(slug?slug+'/':'');
 const file='.'+path+'index.html';
 await writeFile(file,renderHoroscopeHTML(await readFile(file,'utf8'),path,now),'utf8');
}
const sitemap='sitemap-core.xml';
await writeFile(sitemap,renderHoroscopeSitemap(await readFile(sitemap,'utf8'),now),'utf8');
console.log('Horoscop: 13 pages contain daily text without JavaScript.');
