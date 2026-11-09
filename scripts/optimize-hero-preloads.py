#!/usr/bin/env python3
"""Remove legacy hero preloads that compete with the actual responsive hero."""
from pathlib import Path
import re

path = Path("index.html")
html = path.read_text(encoding="utf-8")
pattern = re.compile(r'<link rel="preload" as="image" imagesrcset="/assets/astrovip-hero-(?:mobile-clean-cards|lux-clean-20260922)[^>]*\/>')
updated, count = pattern.subn("", html)
if count:
    path.write_text(updated, encoding="utf-8")
print(f"Removed {count} obsolete hero preloads")
