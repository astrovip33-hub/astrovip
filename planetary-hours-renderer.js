import {DEFAULT_PLACE,planetarySnapshot,answerHTML,tableHTML,dateLabel,timeLabel,GLYPHS,MEANINGS,escapeHTML,midnight,addDays} from './assets/planetary-hours-core.mjs';

export function renderPlanetaryHoursHTML(html, now=new Date()) {
  const data=planetarySnapshot(now);
  if(!data) return html;
  const {current,next,place}=data;
  const text=(id,value)=>{html=html.replace(new RegExp(`(<[^>]+\\bid="${id}"[^>]*>)[\\s\\S]*?(</(?:p|span|h2|div)>)`),(_,open,close)=>open+value+close);};
  html=html.replace(/<h1>[\s\S]*?<\/h1>/,'<h1>Ore planetare azi, '+escapeHTML(dateLabel(data.civilDay))+'</h1>');
  text('planetary-answer',answerHTML(data));
  text('sunrise',escapeHTML(timeLabel(data.sunrise)));
  text('sunset',escapeHTML(timeLabel(data.sunset)));
  text('nowPlanet',GLYPHS[current.planet]+' '+current.planet);
  text('nowRange',escapeHTML(timeLabel(current.start)+' – '+timeLabel(current.end)+' · '+current.kind));
  text('nowMeaning',escapeHTML(MEANINGS[current.planet]));
  text('nextHour',next?GLYPHS[next.planet]+' '+next.planet+' · '+escapeHTML(timeLabel(next.start)):'—');
  text('duration',Math.round((current.end-current.start)/60000)+' min');
  text('place',`Calcul pentru București · ${escapeHTML(place.timeZone)}. Ziua planetară începe la răsăritul din ${escapeHTML(dateLabel(data.day))}. Coordonatele dispozitivului sunt folosite doar local în browser.`);
  html=html.replace(/(<table\b[^>]*id="hours"[^>]*>)[\s\S]*?(<\/table>)/,(_,open,close)=>open+tableHTML(data)+close);
  html=html.replace(/(<html\b[^>]*)(>)/,(_,open,close)=>open.replace(/ data-planetary-date="[^"]*"/,'')+' data-planetary-date="'+data.civilDay+'"'+close);
  return html;
}
export async function planetaryHoursResponse(response,now=new Date()) {
  if(!response.ok) return response;
  const data=planetarySnapshot(now);
  if(!data) return response;
  const headers=new Headers(response.headers);
  for(const key of ['etag','last-modified','content-length','content-encoding']) headers.delete(key);
  const ttl=Math.max(0,Math.min(60,Math.floor((data.current.end-now)/1000),Math.floor((midnight(addDays(data.civilDay,1),DEFAULT_PLACE.timeZone)-now)/1000)));
  headers.set('cache-control',`public, max-age=${ttl}, s-maxage=${ttl}, must-revalidate`);
  headers.set('x-astrovip-planetary-date',data.civilDay);
  return new Response(renderPlanetaryHoursHTML(await response.text(),now),{status:response.status,statusText:response.statusText,headers});
}
