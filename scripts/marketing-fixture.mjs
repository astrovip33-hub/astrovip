// Synthetic QA-only records. No customer exports or private research are included.
export default {
  version:1,provider:'SE Ranking',capturedDate:'2026-10-17',market:'RO',
  rankContext:'Synthetic QA fixture; no live rank claims',limitations:['Synthetic QA fixture'],
  counts:{files:2,csv:2,exportedRows:4,uniqueKeywords:2,displayKeywords:2,serpQueries:2,referringDomainGapRows:1},
  keywords:[{keyword:'numerologie',volume:100,difficulty:10,cpc:.1,intent:'I',position:null,url:null,gap:true,sources:['qa-keywords.csv']},{keyword:'consultație astrologică',volume:50,difficulty:20,cpc:.2,intent:'C',position:null,url:null,gap:false,sources:['qa-keywords.csv']}],
  serps:[{query:'astrolog',url:'https://example.com/astrolog',title:'QA page',position:1,referringDomains:1,source:'qa-serp.csv'},{query:'numerologie',url:'https://example.com/numerologie',title:'QA page',position:1,referringDomains:1,source:'qa-serp.csv'}],
  competitors:[{domain:'example.com',trust:50,keywords:10,trafficEstimate:100,source:'qa-competitors.csv'}],
  authority:[{domain:'example.org',trust:70,backlinks:1,competitors:['example.com'],source:'qa-authority.csv'}],
  manifest:[{file:'qa-keywords.csv',bytes:100,sha256:'0'.repeat(64),rows:2,status:'parsed'},{file:'qa-serp.csv',bytes:100,sha256:'1'.repeat(64),rows:2,status:'parsed'}],
};
