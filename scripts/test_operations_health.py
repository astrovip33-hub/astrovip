import unittest
from operations_health import canonical_check


class CanonicalTests(unittest.TestCase):
    def test_valid_attribute_orders_and_quotes(self):
        for html in ['<link href="https://astrovip.ro/" rel="canonical"/>',
                     "<LINK REL='canonical' HREF='https://astrovip.ro/'>",
                     '<link\n href="https://astrovip.ro/" data-test="value" rel="CANONICAL">']:
            with self.subTest(html=html):
                self.assertTrue(canonical_check(html))

    def test_missing_foreign_duplicate_and_commented_canonical_fail(self):
        for html in ['', '<link rel="canonical" href="https://www.astrovip.ro/">',
                     '<link rel="canonical" href="https://astrovip.ro/">' * 2,
                     '<!-- <link rel="canonical" href="https://astrovip.ro/"> -->',
                     '<link rel="canonical" href="https://astrovip.ro/other/">']:
            with self.subTest(html=html):
                self.assertFalse(canonical_check(html))


if __name__ == '__main__':
    unittest.main()
