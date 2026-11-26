#!/usr/bin/env python3
"""Make the WebP sizes of one picture for the site, and print its entry for content/*.ts.

    python3 scripts/add-image.py SOURCE NAME [--ratio 4:3] [--focus 0.5,0.5] [--widths 800,1600] [--alt "..."]

SOURCE is any picture Pillow opens (PNG, JPEG, WebP, a video frame saved as PNG). NAME is its stem on the site:
lowercase words joined by hyphens, e.g. "xr-capstone-43". --ratio crops it first (a card's cover is 4:3),
around --focus (x and y from 0 to 1, the middle by default). Each width becomes public/images/NAME-WIDTH.webp;
widths larger than the source are skipped, so the picture is never blown up. Needs Pillow (pip install pillow).
"""
import argparse
import re
import sys
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "images"


def crop_to(im: Image.Image, ratio: float, fx: float, fy: float) -> Image.Image:
    w, h = im.size
    if w / h > ratio:  # too wide: keep the height
        cw, ch = round(h * ratio), h
    else:  # too tall: keep the width
        cw, ch = w, round(w / ratio)
    left = min(max(0, round(fx * w - cw / 2)), w - cw)
    top = min(max(0, round(fy * h - ch / 2)), h - ch)
    return im.crop((left, top, left + cw, top + ch))


def main() -> int:
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("source")
    a.add_argument("name")
    a.add_argument("--ratio", help="crop to this shape first, e.g. 4:3, 16:9 or 1:1")
    a.add_argument("--focus", default="0.5,0.5", help="the point the crop keeps, x,y from 0 to 1")
    a.add_argument("--widths", default="800,1600", help="the widths to make, in pixels")
    a.add_argument("--alt", default="", help="what the picture shows, for the entry")
    a.add_argument("--quality", type=int, default=84)
    o = a.parse_args()

    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", o.name):
        print(f'the name "{o.name}" should be lowercase words joined by hyphens', file=sys.stderr)
        return 2
    im = Image.open(o.source)
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    if o.ratio:
        x, y = (float(v) for v in o.ratio.split(":"))
        fx, fy = (float(v) for v in o.focus.split(","))
        im = crop_to(im, x / y, fx, fy)

    made = []
    for w in sorted({int(v) for v in o.widths.split(",")}):
        if w > im.width:
            print(f"skipped {w}: the source is only {im.width} wide")
            continue
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(OUT / f"{o.name}-{w}.webp", "WEBP", quality=o.quality, method=6)
        made.append(w)
        print(f"wrote public/images/{o.name}-{w}.webp ({w}x{h})")
    if not made:  # the source is narrower than every width asked for: keep it at its own size
        made.append(im.width)
        im.save(OUT / f"{o.name}-{im.width}.webp", "WEBP", quality=o.quality, method=6)
        print(f"wrote public/images/{o.name}-{im.width}.webp ({im.width}x{im.height})")

    top = made[-1]
    h = round(im.height * top / im.width)
    alt = o.alt.replace('"', '\\"') or "TODO: what the picture shows"
    print("\nthe entry for content/*.ts:")
    print(f'{{ name: "{o.name}", widths: [{", ".join(map(str, made))}], w: {top}, h: {h}, alt: "{alt}" }}')
    return 0


if __name__ == "__main__":
    sys.exit(main())
