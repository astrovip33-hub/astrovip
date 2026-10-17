import csv
from pathlib import Path
import tempfile
import unittest
from import_marketing_exports import compile_exports


class ImportTests(unittest.TestCase):
    def write_csv(self, root, name, headers, rows):
        with (root / name).open("w", encoding="utf-8-sig", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(headers)
            writer.writerows(rows)

    def test_serp_header_variants_and_history_grain(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for header, topic in [("№", "astrolog"), ("Top", "numerologie")]:
                self.write_csv(root, f"106_serp_analyzer_{topic}_top10_raw.csv", ["URL", "Title", header], [["https://example.com", "Pagină", 1]])
            self.write_csv(root, "08_astrovip_organic_keywords_competitive_research_raw.csv", ["Date", "Organic Total Traffic", "Organic Keywords"], [["2026-10-01", 10, 6]])
            result = compile_exports(root)
            self.assertEqual([r["position"] for r in result["serps"]], [1, 1])
            self.assertEqual(result["keywords"], [])

    def test_repeated_keyword_volume_is_not_added_and_legacy_services_are_excluded(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            headers = ["Keyword", "Search vol.", "Difficulty"]
            self.write_csv(root, "23_numerologie_similar_keywords_raw.csv", headers, [["numerologie", 1900, 68], ["servicii matrimoniale", 40, 30]])
            self.write_csv(root, "24_numerologie_related_keywords_raw.csv", headers, [["numerologie", 1900, 68]])
            result = compile_exports(root)
            self.assertEqual(result["counts"]["uniqueKeywords"], 1)
            self.assertEqual(result["keywords"][0]["volume"], 1900)
            self.assertEqual(len(result["keywords"][0]["sources"]), 2)


if __name__ == "__main__":
    unittest.main()
