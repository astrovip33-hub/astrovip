from pathlib import Path
from collections import Counter,defaultdict
from html.parser import HTMLParser
import json,re,statistics
root=Path(__file__).resolve().parents[1]
pages=sorted((root/'ascendent-soare-luna').glob('ascendent-*-soare-*-luna-*/index.html'))
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.inp=False;self.buf='';self.paras=[]
 def handle_starttag(self,t,a):
  if t=='p':self.inp=True;self.buf=''
 def handle_data(self,d):
  if self.inp:self.buf+=d
 def handle_endtag(self,t):
  if t=='p' and self.inp:
   if len(self.buf.split())>=18:self.paras.append(' '.join(self.buf.lower().split()))
   self.inp=False
paragraphs=defaultdict(list); lengths=[]; sections=Counter()
for f in pages:
 p=Parser();p.feed(f.read_text(encoding='utf-8'))
 lengths.append(sum(len(x.split()) for x in p.paras))
 for x in set(p.paras):paragraphs[x].append(f.parent.name)
duplicates=sorted(((len(v),len(k.split()),k[:110]) for k,v in paragraphs.items() if len(v)>1),reverse=True)
report={'pages':len(pages),'mean_paragraph_words':round(statistics.mean(lengths),1),'minimum_paragraph_words':min(lengths),'maximum_paragraph_words':max(lengths),'distinct_paragraphs':len(paragraphs),'repeated_paragraphs':len(duplicates),'repeated_paragraph_instances':sum(n for n,_,_ in duplicates),'top_repeated_paragraphs':duplicates[:12],'editorial_approved_new_profiles':0,'decision':'Do not remove noindex without substantive profile-specific review'}
out=root/'scripts/triplu-profil/editorial-qa-report.json'
out.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
