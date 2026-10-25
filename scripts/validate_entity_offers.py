"""Check public identity, prices, and case-study coverage in initial HTML."""
import json
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
IG = 'https://www.instagram.com/astrovip333/'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.schema = []
        self.buffer = None
        self.ids = []
        self.h1s = 0
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag == 'h1':
            self.h1s += 1
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.buffer = ''

    def handle_data(self, text):
        if self.buffer is not None:
            self.buffer += text

    def handle_endtag(self, tag):
        if tag == 'script' and self.buffer is not None:
            self.schema.append(json.loads(self.buffer))
            self.buffer = None

def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)

def main():
    home = (ROOT / 'index.html').read_text()
    parsed = Page(home)
    services = [n for n in nodes(parsed.schema) if n.get('@type') == 'Service']
    cards = re.findall(r'<article class="av-offer[^\"]*"[^>]*>.*?</article>', home, re.S)
    assert len(services) == len(cards) == 12
    for service, card in zip(services, cards):
        offer = service['offers']
        amount = re.search(r'class="av-offer-price">([^<]+)', card)[1]
        price = re.search(r'\d+', amount)[0]
        if 'de la' in amount:
            assert 'price' not in offer
            assert offer['priceSpecification']['minPrice'] == price
        else:
            assert offer['price'] == price
        assert offer['priceCurrency'] == 'RON'
        assert service['url'].split('#')[1] in parsed.ids
        assert service['provider']['@id'] == 'https://astrovip.ro/#organization'
    for name in ('index.html', 'despre-astrovip/index.html', 'astrovip-entity.json',
                 'presa/index.html', 'astrolog-bucuresti/index.html', 'llms.txt',
                 'scripts/strengthen-entity-geo.py'):
        text = (ROOT / name).read_text()
        assert IG in text, name
        assert 'astrovip77' not in text, name
    author = Page((ROOT / 'despre-astrovip/index.html').read_text())
    profiles = [n for n in nodes(author.schema) if n.get('@type') == 'ProfilePage']
    assert len(profiles) == 1
    assert IG in profiles[0]['mainEntity']['sameAs']
    assert author.h1s == 1
    collection = Page((ROOT / 'studii-de-caz/index.html').read_text())
    listings = [n for n in nodes(collection.schema) if n.get('@type') == 'ItemList']
    assert len(listings) == 1
    items = listings[0]['itemListElement']
    assert listings[0]['numberOfItems'] == len(items) == 116
    assert len({i['url'] for i in items}) == 116
    for item in items:
        path = ROOT / item['url'].removeprefix('https://astrovip.ro/') / 'index.html'
        text = path.read_text()
        case = Page(text)
        assert case.ids.count('case-answer') == 1, path
        assert case.h1s == 1, path
        assert len(case.ids) == len(set(case.ids)), path
        for heading in ('Întrebare', 'Date și surse', 'Metodologie', 'Tehnici folosite', 'Concluzie și limite'):
            assert '<h3>' + heading + '</h3>' in text, (path, heading)
    print('Identity/offers: official Instagram; 12 matching prices; 116 unique structured case studies.')

if __name__ == '__main__':
    main()
