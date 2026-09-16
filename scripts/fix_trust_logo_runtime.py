from pathlib import Path

js_path = Path('assets/planetary-ticker-v2.js')
js = js_path.read_text(encoding='utf-8')
old = '''body:not(.guide-page) .trust-icon-only,body:not(.guide-page) .trust-commerce-card{height:96px!important;min-height:96px!important}body:not(.guide-page) .trust-icon-only{padding:3px 2px!important}body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"] img{width:108%!important;height:auto!important;max-width:none!important;max-height:96%!important;object-fit:contain!important}body:not(.guide-page) .trust-icon-only[aria-label^="Codul Etic"] img{width:112%!important;height:auto!important;max-width:none!important;max-height:96%!important;object-fit:contain!important}'''
new = '''body:not(.guide-page) .trust-icon-only,body:not(.guide-page) .trust-commerce-card{height:96px!important;min-height:96px!important}body:not(.guide-page) .trust-icon-only{padding:2px!important;overflow:hidden!important}body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"] img{width:calc(100% - 2px)!important;height:calc(100% - 2px)!important;max-width:none!important;max-height:none!important;object-fit:fill!important;object-position:center!important;margin:auto!important}body:not(.guide-page) .trust-icon-only[aria-label^="Codul Etic"] img{width:calc(100% - 2px)!important;height:calc(100% - 2px)!important;max-width:none!important;max-height:none!important;object-fit:fill!important;object-position:center!important;margin:auto!important}'''
if old not in js:
    raise SystemExit('Expected runtime trust-logo block not found')
js = js.replace(old, new, 1)
js_path.write_text(js, encoding='utf-8')

index_path = Path('index.html')
html = index_path.read_text(encoding='utf-8')
start = html.find('<style id="trust-logo-fill-v3">')
end = html.find('</style>', start)
if start != -1 and end != -1:
    end += len('</style>')
    replacement = '''<style id="trust-logo-fill-v5">\n@media(max-width:820px){\n  body:not(.guide-page) .trust-icon-only,\n  body:not(.guide-page) .trust-commerce-card{height:96px!important;min-height:96px!important}\n  body:not(.guide-page) .trust-icon-only{padding:2px!important;overflow:hidden!important}\n  body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"] img,\n  body:not(.guide-page) .trust-icon-only[aria-label^="Codul Etic"] img{\n    width:calc(100% - 2px)!important;\n    height:calc(100% - 2px)!important;\n    max-width:none!important;\n    max-height:none!important;\n    object-fit:fill!important;\n    object-position:center!important;\n    margin:auto!important;\n    transform:none!important;\n  }\n}\n</style>'''
    html = html[:start] + replacement + html[end:]
# remove the old v4 override so there is one source of truth in index
start2 = html.find('<style id="trust-logo-fill-v4">')
end2 = html.find('</style>', start2)
if start2 != -1 and end2 != -1:
    end2 += len('</style>')
    html = html[:start2] + html[end2:]
index_path.write_text(html, encoding='utf-8')

wf = Path('.github/workflows/fix-trust-logo-runtime-once.yml')
if wf.exists():
    wf.unlink()
self_path = Path('scripts/fix_trust_logo_runtime.py')
if self_path.exists():
    self_path.unlink()
