#!/usr/bin/env python3
"""Strict editorial-quality gate for the AstroVip ASC/Sun/Moon indexing queue.

A generated profile is NEVER approved merely because it has sufficient words.
Only a dedicated per-profile review document with meaningful original text may
be released, and changes to already released text require a new approval hash.
"""
from __future__ import annotations

from datetime import datetime
from pathlib import Path
import hashlib
import html
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
REVIEWS = HERE / "approved"
STATE = HERE / "indexed-state.json"
SITE = "https://astrovip.ro"
BASE = "ascendent-soare-luna"

SIGN_SLUGS = (
    "berbec", "taur", "gemeni", "rac", "leu", "fecioara",
    "balanta", "scorpion", "sagetator", "capricorn", "varsator", "pesti",
)
SECTIONS = (
    "portret", "ascendent_soare", "soare_luna", "ascendent_luna",
    "relatii", "munca", "exercitiu",
)
FORBIDDEN = ("lorem ipsum", "text de completat", "[placeholder]", "garantat 100%",
             "eveniment sigur", "horoscopul este o știință exactă")


def words(text: str) -> list[str]:
    return re.findall(r"[\wăâîșțĂÂÎȘȚ]+", text.lower(), flags=re.UNICODE)


def allowed_slugs() -> set[str]:
    return {
        f"ascendent-{a}-soare-{s}-luna-{l}"
        for a in SIGN_SLUGS for s in SIGN_SLUGS for l in SIGN_SLUGS
    }


def existing_curated() -> set[str]:
    payload = json.loads((HERE / "manifest.json").read_text(encoding="utf-8"))
    return {entry["slug"] for entry in payload["profiles"]}


