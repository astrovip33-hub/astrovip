// Read-only WORK 02/04 adapters. Provider credentials stay in the Worker.
export const MONEY_EVENTS = Object.freeze({
  whatsapp_click: {label:'Click WhatsApp', stage:'interaction'},
  phone_click: {label:'Click telefon', stage:'interaction'},
  booking_start: {label:'Început programare', stage:'intent'},
  generate_lead: {label:'Formular pregătit pentru WhatsApp', stage:'intent'},
  astro_free_question_lead_saved: {label:'Întrebare gratuită salvată', stage:'lead'},
  booking_complete: {label:'Eveniment programare finalizată', stage:'conversion'},
  purchase: {label:'Achiziție înregistrată', stage:'purchase'},
});

function rows(report) {
  const dimensions=(report.dimensionHeaders||[]).map(h=>h.name);
  const metrics=(report.metricHeaders||[]).map(h=>h.name);
  return (report.rows||[]).map(row=>Object.fromEntries([
    ...dimensions.map((name,i)=>[name,row.dimensionValues?.[i]?.value||'']),
    ...metrics.map((name,i)=>{const value=row.metricValues?.[i]?.value;return [name,value!==undefined&&value!==''&&Number.isFinite(Number(value))?Number(value):null];}),
  ]));
}
function reportInfo(report,limit) {
  return {rowCount:report.rowCount??null,truncated:Number(report.rowCount)>limit,currency:report.metadata?.currencyCode||null,timeZone:report.metadata?.timeZone||null,thresholded:Boolean(report.metadata?.subjectToThresholding),otherRow:Boolean(report.metadata?.dataLossFromOtherRow),sampled:Boolean(report.metadata?.samplingMetadatas?.length)};
}
export async function moneyReport(runReport,propertyId) {
  const eventFilter={filter:{fieldName:'eventName',inListFilter:{values:Object.keys(MONEY_EVENTS),caseSensitive:true}}};
  const specs=[
    {key:'events',limit:50,dimensions:['eventName'],metrics:['eventCount'],filter:eventFilter},
    {key:'channels',limit:200,dimensions:['sessionSourceMedium','eventName'],metrics:['eventCount','totalRevenue'],filter:eventFilter},
    {key:'services',limit:100,dimensions:['itemName'],metrics:['itemsPurchased','itemRevenue']},
  ];
  const results=await Promise.allSettled(specs.map(spec=>runReport({
    dateRanges:[{startDate:'28daysAgo',endDate:'yesterday'}],
    dimensions:spec.dimensions.map(name=>({name})),metrics:spec.metrics.map(name=>({name})),
    ...(spec.filter?{dimensionFilter:spec.filter}:{}),
    orderBys:[{metric:{metricName:spec.metrics.at(-1)},desc:true}],limit:spec.limit,
  })));
  const out={ok:false,propertyId,period:'28daysAgo..yesterday',checkedAt:new Date().toISOString(),attribution:'sessionSourceMedium',reports:{}};
  results.forEach((result,i)=>{
    const spec=specs[i];
    if(result.status==='rejected'){out.reports[spec.key]={status:'unavailable',rows:null};return;}
    out.ok=true;
    out.reports[spec.key]={status:'ready',rows:rows(result.value),...reportInfo(result.value,spec.limit)};
  });
  out.definitions=MONEY_EVENTS;
  return out;
}

const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export async function localReport(locationId,headers,getJson) {
  // The configured location is always used. No account or location is auto-selected.
  const id=String(locationId||'').replace(/^.*locations\//,'');
  if(!/^\d+$/.test(id))throw Error('google_business_location_required');
  const profile=await getJson(`https://mybusinessbusinessinformation.googleapis.com/v1/locations/${id}?readMask=name,title,websiteUri,storefrontAddress,metadata`,headers);
  const address=profile.storefrontAddress||{};
  const addressText=[...(address.addressLines||[]),address.locality].filter(Boolean).join(', ');
  let brand=false;
  try{brand=new URL(profile.websiteUri).hostname.replace(/^www\./,'')==='astrovip.ro';}catch{}
  const matches=brand&&/unirii/.test(fold(addressText))&&/\b33\b/.test(addressText)&&/bucuresti|bucharest/.test(fold(addressText));
  if(!matches)throw Error('google_business_unirii33_verification_required');
  const result={ok:true,checkedAt:new Date().toISOString(),profile:{name:profile.name,title:profile.title,website:profile.websiteUri,address:addressText},reviews:{status:'unavailable',count:null,rating:null},mapsRank:null};
  // Review API requires an account-scoped parent. A bare location ID is sufficient
  // for the profile but must never be used to guess a review account.
  const parent=String(locationId||'');
  if(/^accounts\/\d+\/locations\/\d+$/.test(parent)){
    try{
      const reviews=await getJson(`https://mybusiness.googleapis.com/v4/${parent}/reviews?pageSize=1`,headers);
      result.reviews={status:'ready',count:Number.isInteger(reviews.totalReviewCount)&&reviews.totalReviewCount>=0?reviews.totalReviewCount:null,rating:Number.isFinite(reviews.averageRating)?reviews.averageRating:null};
    }catch{/* A profile read is not proof that review access is authorized. */}
  }
  return result;
}
