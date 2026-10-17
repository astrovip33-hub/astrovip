"""Compile the dated SE Ranking CSV archive without calling a paid API.

Usage: python scripts/import_marketing_exports.py EXPORT_DIRECTORY [OUTPUT.json]
No personal data or account credentials are read. All totals describe exported
rows, not complete provider inventories. The original files remain untouched.
"""
import base64
import csv
import hashlib
import json
from pathlib import Path
import re
import sys
import unicodedata
import zlib


def numeric(value):
    try:
        v = float(str(value).replace(",", ""))
        return v if v >= 0 and v < float("inf") else None
    except (ValueError, TypeError):
        return None


def fold(value):
    return "".join(c for c in unicodedata.normalize("NFD", value.lower()) if unicodedata.category(c) != "Mn")


def compile_exports(root):
    manifest, keywords, serps, domains, competitors = [], {}, [], [], {}
    gap_count = 0
    for path in sorted(Path(root).iterdir()):
        if path.suffix.lower() not in {".csv", ".xlsx", ".pdf"}:
            continue
        meta = {"file": path.name, "bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
        manifest.append(meta)
        if path.suffix.lower() != ".csv":
            meta["status"] = "archived_not_parsed"
            continue
        with path.open(encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
        meta["rows"] = len(rows)
        meta["status"] = "parsed"
        name = path.name
        if "serp_analyzer_" in name:
            query = name.split("serp_analyzer_", 1)[1].split("_top10", 1)[0].replace("_", " ")
            for row in rows:
                serps.append({"query": query, "url": row.get("URL"), "title": (row.get("Title") or "")[:120], "position": numeric(row.get("№") or row.get("Top")), "referringDomains": numeric(row.get("Number of referring domains linking to page")), "source": name})
        if "referring_domains_gap" in name:
            gap_count += len(rows)
            for row in rows:
                domains.append({"domain": row.get("Referring domains"), "trust": numeric(row.get("DT")), "backlinks": numeric(row.get("Backlinks")), "competitors": [k for k, v in row.items() if k.endswith(".ro") and numeric(v)], "source": name})
        if rows and "Domain" in rows[0] and "Total traffic" in rows[0]:
            for row in rows:
                domain = row.get("Domain", "").removeprefix("www.")
                if domain in {"astrocafe.ro", "eastrolog.ro", "zodiacool.ro", "astrodex.ro", "acvaria.com", "acvaria.ro", "astrovip.ro"} and domain not in competitors:
                    competitors[domain] = {"domain": domain, "trust": numeric(row.get("DT")), "keywords": numeric(row.get("Keyword total")), "trafficEstimate": numeric(row.get("Total traffic")), "source": name}
        for row in rows:
            q = (row.get("Keyword") or "").strip()
            if not q or "Search vol." not in row:
                continue
            normalized = fold(q)
            # Out-of-scope legacy dating keywords and competitor brand searches
            # are not content targets for AstroVip.
            if re.search(r"matrimonial|\bdating\b|astrocafe|eastrolog|zodiacool|astrodex|acvaria", normalized):
                continue
            old = keywords.get(normalized)
            volume = numeric(row.get("Search vol."))
            if old is None:
                old = keywords[normalized] = {"keyword": q, "volume": volume, "difficulty": numeric(row.get("Difficulty")), "cpc": numeric(row.get("CPC")), "intent": row.get("Search intent") or None, "position": None, "url": None, "sources": []}
            if len(old["sources"]) < 4 and name not in old["sources"]:
                old["sources"].append(name)
            if old["volume"] is None and volume is not None:
                old["volume"] = volume
            if row.get("Position") and ("unique" in name or "astrovip_organic_keywords" in name):
                old["position"] = numeric(row.get("Position"))
                old["url"] = row.get("URL") or row.get("astrovip.ro")
            old["gap"] = bool(old.get("gap") or "missing_keyword_gap" in name)
    all_keywords = sorted(keywords.values(), key=lambda k: (-(k["volume"] or 0), k["keyword"]))
    # Keep broad demand AND each topic. Do not sum overlapping search volumes.
    selected = {k["keyword"]: k for k in all_keywords[:80]}
    topics = ["astrologie", "astrolog", "harta natala", "numerologie", "astrograma", "compatibilitate", "zodiac chinezesc", "relocare", "cariera", "bani", "dragoste", "luna plina", "luna noua", "ascendent", "horoscop"]
    for topic in topics:
        for k in [k for k in all_keywords if topic in fold(k["keyword"])][:6]:
            selected[k["keyword"]] = k
    return {"version": 1, "provider": "SE Ranking", "capturedDate": "2026-10-17", "market": "RO", "mode": "dated_export", "rankContext": "SERP Analyzer export; localitatea și dispozitivul nu sunt incluse în CSV", "limitations": ["Volumele și traficul sunt estimări SE Ranking.", "Pozițiile din research și SERP Analyzer nu înlocuiesc rank tracking la aceeași locație și pe același dispozitiv.", "XLSX și PDF sunt inventariate, nu interpretate în acest import.", "Moneda CPC nu este specificată în CSV-urile redenumite; nu se face conversie.", "Domeniile din backlink gap cer verificare editorială individuală."], "counts": {"files": len(manifest), "csv": sum(m["status"] == "parsed" for m in manifest), "exportedRows": sum(m.get("rows", 0) for m in manifest), "uniqueKeywords": len(keywords), "displayKeywords": len(selected), "serpQueries": len({s["query"] for s in serps}), "referringDomainGapRows": gap_count}, "keywords": sorted(selected.values(), key=lambda k: (-(k["volume"] or 0), k["keyword"])), "serps": serps, "competitors": list(competitors.values()), "authority": sorted(domains, key=lambda d: (-(d["trust"] or 0), d["domain"] or ""))[:30], "manifest": manifest}


if __name__ == "__main__":
    snapshot = compile_exports(sys.argv[1])
    value = json.dumps(snapshot, ensure_ascii=False, separators=(",", ":"))
    if len(sys.argv) > 2:
        Path(sys.argv[2]).write_text(value + "\n", encoding="utf-8")
        print(json.dumps(snapshot["counts"]))
    else:
        print("AVSNAPSHOT:" + base64.b64encode(zlib.compress(value.encode("utf-8"))).decode("ascii"))
