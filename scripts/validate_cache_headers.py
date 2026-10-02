import json,time,urllib.request
from pathlib import Path
base="http://127.0.0.1:8767"
for attempt in range(60):
    try:
        with urllib.request.urlopen(base+"/",timeout=2) as response:
            if response.status==200: break
    except Exception:
        time.sleep(2)
else:
    print(Path("/tmp/astrovip-wrangler.log").read_text())
    raise SystemExit("Local Worker did not start")
cases={
    "/": ("max-age=0","must-revalidate"),
    "/assets/optimized-20261003/homepage-base.css": ("max-age=31536000","immutable"),
    "/assets/optimized-20261003/homepage-final.css": ("max-age=31536000","immutable"),
    "/assets/homepage.js": ("max-age=3600","must-revalidate"),
    "/assets/site-editor-config.json": ("no-store",),
    "/sitemap-core.xml": ("max-age=3600",),
}
results={}
for path, expected in cases.items():
    with urllib.request.urlopen(base+path) as r:
        value=r.headers.get("Cache-Control","")
        assert all(item in value for item in expected),(path,value,expected)
        assert value.count("max-age=")<=1,(path,value)
        results[path]=value
Path("validation-output/cache.json").write_text(json.dumps(results,indent=2))
print("PASS local Cloudflare headers: "+json.dumps(results))
