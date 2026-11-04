from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import csv,re
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'ascendent-soare-luna'
OUT=ROOT/'scripts/triplu-profil/editorial-review-queue.csv'
class P(HTMLParser):
 def __init__(self):super().__init__();self.active=False;self.buf='';self.paragraphs=[]
 def handle_starttag(self,t,a):
  if t=='p':self.active=True;self.buf=''
 def handle_data(self,d):
  if self.active:self.buf+=d
 def handle_endtag(self,t):
  if t=='p' and self.active:
   x=' '.join(self.buf.lower().split())
   if len(x.split())>=18:self.paragraphs.append(x)
   self.active=False
records=[]
for f in sorted(BASE.glob('ascendent-*-soare-*-luna-*/index.html')):
 s=f.read_text(encoding='utf-8')
 if 'name="robots" content="noindex,follow"' not in s:continue
 p=P();p.feed(s)
 records.append((f.parent.name,p.paragraphs))
freq=Counter(x for _,ps in records for x in set(ps))
scores=[]
for slug,ps in records:
 repeated=[x for x in ps if freq[x]>1]
 repetitive_words=sum(len(x.split()) for x in repeated)
 total_words=sum(len(x.split()) for x in ps)
 scores.append((slug,len(ps),len(repeated),repetitive_words,total_words,round(repetitive_words/max(1,total_words)*100,1)))
scores.sort(key=lambda x:(-x[-1],x[0]))
OUT.parent.mkdir(parents=True,exist_ok=True)
with OUT.open('w',encoding='utf-8-sig',newline='') as fh:
 w=csv.writer(fh);w.writerow(['slug','paragraphs','repeated_paragraphs','repeated_words','total_paragraph_words','repeated_word_percent']);w.writerows(scores)
print('queue',len(scores),'top5',scores[:5],'output',OUT)
