// Paths for the site, with the GitHub Pages base path (/portfolio) when it is built for Pages.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** A page or file on this site: url("/research/") -> "/portfolio/research/" on Pages. */
export function url(path: string) {
  return `${BASE}${path}`;
}

/** A web image written by scripts/make-images.py: one WebP file per width. */
export interface Pic {
  name: string; // file stem in public/images
  widths: number[];
  alt: string;
  w: number; // intrinsic size of the largest file, for the aspect ratio
  h: number;
}

export function srcSet(p: Pic) {
  return p.widths.map((w) => `${url(`/images/${p.name}-${w}.webp`)} ${w}w`).join(", ");
}

export function src(p: Pic) {
  return url(`/images/${p.name}-${p.widths[0]}.webp`);
}

export const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);
