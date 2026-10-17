"""Check that deployment enrichment preserves editorial provenance."""
import json
from pathlib import Path
import re
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('enrich_structured_data.py').resolve()


class EnrichmentTests(unittest.TestCase):
    def enrich(self, data):
        with tempfile.TemporaryDirectory() as directory:
            page = Path(directory) / 'guide' / 'index.html'
            page.parent.mkdir()
            page.write_text('<html><head><script type="application/ld+json">' +
                            json.dumps(data) + '</script></head><body>' +
                            '<article class="guide-content"><h1>Ghid</h1>' +
                            '<p>Conținut editorial.</p></article></body></html>', encoding='utf-8')
            subprocess.run(['python3', str(SCRIPT)], cwd=directory, check=True, capture_output=True)
            first = page.read_text(encoding='utf-8')
            subprocess.run(['python3', str(SCRIPT)], cwd=directory, check=True, capture_output=True)
            self.assertEqual(first, page.read_text(encoding='utf-8'), 'Enrichment must be idempotent')
            data = json.loads(re.search(r'application/ld\+json">(.*?)</script>', first).group(1))
            return data, first

    def test_revision_is_not_invented_publication_date(self):
        data, html = self.enrich({'@type': 'Article', 'dateModified': '2026-10-17'})
        self.assertNotIn('datePublished', data)
        self.assertEqual(data['dateModified'], '2026-10-17')
        self.assertIn('<aside class="guide-author av-author-trust"', html)
        self.assertEqual(data['author']['url'], 'https://astrovip.ro/despre-astrovip/')

    def test_original_publication_survives_later_revision(self):
        data, _ = self.enrich({'@type': 'BlogPosting', 'datePublished': '2026-09-23',
                               'dateModified': '2026-10-17'})
        self.assertEqual(data['datePublished'], '2026-09-23')
        self.assertEqual(data['dateModified'], '2026-10-17')

    def test_graph_does_not_add_article_semantics_to_a_calculator(self):
        data, html = self.enrich({'@graph': [{'@type': 'WebApplication', 'name': 'Calculator'}]})
        self.assertEqual(data['@graph'][0], {'@type': 'WebApplication', 'name': 'Calculator'})
        self.assertNotIn('av-author-trust', html)


if __name__ == '__main__':
    unittest.main()
