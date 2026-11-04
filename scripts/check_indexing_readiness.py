from pathlib import Path
import json,xml.etree.ElementTree as ET,re
ROOT=Path(__file__).resolve().parents[1]
base=ROOT/'ascendent-soare-luna'
pages=sorted(base.glob('ascendent-*-soare-*-luna-*/index.html'))
approved=ROOT/'scripts/triplu-profil/approved'
review_files=list(approved.glob('ascendent-*-soare-*-luna-*.json'))
issues=[]
for p in pages:
 s=p.read_text(encoding='utf-8')
 url='https://astrovip.ro/ascendent-soare-luna/'+p.parent.name+'/'
 if f'href="{url}"' not in s:issues.append([p.parent.name,'canonical'])
 if s.count('<h1>')!=1:issues.append([p.parent.name,'h1'])
 if 'name="robots" content="noindex,follow"' not in s and 'name="robots" content="index,follow' not in s:issues.append([p.parent.name,'robots'])
 if '<meta name="description"' not in s:issues.append([p.parent.name,'description'])
 if 'application/ld+json' not in s:issues.append([p.parent.name,'structured_data'])
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
xml=ET.parse(ROOT/'sitemap-ascendent-soare-luna.xml')
urls={node.text for node in xml.findall('.//s:loc',ns)}
indexable=[p for p in pages if 'name="robots" content="index,follow' in p.read_text(encoding='utf-8')]
not_in_sitemap=[p.parent.name for p in indexable if 'https://astrovip.ro/ascendent-soare-luna/'+p.parent.name+'/' not in urls]
report={'total_profiles':len(pages),'indexable_profiles':len(indexable),'noindex_profiles':len(pages)-len(indexable),'approved_review_documents':len(review_files),'sitemap_urls':len(urls),'indexable_profiles_missing_sitemap':not_in_sitemap,'technical_issues':issues[:50],'ready_to_submit_all':len(indexable)==1728 and len(issues)==0 and not not_in_sitemap,'blocking_reason':'1704 generated profiles remain noindex pending substantive editorial review' if len(indexable)!=1728 else None}
(ROOT/'scripts/triplu-profil/indexing-readiness.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
