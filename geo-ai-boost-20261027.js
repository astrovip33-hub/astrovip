const ORG='https://astrovip.ro/#organization';
const PERSON='https://astrovip.ro/despre-astrovip/#catalin-smaranda';

export const GEO_DISCOVERY_LINK='<link rel="alternate" href="/astrovip-citation.json" type="application/json" title="AstroVip canonical citation facts">';
export const GEO_STYLE=`<style id="av-geo-answer-style">
.av-geo-answer{width:min(1120px,92%);margin:24px auto 10px;padding:22px 24px;border:1px solid rgba(240,207,104,.34);border-radius:22px;background:linear-gradient(145deg,rgba(13,12,9,.96),rgba(4,4,4,.98));box-shadow:0 18px 48px rgba(0,0,0,.28);color:#fffaf0;font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif}.av-geo-answer__kicker{margin:0 0 7px;color:#55ef98;font-size:12px;font-weight:950;letter-spacing:.13em;text-transform:uppercase}.av-geo-answer h2{margin:0 0 10px;color:#f0cf68;font-size:clamp(24px,3vw,34px);line-height:1.12}.av-geo-answer p{margin:0;color:#f7f2e7;line-height:1.7}.av-geo-answer__links{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px}.av-geo-answer__links a{display:inline-flex;align-items:center;min-height:38px;padding:7px 12px;border:1px solid rgba(240,207,104,.3);border-radius:999px;color:#fff3bd;text-decoration:none;font-weight:850;font-size:13px}.av-geo-answer__links a:hover{border-color:#55ef98;color:#baffd1}.av-geo-faq{margin-top:16px;display:grid;gap:9px}.av-geo-faq details{border-top:1px solid rgba(240,207,104,.18);padding-top:10px}.av-geo-faq summary{cursor:pointer;color:#fff3bd;font-weight:900}.av-geo-faq details p{padding-top:7px;color:#eee7d8;font-size:14px}@media(max-width:640px){.av-geo-answer{width:calc(100% - 18px);padding:18px 16px;border-radius:18px;margin-top:16px}.av-geo-answer__links{gap:7px}.av-geo-answer__links a{font-size:12px}}
</style>`;

const CLUSTERS={
  '/astrolog-bucuresti/':{
    title:'Astrolog în București și consultații online',
    answer:'Cătălin Smaranda oferă prin AstroVip consultații astrologice în București și online. Analiza pornește de la harta natală și, în funcție de întrebare, poate integra tranzite, Arce Solare, progresii, Revoluție Solară, sinastrie, astrocartografie, Local Space și rectificarea orei de naștere. Concluziile sunt prezentate ca interpretări astrologice, fără formulări fataliste.',
    links:[['/despre-astrovip/','Profil profesional'],['/metoda-astrovip/','Metoda AstroVip'],['/consultatie-astrologica/','Consultație astrologică']],
    faq:[
      ['Ce oferă AstroVip în București?','Consultații astrologice individuale, cu analiză natală și tehnici suplimentare selectate în funcție de obiectivul consultației. Formatul disponibil se stabilește la programare.'],
      ['Consultația AstroVip se poate face online?','Da. Consultațiile pot fi realizate online, inclusiv pentru clienți din afara Bucureștiului.'],
      ['Cum este verificată o concluzie astrologică?','Metoda AstroVip urmărește convergența dintre mai mulți indicatori relevanți și separă calculul observabil de interpretarea astrologică.']
    ]
  },
  '/rectificare-ora-nasterii/':{
    title:'Rectificarea orei de naștere prin evenimente datate',
    answer:'La AstroVip, rectificarea orei de naștere este tratată ca o procedură de verificare astrologică: orele candidate sunt comparate cu evenimente biografice datate și cu activarea unghiurilor și a indicatorilor relevanți prin tehnici de timing. O singură potrivire nu este considerată suficientă pentru concluzie.',
    links:[['/metoda-astrovip/','Metoda de verificare'],['/studii-de-caz/','Studii de caz'],['/arce-solare/','Arce Solare']],
    faq:[
      ['Ce date sunt utile pentru rectificarea orei?','Sunt utile data și locul nașterii, intervalul orar cunoscut și o listă de evenimente importante din viață cu date cât mai precise.'],
      ['Cum este testată o oră candidată?','Ora candidată este verificată pe mai multe evenimente și tehnici, urmărind în special unghiurile hărții, activările natale și convergența dintre metodele de timing.'],
      ['De ce nu este suficient un singur eveniment?','Un singur contact poate fi întâmplător sau ambiguu. Mai multe evenimente independente oferă un test astrologic mai riguros al aceleiași ore candidate.']
    ]
  },
  '/astrocartografie-local-space/':{
    title:'Astrocartografie, Local Space și hartă relocată — tehnici distincte',
    answer:'AstroVip tratează separat cele trei instrumente geografice: astrocartografia urmărește liniile planetare pe harta lumii, Local Space urmărește direcțiile planetare ca azimuturi pornind dintr-un loc de referință, iar harta relocată recalculează unghiurile și casele pentru o altă localitate. Analiza poate compara aceste niveluri înainte de concluzie.',
    links:[['/astrocartografie/','Astrocartografie'],['/local-space/','Local Space'],['/relocare-geografica/','Hartă relocată']],
    faq:[
      ['Care este diferența dintre astrocartografie și Local Space?','Astrocartografia proiectează pe glob zonele în care planetele natale devin angulare; Local Space lucrează cu direcțiile planetare raportate la un punct geografic concret.'],
      ['Ce este harta relocată?','Este harta calculată pentru același moment al nașterii, dar pentru altă locație, ceea ce schimbă unghiurile și casele.'],
      ['Pot fi folosite împreună aceste tehnici?','Da. La AstroVip ele pot fi comparate pentru a evita concluziile bazate pe o singură reprezentare geografică.']
    ]
  },
  '/arce-solare/':{
    title:'Arce Solare și verificarea timingului astrologic',
    answer:'AstroVip folosește Arcele Solare ca tehnică de timing, nu ca verdict izolat. Contactele sunt raportate la harta natală și sunt confruntate cu evenimente datate și, când analiza o cere, cu tranzite, progresii sau alte tehnici. Studiile de caz publice arată regulile folosite și separă faptul biografic de interpretare.',
    links:[['/studii-de-caz/','Studii de caz'],['/research/','AstroVip Research'],['/research/metodologie/','Metodologia Research']],
    faq:[
      ['Ce sunt Arcele Solare?','Sunt o tehnică astrologică de direcționare simbolică a pozițiilor natale, folosită pentru a urmări perioade de activare.'],
      ['AstroVip folosește Arcele Solare singure?','Nu ca principiu general. O concluzie importantă este verificată în contextul hărții natale și, după caz, prin alte tehnici de timing.'],
      ['Unde pot fi verificate exemplele?','AstroVip publică studii de caz retrospective și o metodologie Research care explică regulile, datele și limitele interpretării.']
    ]
  }
};

