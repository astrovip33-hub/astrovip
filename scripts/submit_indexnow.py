#!/usr/bin/env python3
"""Submit only changed indexable AstroVip pages to IndexNow after deploy."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://astrovip.ro"
KEY_FILE = ROOT / "indexnow-key.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"
SEED_URLS = [
    f"{BASE}/",
    f"{BASE}/astrolog-bucuresti/",
    f"{BASE}/consultatie-astrologica/",
    f"{BASE}/harta-natala/",
    f"{BASE}/harta-mea/",
    f"{BASE}/calculator-ascendent/",
    f"{BASE}/pozitii-planete-live/",
    f"{BASE}/horoscop-chinezesc/",
    f"{BASE}/numerologie/",
    f"{BASE}/astrocartografie/",
    f"{BASE}/presa/",
]


def changed_files() -> list[str]:
    override = os.environ.get("INDEXNOW_CHANGED_FILES", "").strip()
    if override:
        return [p.strip().replace("\\", "/") for p in override.splitlines() if p.strip()]
    try:
        out = subprocess.check_output(
            ["git", "diff", "--name-only", "HEAD^", "HEAD"],
            cwd=ROOT,
            text=True,
            stderr=subprocess.DEVNULL,
        )
        return [p.strip().replace("\\", "/") for p in out.splitlines() if p.strip()]
    except Exception:
        return []


def page_url(path: str) -> str | None:
    p = path.lstrip("/")
    if p == "index.html":
        return f"{BASE}/"
    if p.endswith("/index.html"):
        return f"{BASE}/{p[:-10]}"
    if p.endswith(".html"):
        return f"{BASE}/{p}"
    return None


def is_indexable_html(path: str) -> bool:
    file_path = ROOT / path
    if not file_path.is_file():
        return False
    try:
        head = file_path.read_text(encoding="utf-8", errors="ignore")[:12000].lower()
    except OSError:
        return False
    return not re.search(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'][^"\']*noindex', head)


def collect_urls(paths: list[str]) -> list[str]:
    urls: set[str] = set()
    for path in paths:
        url = page_url(path)
        if url and is_indexable_html(path):
            urls.add(url)

    # Changes to Worker/homepage rendering materially change the canonical homepage.
    if any(
        p in {"worker.js", "worker-home-ultra.js", "homepage-approved-layout.js"}
        or p.startswith("assets/home-")
        for p in paths
    ):
        urls.add(f"{BASE}/")

    # First activation: seed the key commercial and high-impression pages once.
    if "indexnow-key.txt" in paths:
        urls.update(SEED_URLS)

    return sorted(urls)[:100]


def main() -> int:
    if not KEY_FILE.is_file():
        print("IndexNow skipped: key file missing")
        return 0
    key = KEY_FILE.read_text(encoding="utf-8").strip()
    if not re.fullmatch(r"[A-Za-z0-9-]{8,128}", key):
        print("IndexNow error: invalid key format", file=sys.stderr)
        return 2

    paths = changed_files()
    urls = collect_urls(paths)
    if not urls:
        print("IndexNow: no changed indexable HTML URLs to submit")
        return 0

    payload = {
        "host": "astrovip.ro",
        "key": key,
        "keyLocation": f"{BASE}/indexnow-key.txt",
        "urlList": urls,
    }
    request = Request(
        ENDPOINT,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "AstroVip-IndexNow/1.0",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=25) as response:
            status = response.status
    except HTTPError as exc:
        status = exc.code
    except URLError as exc:
        print(f"IndexNow network warning: {exc}", file=sys.stderr)
        return 1

    print(f"IndexNow submitted {len(urls)} URL(s); HTTP {status}")
    for url in urls:
        print(f"  {url}")
    return 0 if status in (200, 202) else 1


if __name__ == "__main__":
    raise SystemExit(main())
