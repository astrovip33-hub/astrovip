#!/usr/bin/env python3
"""Validate the six core acquisition pages and the static AI discovery file.

Use --base-url https://preview.example to check the HTML returned by a deployment.
No JavaScript is executed: meaningful comparison content must arrive in the HTML.
"""
import argparse
from datetime import date
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://astrovip.ro'
PAGES = ('consultatie-astrologica', 'sinastrie', 'harta-natala',
         'astrocartografie', 'relocare-geografica', 'numerologie')


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.h1s = 0
        self.canonicals = []
        self.metadata = {}
        self.dates = []
        self.schema = []
        self.json_text = None
        self.tables = 0
        self.captions = 0
        self.scoped_headers = 0
        self.in_main = False
        self.skip = 0
        self.visible = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'main':
            self.in_main = True
        if tag in ('script', 'style'):
            self.skip += 1
        if tag == 'h1':
            self.h1s += 1
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonicals.append(attrs.get('href'))
        if tag == 'meta':
            self.metadata.setdefault(attrs.get('property', attrs.get('name')), []).append(attrs.get('content', ''))
        if tag == 'time':
            self.dates.append(attrs.get('datetime'))
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.json_text = ''
        if tag == 'table' and 'av-answer-table' in attrs.get('class', '').split():
            self.tables += 1
        if tag == 'caption':
            self.captions += 1
        if tag == 'th' and attrs.get('scope') in ('row', 'col'):
            self.scoped_headers += 1

    def handle_data(self, data):
        if self.json_text is not None:
            self.json_text += data
        elif self.in_main and not self.skip:
            self.visible.append(data)

    def handle_endtag(self, tag):
        if tag == 'script' and self.json_text is not None:
            self.schema.append(json.loads(self.json_text))
            self.json_text = None
        if tag in ('script', 'style'):
            self.skip -= 1
        if tag == 'main':
            self.in_main = False


def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', help='Fetch deployed HTML instead of local source')
    args = parser.parse_args()

    def read(path):
        if args.base_url:
            request = Request(args.base_url.rstrip('/') + path, headers={'User-Agent': 'AstroVip-GEO-Validation/1.0'})
            with urlopen(request, timeout=30) as response:
                if response.status != 200:
                    raise ValueError(f'{path}: HTTP {response.status}')
                return response.read().decode('utf-8')
        local = ROOT / path.lstrip('/')
        return (local / 'index.html' if path.endswith('/') else local).read_text(encoding='utf-8')

    errors = []
    for route in PAGES:
        page = Page()
        try:
            page.feed(read('/' + route + '/'))
        except Exception as exc:
            errors.append(f'{route}: {exc}')
            continue
        canonical = ORIGIN + '/' + route + '/'
        if page.h1s != 1 or page.canonicals != [canonical]:
            errors.append(f'{route}: expected one H1 and one canonical {canonical}')
        for key in ('description', 'og:type', 'og:title', 'og:description', 'og:url', 'og:image'):
            if len(page.metadata.get(key, [])) != 1 or not page.metadata[key][0]:
                errors.append(f'{route}: expected one nonempty {key}')
        if page.metadata.get('og:url') != [canonical]:
            errors.append(f'{route}: Open Graph URL must match canonical')
        if 'noindex' in ' '.join(page.metadata.get('robots', [])).lower():
            errors.append(f'{route}: core acquisition page must be indexable')
        if not page.tables or not page.captions or not page.scoped_headers:
            errors.append(f'{route}: static accessible comparison table missing')
        if len(' '.join(page.visible).split()) < 250:
            errors.append(f'{route}: expected substantive initial HTML content')
        for node in nodes(page.schema):
            if node.get('@type') == 'Article':
                for key in ('datePublished', 'dateModified'):
                    if node.get(key) and node[key] not in page.dates:
                        errors.append(f'{route}: {key} has no matching visible time element')
                for value in (node.get('datePublished'), node.get('dateModified')):
                    if value:
                        try:
                            if date.fromisoformat(value[:10]) > date.today():
                                errors.append(f'{route}: future article date {value}')
                        except ValueError:
                            errors.append(f'{route}: invalid date {value}')
                if node.get('datePublished', '') > node.get('dateModified', '9999'):
                    errors.append(f'{route}: publication follows revision')
    llms = read('/llms.txt')
    if not llms.startswith('# AstroVip\n'):
        errors.append('llms.txt: missing project H1')
    sections = re.split(r'^## .+$', llms, flags=re.M)[1:]
    if not sections:
        errors.append('llms.txt: missing file-list sections')
    for section in sections:
        lines = [line for line in section.splitlines() if line.strip()]
        if not lines or any(not re.match(r'^- \[[^\]]+\]\(https://[^)]+\)(?:: .*)?$', line) for line in lines):
            errors.append('llms.txt: each H2 section must contain Markdown link entries')
    for link in re.findall(r'\]\((https://astrovip\.ro/[^)]*)\)', llms):
        target = ROOT / urlsplit(link).path.lstrip('/')
        if not (target / 'index.html' if link.endswith('/') else target).is_file():
            errors.append(f'llms.txt: missing canonical target {link}')
    print(f'GEO audit: {len(PAGES)} core pages; {len(sections)} llms sections; {len(errors)} errors.')
    for error in errors:
        print(error)
    return bool(errors)


if __name__ == '__main__':
    raise SystemExit(main())
