#!/usr/bin/env python3
"""Replace the audited dead planetary-ticker-v2 dependency with the existing valid ticker.
Atlas is not part of this scope.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "sinastrie/index.html",
    "astrologie-predictiva/index.html",
    "numerologie/index.html",
    "progresii-secundare/index.html",
    "arce-solare/index.html",
    "astrologie-vocationala/index.html",
    "puncte-mijlocii/index.html",
    "despre-astrovip/index.html",
    "metoda-astrovip/index.html",
    "revolutie-solara/index.html",
    "algoritm-astrovip/index.html",
]
VALID = "/assets/planetary-ticker.js"
OLD = "/assets/planetary-ticker-v2.js"


def main() -> int:
    asset = ROOT / "assets" / "planetary-ticker.js"
    if not asset.exists():
        raise SystemExit("Required valid asset missing: assets/planetary-ticker.js")
    changed = 0
    failures = []
    for rel in PAGES:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        original = text
        text = text.replace(OLD, VALID)
        if VALID not in text:
            pattern = re.compile(r'(<script\b[^>]*src=["\'][^"\']*astronomy-engine[^"\']*["\'][^>]*>\s*</script>)', re.I)
            m = pattern.search(text)
            if not m:
                failures.append(f"{rel}: astronomy-engine anchor not found")
                continue
            text = text[:m.end()] + f'<script defer src="{VALID}"></script>' + text[m.end():]
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed += 1
    # Final validation: all 11 pages must use the real asset and none the dead v2 path.
    for rel in PAGES:
        text = (ROOT / rel).read_text(encoding="utf-8")
        if VALID not in text or OLD in text:
            failures.append(f"{rel}: ticker dependency validation failed")
    print(f"Ticker pages changed: {changed}")
    print(f"Validated pages: {len(PAGES)}")
    if failures:
        print("\n".join(failures))
        return 1
    print("PASS: all audited ticker pages use /assets/planetary-ticker.js")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
