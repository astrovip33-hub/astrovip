from pathlib import Path

p = Path("index.html")
s = p.read_text(encoding="utf-8")

s = s.replace(
    "/assets/footer-orbit-20261026.js?v=20261026-vivid1",
    "/assets/footer-orbit-20261026.js?v=20261026-vivid2",
)

marker = 'id="av-cert-l7x-js"'
direct = '''<link id="av-cert-l7x-css" rel="stylesheet" href="/assets/certificare-card-20261026.css?v=20261026-live3">
<script id="av-cert-l7x-js" defer src="/assets/certificare-card-20261026.js?v=20261026-live3"></script>'''

if marker not in s:
    if "</head>" not in s:
        raise SystemExit("Missing </head> in index.html")
    s = s.replace("</head>", direct + "\n</head>", 1)

p.write_text(s, encoding="utf-8")
print("Certification card direct loader injected into production homepage.")
