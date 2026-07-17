"""Extract paragraphs, bold runs and hyperlink targets from a DOCX for content review."""

from __future__ import annotations

import json
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
REL = "{http://schemas.openxmlformats.org/package/2006/relationships}"


def run_segments(node: ET.Element, links: dict[str, str]) -> list[dict[str, object]]:
    segments: list[dict[str, object]] = []
    for child in node:
        if child.tag == f"{W}r":
            text = "".join(child.itertext())
            if text:
                props = child.find(f"{W}rPr")
                bold = props is not None and props.find(f"{W}b") is not None
                segments.append({"text": text, "emphasis": bold})
        elif child.tag == f"{W}hyperlink":
            target = links.get(child.attrib.get(f"{R}id", ""))
            for segment in run_segments(child, links):
                if target:
                    segment["href"] = target
                segments.append(segment)
    return segments


def extract(docx_path: Path) -> list[dict[str, object]]:
    with zipfile.ZipFile(docx_path) as archive:
        document = ET.fromstring(archive.read("word/document.xml"))
        relationships = ET.fromstring(archive.read("word/_rels/document.xml.rels"))
    links = {
        relationship.attrib["Id"]: relationship.attrib["Target"]
        for relationship in relationships.findall(f"{REL}Relationship")
        if relationship.attrib.get("Type", "").endswith("/hyperlink")
    }
    paragraphs: list[dict[str, object]] = []
    for index, paragraph in enumerate(document.findall(f".//{W}p")):
        segments = run_segments(paragraph, links)
        text = "".join(str(segment["text"]) for segment in segments).strip()
        if text:
            paragraphs.append({"index": index, "text": text, "segments": segments})
    return paragraphs


if __name__ == "__main__":
    if len(sys.argv) not in {2, 3}:
        raise SystemExit("Usage: extract_data_news_doc.py <document.docx> [output.json]")
    payload = json.dumps(extract(Path(sys.argv[1])), ensure_ascii=False, indent=2)
    if len(sys.argv) == 3:
        Path(sys.argv[2]).write_text(payload, encoding="utf-8")
    else:
        print(payload)
