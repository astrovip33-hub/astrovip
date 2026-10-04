#!/usr/bin/env python3
"""Audit the curated sitemap's internal links and indexability without Atlas bulk pages."""

from collections import defaultdict, deque
import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import xml.etree.ElementTree as ET

BASE = "https://astrovip.ro/"


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = set()
        self.canonical = ""
        self.robots = ""
        self.description = ""
        self.title = ""
        self.in_title = False
        self.in_head = False
        self.titles = []
        self.canonicals = []
        self.descriptions = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "head":
            self.in_head = True
        if tag == "a" and attrs.get("href"):
            if "nofollow" not in attrs.get("rel", "").lower().split():
                self.links.add(attrs["href"])
        elif tag == "link" and attrs.get("rel", "").lower() == "canonical":
            self.canonical = attrs.get("href", "")
            self.canonicals.append(self.canonical)
        elif tag == "meta" and attrs.get("name", "").lower() == "robots":
            self.robots = attrs.get("content", "")
        elif tag == "meta" and attrs.get("name", "").lower() == "description":
            self.description = attrs.get("content", "")
            self.descriptions.append(self.description)
        elif tag == "title" and self.in_head:
            self.in_title = True
            self.titles.append("")

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "head":
            self.in_head = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
            self.titles[-1] += data


def local_path(url):
    return Path("index.html" if url == BASE else url.removeprefix(BASE) + "index.html")


def main():
    sitemap = set()
    errors = []
    # Traverse the submitted index, rather than accepting unreferenced XML files.
    pending = [Path("sitemap-index.xml")]
    visited = set()
    while pending:
        file = pending.pop()
        if file in visited:
            continue
        visited.add(file)
        for element in ET.parse(file).getroot().iter():
            if not element.tag.endswith("}loc") or not element.text:
                continue
            url = element.text.strip()
            if not url.startswith(BASE):
                errors.append(f"Foreign sitemap URL: {url}")
            elif url.endswith(".xml"):
                pending.append(Path(url.removeprefix(BASE)))
            else:
                if url in sitemap:
                    errors.append(f"Duplicate sitemap URL: {url}")
                sitemap.add(url)

    incoming = defaultdict(set)
    outgoing = defaultdict(set)
    pages = {}
    metadata = {"title": defaultdict(list), "description": defaultdict(list)}
    for path in Path(".").rglob("index.html"):
        if path.parts[0] in ("atlas", ".git", "node_modules", ".wrangler"):
            continue
        source = BASE if path == Path("index.html") else BASE + path.as_posix()[:-10]
        page = Page()
        page.feed(path.read_text(encoding="utf-8", errors="replace"))
        pages[source] = page
        if source in sitemap:
            if page.canonical != source:
                errors.append(f"Canonical mismatch: {source} -> {page.canonical or '(missing)'}")
            if "noindex" in page.robots.lower():
                errors.append(f"Noindex in sitemap: {source}")
            if not page.title.strip() or not page.description.strip():
                errors.append(f"Missing title or description: {source}")
            for field in ("titles", "descriptions", "canonicals"):
                if len(getattr(page, field)) != 1:
                    errors.append(f"Expected one {field}: {source}")
            for field in metadata:
                metadata[field][getattr(page, field).strip()].append(source)
        for href in page.links:
            target = urlsplit(urljoin(source, href))
            if target.netloc not in ("astrovip.ro", "www.astrovip.ro"):
                continue
            destination = BASE + unquote(target.path).lstrip("/")
            if not destination.endswith("/") and "." not in destination.rsplit("/", 1)[-1]:
                destination += "/"
            if source != destination:
                incoming[destination].add(source)
                outgoing[source].add(destination)
            if source in sitemap and destination.endswith("/") and not local_path(destination).exists():
                if not urlsplit(destination).path.startswith("/api/"):
                    errors.append(f"Broken internal page link: {source} -> {destination}")

    for url in sitemap:
        if not local_path(url).exists():
            errors.append(f"Sitemap target missing locally: {url}")
    orphans = sorted(url for url in sitemap if not incoming[url])
    single = sorted(url for url in sitemap if len(incoming[url]) == 1)
    reachable, queue = {BASE}, deque([BASE])
    while queue:
        source = queue.popleft()
        for destination in outgoing[source]:
            if destination in pages and destination not in reachable:
                reachable.add(destination)
                queue.append(destination)
    unreachable = sorted(sitemap - reachable)
    errors += [f"Unreachable from homepage: {url}" for url in unreachable]
    for field, groups in metadata.items():
        for value, urls in groups.items():
            if len(urls) > 1:
                errors.append(f"Duplicate {field}: {', '.join(sorted(urls))}")
    summary = {"sitemap_urls": len(sitemap), "orphans": orphans,
               "one_inbound_source": single, "unreachable": unreachable,
               "errors": errors}
    if "--json" in sys.argv:
        print(json.dumps(summary, ensure_ascii=False, indent=2))
    else:
        print(f"Sitemap URLs: {len(sitemap)}; orphans: {len(orphans)}; one inbound source: {len(single)}; unreachable: {len(unreachable)}")
    for issue in errors + [f"Orphan: {url}" for url in orphans]:
        print(issue)
    if errors or orphans:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
