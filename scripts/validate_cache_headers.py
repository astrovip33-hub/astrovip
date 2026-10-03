"""Exercise _headers using isolated, real Cloudflare static assets; no cloud deployment."""
import json, os, shutil, signal, subprocess, tempfile, time, urllib.request
from pathlib import Path
fixture=Path(tempfile.mkdtemp(prefix="astrovip-cache-"))
public=fixture/"public"
files=["index.html","_headers","sitemap-core.xml",
       "assets/optimized-20261003/homepage-base.css",
       "assets/optimized-20261003/homepage-final.css",
       "assets/homepage.js","assets/site-editor-config.json"]
for name in files:
    dest=public/name
    dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(name,dest)
config=fixture/"wrangler.json"
config.write_text(json.dumps({"name":"astrovip-cache-validation","compatibility_date":"2026-09-15",
    "assets":{"directory":"./public","html_handling":"auto-trailing-slash","not_found_handling":"none"}}))
log_path=Path("validation-output/cache-runtime.log")
base="http://127.0.0.1:8767"
with log_path.open("w") as log:
    proc=subprocess.Popen(["npx","--yes","wrangler@4.147.0","dev","--local","--ip","127.0.0.1","--port","8767","--config",str(config)],stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
    try:
        deadline=time.monotonic()+100
        while time.monotonic()<deadline:
            try:
                with urllib.request.urlopen(base+"/",timeout=2) as r:
                    if r.status==200: break
            except Exception: time.sleep(1)
        else:
            print(log_path.read_text())
            raise SystemExit("Isolated local asset server did not start")
        cases={
            "/":("max-age=0","must-revalidate"),
            "/assets/optimized-20261003/homepage-base.css":("max-age=31536000","immutable"),
            "/assets/optimized-20261003/homepage-final.css":("max-age=31536000","immutable"),
            "/assets/homepage.js":("max-age=3600","must-revalidate"),
            "/assets/site-editor-config.json":("no-store",),
            "/sitemap-core.xml":("max-age=3600",),
        }
        results={}
        for path, expected in cases.items():
            with urllib.request.urlopen(base+path,timeout=10) as r:
                value=r.headers.get("Cache-Control","")
                assert all(item in value for item in expected),(path,value,expected)
                assert value.count("max-age=")<=1,(path,value)
                results[path]=value
                print("CACHE "+path+" "+value,flush=True)
        Path("validation-output/cache.json").write_text(json.dumps(results,indent=2))
        print("PASS local Cloudflare headers")
    finally:
        os.killpg(proc.pid,signal.SIGTERM)
        proc.wait(timeout=15)
