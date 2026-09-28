#!/usr/bin/env python3
"""Audit the curated sitemap's internal links and indexability without Atlas bulk pages."""

from collections import defaultdict
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

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.add(attrs["href"])
        elif tag == "link" and attrs.get("rel", "").lower() == "canonical":
            self.canonical = attrs.get("href", "")
        elif tag == "meta" and attrs.get("name", "").lower() == "robots":
            self.robots = attrs.get("content", "")
        elif tag == "meta" and attrs.get("name", "").lower() == "description":
            self.description = attrs.get("content", "")
        elif tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def local_path(url):
    return Path("index.html" if url == BASE else url.removeprefix(BASE) + "index.html")


def main():
    sitemap = set()
    for file in Path(".").glob("sitemap*.xml"):
        if file.name == "sitemap-index.xml":
            continue
        for element in ET.parse(file).getroot().iter():
            if element.tag.endswith("loc") and element.text and element.text.startswith(BASE) and not element.text.endswith(".xml"):
                sitemap.add(element.text.strip())

    incoming = defaultdict(set)
    errors = []
    for path in Path(".").rglob("index.html"):
        if path.parts[0] in ("atlas", ".git"):
            continue
        source = BASE if path == Path("index.html") else BASE + path.as_posix()[:-10]
        page = Page()
        page.feed(path.read_text(encoding="utf-8", errors="replace"))
        if source in sitemap:
            if page.canonical != source:
                errors.append(f"Canonical mismatch: {source} -> {page.canonical or '(missing)'}")
            if "noindex" in page.robots.lower():
                errors.append(f"Noindex in sitemap: {source}")
            if not page.title.strip() or not page.description.strip():
                errors.append(f"Missing title or description: {source}")
        for href in page.links:
            target = urlsplit(urljoin(source, href))
            if target.netloc not in ("astrovip.ro", "www.astrovip.ro"):
                continue
            destination = BASE + unquote(target.path).lstrip("/")
            if not destination.endswith("/") and "." not in destination.rsplit("/", 1)[-1]:
                destination += "/"
            if source != destination:
                incoming[destination].add(source)

    for url in sitemap:
        if not local_path(url).exists():
            errors.append(f"Sitemap target missing locally: {url}")
    orphans = sorted(url for url in sitemap if not incoming[url])
    single = sorted(url for url in sitemap if len(incoming[url]) == 1)
    print(f"Sitemap URLs: {len(sitemap)}; orphans: {len(orphans)}; one inbound source: {len(single)}")
    for issue in errors + [f"Orphan: {url}" for url in orphans]:
        print(issue)
    if errors or orphans:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
