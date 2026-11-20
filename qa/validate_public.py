#!/usr/bin/env python3
"""Fail closed on structural, bilingual and public-package regressions."""

from __future__ import annotations

import csv
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
EVIDENCE = ROOT / "evidence"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def hrefs(html: str) -> list[str]:
    return re.findall(r'<a\b[^>]*\bhref=["\']([^"\']+)', html, re.I)


def main() -> None:
    en_path = SITE / "index.html"
    cs_path = SITE / "cs.html"
    require(en_path.is_file() and cs_path.is_file(), "Both language pages must exist")
    require((SITE / ".nojekyll").is_file(), "site/.nojekyll is missing")

    en = en_path.read_text(encoding="utf-8")
    cs = cs_path.read_text(encoding="utf-8")
    pages = {"en": en, "cs": cs}
    counterparts = {"en": "cs.html", "cs": "index.html"}
    expected_sections: list[str] | None = None
    expected_sources: list[str] | None = None
    expected_citations: list[str] | None = None
    expected_external: list[str] | None = None

    banned_public_copy = [
        "claims checked", "5 evidence types", "standalone html", "archived pdf",
        "validation summary", "audit trail", "internal note", "v1 preserved",
    ]

    for lang, html in pages.items():
        require(re.search(fr'<html\b[^>]*\blang="{lang}"', html), f"Wrong html lang for {lang}")
        require(len(re.findall(r"<h1\b", html, re.I)) == 1, f"{lang}: expected one h1")
        require(len(re.findall(r"<main\b", html, re.I)) == 1, f"{lang}: expected one main")
        sections = re.findall(r'<section\b[^>]*\bid="([^"]+)"', html, re.I)
        sources = re.findall(r'<li\b[^>]*\bid="(src-\d+)"', html, re.I)
        citations = re.findall(r'<sup><a\s+href="#(src-\d+)"', html, re.I)
        links = hrefs(html)
        external = [url for url in links if url.startswith(("http://", "https://"))]
        local = [url for url in links if not url.startswith(("#", "http://", "https://", "mailto:", "tel:", "data:"))]
        runtime_assets = re.findall(
            r'<(?:script\b[^>]*\bsrc|link\b[^>]*rel="stylesheet"[^>]*\bhref|img\b[^>]*\bsrc|iframe\b[^>]*\bsrc)=["\']([^"\']+)',
            html,
            re.I,
        )
        require(len(sections) == 13, f"{lang}: expected 13 sections, found {len(sections)}")
        require(len(sources) == 28, f"{lang}: expected 28 sources, found {len(sources)}")
        require(len(re.findall(r'class="qcard"', html)) == 5, f"{lang}: expected 5 claim cards")
        require(local == [counterparts[lang]], f"{lang}: unexpected local links: {local}")
        require(not runtime_assets, f"{lang}: external runtime assets found: {runtime_assets}")
        require(all(item in sources for item in citations), f"{lang}: citation without source entry")
        lowered = html.lower()
        require(not any(term in lowered for term in banned_public_copy), f"{lang}: process-facing copy is visible")
        require('rel="alternate" hreflang="en" href="index.html"' in html, f"{lang}: English alternate missing")
        require('rel="alternate" hreflang="cs" href="cs.html"' in html, f"{lang}: Czech alternate missing")
        if expected_sections is None:
            expected_sections, expected_sources = sections, sources
            expected_citations, expected_external = citations, external
        else:
            require(sections == expected_sections, "Section order differs across languages")
            require(sources == expected_sources, "Source order differs across languages")
            require(citations == expected_citations, "Citation sequence differs across languages")
            require(external == expected_external, "External source links differ across languages")

    registry = read_csv(EVIDENCE / "source_registry.csv")
    matrix = read_csv(EVIDENCE / "CLAIM_EVIDENCE_MATRIX.csv")
    require(len(registry) == 30, f"Expected 30 source records, found {len(registry)}")
    require(len(matrix) == 73, f"Expected 73 evidence rows, found {len(matrix)}")
    require(len({row["claim_id"] for row in matrix}) == 54, "Expected 54 material claims")
    require(len({row["source_id"] for row in registry}) == len(registry), "Source IDs are not unique")
    require(all(row["source_id"] in {item["source_id"] for item in registry} for row in matrix), "Unknown source ID in evidence matrix")
    require(all(row["access_status"] == "FULL_TEXT" and row["audit_status"] == "PASS" for row in matrix), "Every displayed evidence row must be full-text PASS")
    require(sum(row["access_status"] == "METADATA_ONLY" for row in registry) == 1, "Expected one unused metadata-only source")
    require(all("local" not in key.lower() and "path" not in key.lower() for key in registry[0]), "Registry exposes a local-path column")
    require(all(row["verified_bytes"] and row["verified_sha256"] for row in registry if row["access_status"] == "FULL_TEXT"), "Full-text registry rows require size and hash")

    excluded_parts = {".git", "node_modules", "qa-output", "__pycache__"}
    public_files = [path for path in ROOT.rglob("*") if path.is_file() and not excluded_parts.intersection(path.parts)]
    forbidden_suffixes = {".pdf", ".docx", ".epub", ".mhtml", ".har"}
    require(not [path for path in public_files if path.suffix.lower() in forbidden_suffixes], "Source or capture files must not be committed")
    text_files = [path for path in public_files if path.suffix.lower() in {".md", ".csv", ".html", ".py", ".cjs", ".json", ".yml", ".yaml"}]
    local_user_prefix = "/" + "Users/"
    local_file_scheme = "file:" + "///"
    for path in text_files:
        text = path.read_text(encoding="utf-8")
        require(local_user_prefix not in text and local_file_scheme not in text, f"Absolute local path found in {path.relative_to(ROOT)}")

    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    require("{PAGES_URL}" not in readme, "README still contains a Pages placeholder")
    require("https://michalie.github.io/ai-environmental-footprint/" in readme, "README lacks production URL")
    print("PASS: public package, bilingual parity, evidence records and deployment boundary")


if __name__ == "__main__":
    main()
