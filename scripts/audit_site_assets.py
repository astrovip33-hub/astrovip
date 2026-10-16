#!/usr/bin/env python3
"""Check every HTML file after the build for missing resources and broken JSON-LD."""
import json
import sys
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.resources = []
        self.json_blocks = []
        self.json_data = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') in ('stylesheet', 'icon', 'shortcut icon', 'manifest', 'preload'):
            self.resources.append(attrs.get('href', ''))
        elif tag in ('script', 'img', 'source', 'video', 'audio'):
            self.resources.append(attrs.get('src', ''))
        if tag in ('img', 'source'):
            srcset = attrs.get('srcset', '')
            if not srcset.startswith('data:'):
                self.resources.extend(value.strip().split()[0] for value in srcset.split(',') if value.strip())
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.json_data = ''

    def handle_data(self, data):
        if self.json_data is not None:
            self.json_data += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.json_data is not None:
            self.json_blocks.append(self.json_data)
            self.json_data = None


def main():
    missing = defaultdict(list)
    errors = []
    scanned = blocks = 0
    for path in ROOT.rglob('*.html'):
        relative = path.relative_to(ROOT)
        if set(relative.parts) & {'.git', 'node_modules', '.wrangler'}:
            continue
        scanned += 1
        page = Page()
        page.feed(path.read_text(encoding='utf-8'))
        for resource in page.resources:
            url = urlsplit(resource)
            if url.scheme or url.netloc or not url.path or url.path.startswith('/api/'):
                continue
            destination = ROOT / unquote(url.path.lstrip('/')) if url.path.startswith('/') else path.parent / unquote(url.path)
            if not destination.exists():
                missing[resource].append(str(relative))
        for block in page.json_blocks:
            blocks += 1
            try:
                json.loads(block)
            except (ValueError, TypeError) as exc:
                errors.append(f'{relative}: invalid JSON-LD: {exc}')
    for resource, pages in sorted(missing.items()):
        errors.append(f'Missing resource {resource}: {len(pages)} pages; examples: {", ".join(pages[:3])}')
    print(f'Asset audit: {scanned} HTML files; {blocks} JSON-LD blocks; {len(errors)} errors.')
    for error in errors:
        print(error)
    return bool(errors)


if __name__ == '__main__':
    sys.exit(main())
