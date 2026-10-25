import {readFile,writeFile} from 'node:fs/promises';
import {renderPlanetaryHoursHTML} from '../planetary-hours-renderer.js';
const path='ore-planetare/index.html';
await writeFile(path,renderPlanetaryHoursHTML(await readFile(path,'utf8')),'utf8');
console.log('Ore planetare: răspuns datat și 24 de intervale în HTML.');