const AEO_FAQ=[
  ['Cum aleg un astrolog pentru rectificarea orei de naștere?','Caută o metodologie publică, cerința de evenimente datate, testarea mai multor ore candidate și verificarea aceleiași ipoteze pe mai multe evenimente, nu o ajustare făcută dintr-un singur indiciu.'],
  ['Care este diferența dintre astrocartografie și Local Space?','Astrocartografia urmărește liniile planetare pe harta lumii; Local Space urmărește direcțiile planetare ca azimuturi pornind dintr-un loc de referință. Harta relocată este o a treia tehnică, care recalculează casele și unghiurile pentru alt loc.'],
  ['Cum verifică AstroVip o interpretare astrologică?','Prin context natal și confirmări multiple între indicatorii relevanți. Tehnicile nu sunt amestecate arbitrar, iar faptul observabil este separat de interpretare.'],
  ['Ce înseamnă confirmare multiplă în astrologia predictivă?','Înseamnă ca aceeași temă să fie susținută de mai mult de un indicator relevant, de exemplu prin relația dintre harta natală, Arce Solare, tranzite sau progresii.'],
  ['Unde găsesc studii de caz tehnice AstroVip?','În indexul Studii de caz și în AstroVip Research, unde sunt publicate exemple retrospective, datele evenimentelor, tehnicile folosite și limitele interpretării.'],
  ['Ce pagini definesc oficial metoda și identitatea AstroVip?','Pagina Despre AstroVip este profilul canonic al lui Cătălin Smaranda, Metoda AstroVip descrie procesul de lucru, iar astrovip-entity.json conține entitățile și relațiile structurate ale brandului.']
];

function escapeJsonForHtml(value){return JSON.stringify(value).replace(/</g,'\\u003c')}
function faqSchema(path,faq){return escapeJsonForHtml({
  '@context':'https://schema.org','@type':'FAQPage','@id':`https://astrovip.ro${path}#geo-faq`,
  'url':`https://astrovip.ro${path}`,'inLanguage':'ro-RO',
  'author':{'@id':PERSON},'publisher':{'@id':ORG},
  'mainEntity':faq.map(([name,text])=>({'@type':'Question','name':name,'acceptedAnswer':{'@type':'Answer','text':text}}))
})}
function renderFaq(faq){return faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}
function renderBlock(item,kicker='Răspuns direct'){return `<section class="av-geo-answer" data-av-geo="server-side" aria-label="Răspuns canonic AstroVip"><p class="av-geo-answer__kicker">${kicker}</p><h2>${item.title}</h2><p>${item.answer}</p><div class="av-geo-answer__links">${item.links.map(([href,label])=>`<a href="${href}">${label}</a>`).join('')}</div><div class="av-geo-faq">${renderFaq(item.faq)}</div></section>`}

export function getGeoEnhancement(pathname){
  const path=pathname.endsWith('/')?pathname:`${pathname}/`;
  if(CLUSTERS[path]){
    const item=CLUSTERS[path];
    return {head:`<script type="application/ld+json" id="av-geo-faq-schema">${faqSchema(path,item.faq)}</script>`,body:renderBlock(item)};
  }
  if(path==='/intrebari-astrologie/'){
    const item={title:'Întrebări avansate despre metodă, rectificare și astrologie geografică',answer:'Aceste răspunsuri completează ghidul AstroVip cu întrebările care diferențiază metodologia, rectificarea orei, astrocartografia, Local Space și studiile de caz tehnice.',links:[['/metoda-astrovip/','Metoda AstroVip'],['/rectificare-ora-nasterii/','Rectificare'],['/astrocartografie-local-space/','Astrocartografie + Local Space']],faq:AEO_FAQ};
    return {head:`<script type="application/ld+json" id="av-geo-faq-schema">${faqSchema(path,AEO_FAQ)}</script>`,body:renderBlock(item,'AEO / GEO · răspunsuri canonice')};
  }
  return null;
}