def reviewed_hash(item: dict) -> str:
    fields = {key: item[key] for key in ("slug", "title", "description", "sections")}
    value = json.dumps(fields, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def check_review(item: dict, slug: str, peers: list[dict] | None = None) -> str:
    if not isinstance(item, dict) or item.get("slug") != slug:
        raise ValueError(f"{slug}: slug inconsistent")
    if slug not in allowed_slugs() or slug in existing_curated():
        raise ValueError(f"{slug}: unknown or already curated")
    if item.get("status") != "approved":
        raise ValueError(f"{slug}: approval not recorded")
    reviewer = item.get("reviewed_by", "")
    notes = item.get("review_notes", "")
    if not isinstance(reviewer, str) or len(reviewer.strip()) < 5:
        raise ValueError(f"{slug}: real reviewer identity or automated QA attribution required")
    if not isinstance(notes, str) or len(words(notes)) < 12:
        raise ValueError(f"{slug}: documented editorial rationale required")
    try:
        datetime.fromisoformat(item["reviewed_at"].replace("Z", "+00:00"))
    except (KeyError, AttributeError, ValueError) as error:
        raise ValueError(f"{slug}: valid review timestamp required") from error
    title = item.get("title", "")
    description = item.get("description", "")
    if not isinstance(title, str) or not (25 <= len(title) <= 70):
        raise ValueError(f"{slug}: title must be 25-70 characters")
    if not isinstance(description, str) or not (100 <= len(description) <= 180):
        raise ValueError(f"{slug}: description must be 100-180 characters")
    parts = item.get("sections")
    if not isinstance(parts, dict) or set(parts) != set(SECTIONS):
        raise ValueError(f"{slug}: seven named interpretation sections required")
    all_text = []
    for section in SECTIONS:
        body = parts.get(section)
        if not isinstance(body, str) or len(words(body)) < 62:
            raise ValueError(f"{slug}: section {section} needs at least 62 original words")
        if "<" in body or ">" in body:
            raise ValueError(f"{slug}: raw HTML disallowed in {section}")
        all_text.append(body)
    joined = " ".join(all_text)
    if len(words(joined)) < 480:
        raise ValueError(f"{slug}: at least 480 words in the interpretation")
    if any(v in joined.lower() for v in FORBIDDEN):
        raise ValueError(f"{slug}: unverified promise or placeholder")
    for other in peers or []:
        if other.get("slug") == slug:
            continue
        ot = " ".join(other.get("sections", {}).values())
        # Repeated long passages signal templated mass content.
        a = set(zip(*[words(joined)[n:] for n in range(8)]))
        b = set(zip(*[words(ot)[n:] for n in range(8)]))
        if a and b and len(a & b) / min(len(a), len(b)) > 0.33:
            raise ValueError(f"{slug}: too similar to reviewed {other['slug']}")
    return reviewed_hash(item)


def read_review(slug: str) -> dict:
    p = REVIEWS / (slug + ".json")
    if not p.exists():
        raise ValueError(f"{slug}: missing approved editorial document")
    return json.loads(p.read_text(encoding="utf-8"))


def read_state() -> dict:
    state = json.loads(STATE.read_text(encoding="utf-8"))
    if state.get("schema") != 1 or not isinstance(state.get("indexed"), list) or not isinstance(state.get("days"), dict):
        raise ValueError("Invalid progressive indexing state")
    return state


def load_promotions() -> dict[str, dict]:
    state = read_state()
    all_slugs = set()
    reviewed = {}
    for entry in state["indexed"]:
        if not isinstance(entry, dict) or not isinstance(entry.get("slug"), str):
            raise ValueError("Malformed published item")
        slug = entry["slug"]
        if slug in all_slugs:
            raise ValueError("Duplicate published slug " + slug)
        review = read_review(slug)
        hash_now = check_review(review, slug, list(reviewed.values())[-30:])
        if entry.get("sha256") != hash_now:
            raise ValueError(f"{slug}: approval changed since release, refusing silent replacement")
        reviewed[slug] = review
        all_slugs.add(slug)
    if len(all_slugs) > 1704:
        raise ValueError("Too many indexed profiles")
    return reviewed


def render_reviewed_profile(source: str, item: dict) -> str:
    slug = item["slug"]
    if 'name="robots" content="noindex,follow"' not in source:
        raise ValueError(f"{slug}: expected noindex draft for controlled promotion")
    source = source.replace('name="robots" content="noindex,follow"',
                            'name="robots" content="index,follow,max-image-preview:large"', 1)
    source = re.sub(r"<title>.*?</title>", "<title>" + html.escape(item["title"]) + "</title>",
                    source, count=1, flags=re.S)
    desc = html.escape(item["description"], quote=True)
    source = re.sub(r'<meta name="description" content="[^"]*">',
                    '<meta name="description" content="' + desc + '">', source, count=1)
    source = re.sub(r'<meta property="og:description" content="[^"]*">',
                    '<meta property="og:description" content="' + desc + '">', source, count=1)
    headings = {
        "portret": "Portretul individual al combinației",
        "ascendent_soare": "Ascendent și Soare: între aparență și identitate",
        "soare_luna": "Soare și Lună: voință și nevoi emoționale",
        "ascendent_luna": "Ascendent și Lună: reacții și protecție",
        "relatii": "Relații și apropiere",
        "munca": "Muncă, resurse și dezvoltare",
        "exercitiu": "Exercițiu personal de integrare",
    }
    article = "".join("<section><h2>" + html.escape(headings[key]) + "</h2><p>" +
                      html.escape(item["sections"][key]) + "</p></section>" for key in SECTIONS)
    article += ('<section><h2>Precizie astrologică</h2><p>Aceste interpretări ale semnelor '
                'sunt orientative. Conjuncțiile și celelalte aspecte trebuie calculate din grade '
                'și minute, iar profesia, sănătatea sau rezultatele financiare nu pot fi determinate '
                'din această combinație. Analiza natală completă necesită ora și locul nașterii.</p>'
                '<p>Revizie: ' + html.escape(item["reviewed_by"]) + '. '
                'Această aprobare nu reprezintă confirmarea indexării de către Google.</p></section>')
    source, changes = re.subn(r"<article>[\s\S]*?</article>", "<article>" + article + "</article>", source, count=1)
    if changes != 1:
        raise ValueError(f"{slug}: article structure changed")
    source = source.replace("Profil orientativ generat automat, nerevizuit individual",
                            "Profil verificat pentru publicare după evaluarea conținutului", 1)
    if 'content="noindex' in source or len(re.findall(r"<h1\b", source, re.I)) != 1:
        raise ValueError(f"{slug}: invalid robots/H1 after promotion")
    return source
