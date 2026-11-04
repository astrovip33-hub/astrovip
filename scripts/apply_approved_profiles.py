from pathlib import Path
import sys,json,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts/triplu-profil'))
from review_gate import load_promotions,render_reviewed_profile
approved=load_promotions()
base=ROOT/'ascendent-soare-luna'
ns='http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('',ns)
tree=ET.parse(ROOT/'sitemap-ascendent-soare-luna.xml')
existing={e.text for e in tree.findall('.//{'+ns+'}loc')}
changed=[]
for slug,item in approved.items():
 path=base/slug/'index.html'
 content=path.read_text(encoding='utf-8')
 if 'name="robots" content="noindex,follow"' in content:
  content=render_reviewed_profile(content,item)
  path.write_text(content,encoding='utf-8')
  changed.append(slug)
 elif 'name="robots" content="index,follow' not in content:
  raise ValueError('Invalid robots: '+slug)
 url='https://astrovip.ro/ascendent-soare-luna/'+slug+'/'
 if url not in existing:
  node=ET.SubElement(tree.getroot(),'{'+ns+'}url')
  ET.SubElement(node,'{'+ns+'}loc').text=url
  existing.add(url)
if changed:
 tree.write(ROOT/'sitemap-ascendent-soare-luna.xml',encoding='utf-8',xml_declaration=True)
 manifest=ROOT/'scripts/triplu-profil/manifest.json'
 data=json.loads(manifest.read_text(encoding='utf-8'))
 data.update(approved_indexable_profiles=len(approved),automated_noindex_profiles=1704-len(approved),sitemap_urls=len(existing))
 manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'promoted_html':len(changed),'total_approved':len(approved),'sitemap_urls':len(existing)}))
