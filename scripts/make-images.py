"""Writes the site's first web images (WebP, two widths where the source allows) from the source photographs.

usage: python3 scripts/make-images.py <source folder> public/images
A record of how the first images were made; run it again only when one of these sources changes. For a new
picture use scripts/add-image.py (docs/ADDING-CONTENT.md).
"""
import sys
from pathlib import Path
from PIL import Image

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)


def crop_box(im, ratio, cx=0.5, cy=0.5):
    """Largest box of the given ratio (w/h) centred near (cx, cy), kept inside the picture."""
    W, H = im.size
    if W / H > ratio:
        h, w = H, int(H * ratio)
    else:
        w, h = W, int(W / ratio)
    x = min(max(int(cx * W - w / 2), 0), W - w)
    y = min(max(int(cy * H - h / 2), 0), H - h)
    return im.crop((x, y, x + w, y + h))


def save(im, name, widths, q=80):
    im = im.convert("RGB") if im.mode not in ("RGB", "RGBA") else im
    out = []
    for w in widths:
        if w > im.width:
            continue
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(OUT / f"{name}-{w}.webp", "WEBP", quality=q, method=6)
        out.append(w)
    if not out:  # a small source: one file at its own size, never upscaled
        im.save(OUT / f"{name}-{im.width}.webp", "WEBP", quality=q, method=6)
        out.append(im.width)
    print(f"{name}: {out} ({im.width}x{im.height})")


def open_(n):
    return Image.open(SRC / n)


# the person
p = open_("profile-src.jpg")
W, H = p.size
side = int(H * 0.64)
cx, cy = W / 2 + 0.04 * H, 0.33 * H
avatar = p.crop((int(cx - side / 2), max(0, int(cy - side / 2)), int(cx + side / 2), max(0, int(cy - side / 2)) + side))
save(avatar, "portrait-square", [160, 320])
save(crop_box(p, 4 / 5, 0.52, 0.5), "portrait", [800, 1360])
# life
save(crop_box(open_("guqin-src.jpg"), 4 / 5, 0.5, 0.45), "guqin", [640, 1280])
save(crop_box(open_("art-src.jpg"), 4 / 5, 0.5, 0.5), "oil-painting", [640, 1000])
save(crop_box(open_("tennis-src.jpg"), 4 / 5, 0.5, 0.5), "tennis", [640, 696])
save(crop_box(open_("mobile-src.jpg"), 4 / 5, 0.5, 0.45), "honor-of-kings", [640, 1000])
# projects
save(open_("adhd-src.png"), "adhd-copilot", [800, 1600])
save(crop_box(open_("adhd-src.png"), 4 / 3, 0.5, 0.5), "adhd-copilot-43", [800, 1200])
for n in ["nc_f1", "nc_f2", "nc_f3", "nc_demo"]:
    save(open_(f"{n}.jpg"), n.replace("_", "-"), [800, 1040, 1249])
for n in ["d3m_demo", "d3m_f1", "d3m_f2", "d3m_f3"]:
    save(open_(f"{n}.jpg"), n.replace("_", "-"), [584, 702])
save(open_("linetolive-stages.png"), "linetolive-stages", [800, 1048], q=86)
save(crop_box(open_("linetolive-stages.png"), 4 / 3, 0.5, 0.5), "linetolive-43", [800, 1040], q=86)
# research
save(open_("hmitl_arch.jpg"), "hmitl-architecture", [700, 1008], q=86)
