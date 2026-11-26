#!/usr/bin/env python3
"""Check a CV or résumé PDF for private details, then render its pages for the site's reader.

    python3 scripts/doc-pages.py public/docs/Jialuo_Chen_CV.pdf cv

It stops, and writes nothing, when the PDF's text holds a phone number or a street address with a house number:
export the PDF again without them (or redact them for real, so the text is gone, not covered). Otherwise each
page becomes public/docs/STEM-N-800.webp and STEM-N-1275.webp, and it prints the pages list for content/docs.ts.
Needs PyMuPDF and Pillow (pip install pymupdf pillow).
"""
import re
import sys
from pathlib import Path

import pymupdf
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "docs"
PHONE = re.compile(r"(?<!\d)(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?!\d)")
STREET = re.compile(
    r"\b\d{1,5}\s+(?:[A-Z][\w'.-]*\s+){1,4}(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Boulevard|Blvd|Crescent|Cres|"
    r"Court|Ct|Lane|Ln|Way|Place|Pl|Circle|Trail|Parkway|Pkwy|Terrace|Square|Sq)\b\.?"
)


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__, file=sys.stderr)
        return 2
    pdf, stem = Path(sys.argv[1]), sys.argv[2]
    doc = pymupdf.open(pdf)
    text = "\n".join(page.get_text() for page in doc)
    found = [m.group(0) for m in PHONE.finditer(text)] + [m.group(0) for m in STREET.finditer(text)]
    if found:
        print(f"{pdf} holds private details; nothing was written:", file=sys.stderr)
        for f in dict.fromkeys(found):
            print(f"  {f}", file=sys.stderr)
        print("Export it again without them, or redact them so the text is gone, then run this again.", file=sys.stderr)
        return 1

    pages = []
    for i, page in enumerate(doc, 1):
        pix = page.get_pixmap(dpi=300)
        im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        for w in (800, 1275):
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(OUT / f"{stem}-{i}-{w}.webp", "WEBP", quality=86, method=6)
        pages.append(f"{stem}-{i}")
        print(f"wrote public/docs/{stem}-{i}-800.webp and -1275.webp")
    print("\nthe pages for content/docs.ts:")
    print("pages: [" + ", ".join(f'"{p}"' for p in pages) + "],")
    return 0


if __name__ == "__main__":
    sys.exit(main())
