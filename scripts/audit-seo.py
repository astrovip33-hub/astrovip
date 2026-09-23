"""Read-only SEO audit of repository HTML, sitemap membership and live responses."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import collections, json, urllib.request, urllib.error
import xml.etree.ElementTree as ET

BASE = "https://astrovip.ro"
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.canonical=[]; self.robots=[]; self.links=[]; self.schemas=[]
        self.ld=False; self.buf=""
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=="link" and "canonical" in a.get("rel","").split(): self.canonical.append(a.get("href",""))
        if tag=="meta" and a.get("name","").lower() in ("robots","googlebot"): self.robots.append(a.get("content",""))
        if tag=="a": self.links.append(a.get("href",""))
        if tag=="script" and a.get("type")=="application/ld+json": self.ld=True; self.buf=""
    def handle_data(self,data):
        if self.ld: self.buf+=data
    def handle_endtag(self,tag):
        if tag=="script" and self.ld:
            try: self.schemas.append(json.loads(self.buf))
            except Exception: self.schemas.append({"invalid_json":True})
            self.ld=False

def nodes(obj):
    if isinstance(obj,dict):
        yield obj
        for v in obj.values(): yield from nodes(v)
    elif isinstance(obj,list):
        for v in obj: yield from nodes(v)

pages={}
issues=collections.defaultdict(list)
for path in sorted(Path(".").rglob("*.html")):
    if ".git" in path.parts: continue
    rel=path.as_posix()
    url=BASE+("/" if rel=="index.html" else "/"+rel[:-10] if rel.endswith("/index.html") else "/"+rel)
    page=Page(path.read_text(encoding="utf-8"))
    pages[url]=page
    for obj in nodes(page.schemas):
        typ=obj.get("@type",[])
        if isinstance(typ,str): typ=[typ]
        if any(t in typ for t in ("Article","BlogPosting","NewsArticle")):
            for key in ("image","datePublished"):
                if not obj.get(key): issues["schema_missing_"+key].append(url)
        if "Organization" in typ and not obj.get("logo") and obj.get("name")=="AstroVip":
            issues["schema_missing_Organization_logo"].append(url)
    if any(x.get("invalid_json") for x in page.schemas if isinstance(x,dict)): issues["invalid_json_ld"].append(url)
    if any("salut-lume" in x for x in page.links): issues["legacy_internal_links"].append(url)

sitemap_counts={}
all_urls=[]
for path in sorted(Path(".").glob("sitemap*.xml")):
    root=ET.parse(path).getroot()
    if root.tag.endswith("sitemapindex"): continue
    urls=[(x.text or "").strip() for x in root.findall("{*}url/{*}loc")]
    sitemap_counts[path.name]=len(urls)
    all_urls+=urls
    for url in urls:
        if urlsplit(url).netloc!="astrovip.ro" or urlsplit(url).scheme!="https" or urlsplit(url).query or urlsplit(url).fragment:
            issues["sitemap_noncanonical_format"].append(url)
        page=pages.get(url)
        if page is None:
            issues["sitemap_no_matching_html"].append(url); continue
        if any("noindex" in x.lower() for x in page.robots): issues["sitemap_noindex"].append(url)
        if page.canonical!=[url]: issues["sitemap_canonical_mismatch"].append({"url":url,"canonical":page.canonical})
counter=collections.Counter(all_urls)
issues["duplicate_sitemap_urls"]=[u for u,c in counter.items() if c>1]
for u,p in pages.items():
    if p.canonical==[u] and not any("noindex" in x.lower() for x in p.robots) and u not in counter:
        issues["indexable_not_in_sitemap"].append(u)
report={"html_pages":len(pages),"sitemaps":sitemap_counts,"unique_sitemap_urls":len(counter),
        "issues":{k:{"count":len(v),"examples":v[:12]} for k,v in issues.items()}}
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs): return None
opener=urllib.request.build_opener(NoRedirect)
report["live"]=[]
for host,path in [
("www.astrovip.ro","/harta-natala/?seo_probe=1&check=path"),
("astrovip.ro","/harta-natala"),("astrovip.ro","/harta-natala/"),
("astrovip.ro","/relocare-geografica/"),("astrovip.ro","/sinastrie-calculator/"),
("astrovip.ro","/astrocartografie/"),("astrovip.ro","/index.php/2025/12/06/salut-lume/")]:
    url="https://"+host+path
    try:
        try: response=opener.open(urllib.request.Request(url,headers={"User-Agent":"AstroVip-SEO-Audit/1.0"}),timeout=30)
        except urllib.error.HTTPError as e: response=e
        with response:
            row={"url":url,"status":response.code,"location":response.headers.get("Location"),
                 "x_robots_tag":response.headers.get("X-Robots-Tag")}
            if response.code==200:
                p=Page(response.read().decode("utf-8"))
                row.update(robots=p.robots,canonical=p.canonical)
            report["live"].append(row)
    except Exception as e: report["live"].append({"url":url,"error":str(e)})
Path("seo-audit-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
