#!/usr/bin/env node
// A copy of the static export whose pages find their files by relative path, for hosts that serve the site
// under a path of their own (a preview, an artifact). Usage: node scripts/relativize.mjs out preview
// (npm run preview sets PREVIEW_NEXT_DIR=next, for the artifact host)
//   - every page's <base href> (rendered by the layout in a NEXT_PUBLIC_PREVIEW=1 build) points at the site's
//     root, and root-absolute links lose their leading slash, so they resolve against it (page links get
//     index.html)
//   - in-page anchors keep their page (#cite becomes research/hmitl/index.html#cite under the base)
//   - Turbopack's chunk base and the kit's module paths in the JS become relative too
//   - the RSC payload files (.txt), .woff fallbacks, PDFs and the checker's folder are left out, and so are the
//     Noto Serif SC subsets whose unicode-range holds none of the Chinese marks the pages use
import fs from "node:fs";
import path from "node:path";

const [src = "out", dst = "preview"] = process.argv.slice(2);
// some hosts keep names that start with "_" for themselves: PREVIEW_NEXT_DIR=next moves Next's folder there
const NEXT_DIR = process.env.PREVIEW_NEXT_DIR || "_next";
const moveNext = (t) => (NEXT_DIR === "_next" ? t : t.replace(/(^|[^_\w])_next\//g, `$1${NEXT_DIR}/`));
fs.rmSync(dst, { recursive: true, force: true });

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === ".taste-skill") continue;
      walk(p);
    } else files.push(p);
  }
})(src);

const rel = (p) => path.relative(src, p).split(path.sep).join("/");
const html = files.filter((f) => f.endsWith(".html"));

// the Chinese characters the pages use (the vertical marks), to keep only the font subsets that hold them
const han = new Set();
for (const f of html) for (const ch of fs.readFileSync(f, "utf8")) if (/\p{Script=Han}/u.test(ch)) han.add(ch.codePointAt(0));
const keepFont = new Set();
const dropFont = new Set();
for (const f of files.filter((x) => x.endsWith(".css"))) {
  const css = fs.readFileSync(f, "utf8");
  for (const m of css.matchAll(/@font-face\s*{([^}]*)}/g)) {
    const body = m[1];
    if (!/noto-serif-sc/i.test(body)) continue;
    const urls = [...body.matchAll(/url\(([^)]+)\)/g)].map((u) => path.basename(u[1].replace(/["']/g, "")));
    const range = /unicode-range:\s*([^;]+)/.exec(body);
    let hit = !range;
    if (range) {
      for (const part of range[1].split(",")) {
        const [a, b] = part.trim().replace(/^U\+/i, "").split("-");
        const lo = parseInt(a.replace(/\?/g, "0"), 16), hi = b ? parseInt(b, 16) : parseInt(a.replace(/\?/g, "F"), 16);
        for (const c of han) if (c >= lo && c <= hi) hit = true;
      }
    }
    for (const u of urls) (hit ? keepFont : dropFont).add(u);
  }
}

let copied = 0;
for (const f of files) {
  const r = rel(f);
  if (/\.txt$|\.pdf$|\.woff$/.test(r)) continue;
  // such a host refuses every "_" name: Next's build manifests and the not-found page stay out (plain <a>
  // navigation never loads them)
  if (NEXT_DIR !== "_next" && (r.startsWith("_not-found/") || r.split("/").slice(1).some((seg) => seg.startsWith("_")))) continue;
  if (dropFont.has(path.basename(r)) && !keepFont.has(path.basename(r))) continue;
  const out = path.join(dst, r.startsWith("_next/") ? NEXT_DIR + r.slice(5) : r);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (r.endsWith(".html")) {
    const depth = r.split("/").length - 1;
    const base = depth ? "../".repeat(depth) : "./";
    let s = fs.readFileSync(f, "utf8");
    // the layout renders <base href="__SITE_ROOT__"> in a preview build (NEXT_PUBLIC_PREVIEW=1); React keeps
    // an element it rendered itself, where it drops one added after the build. The payload gets the same value.
    if (!s.includes("__SITE_ROOT__")) throw new Error(`${r}: no <base> placeholder; build with NEXT_PUBLIC_PREVIEW=1`);
    s = s.replaceAll("__SITE_ROOT__", base);
    // React hoists the stylesheets and preloads above its own <base>, so the parser meets them first: a copy at
    // the top of <head> is in force from the first byte; hydration drops the copy and the same value stays
    s = s.replace("<head>", `<head><base href="${base}"/>`);
    // in-page anchors keep their page under the base
    s = s.replace(/href="#([^"]*)"/g, (_, h) => `href="${r}#${h}"`);
    // root-absolute links and sources lose the slash; a page link gets its index.html
    s = s.replace(/(href|src|action|poster)="\/(?!\/)([^"]*)"/g, (_, a, p) => {
      const [uq, hash = ""] = p.split("#");
      const [u, query = ""] = uq.split("?");
      const page = u === "" || u.endsWith("/") ? `${u}index.html` : u;
      return `${a}="${page}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}"`;
    });
    s = s.replace(/(srcset|imagesrcset)="([^"]*)"/gi, (_, a, v) => `${a}="${v.replace(/(^|,\s*)\/(?!\/)/g, "$1")}"`);
    // the RSC payload and inline scripts name files from the root too
    s = s.replace(/\\?"\/(_next\/|assets\/|images\/|icons\/|docs\/|site\.css|favicon\.svg|share\.jpg)/g, (m, d) => m.replace(`/${d}`, d));
    s = s.replace(/url\(\\?["']?\/(images|_next)\//g, (m, d) => m.replace(`/${d}/`, `${d}/`));
    fs.writeFileSync(out, moveNext(s));
  } else if (r.endsWith(".js")) {
    let s = fs.readFileSync(f, "utf8");
    s = s.replace(/"\/_next\/"/g, '"_next/"').replace(/(["'`])\/(assets|images|icons|docs)\//g, "$1$2/");
    fs.writeFileSync(out, moveNext(s));
  } else fs.copyFileSync(f, out);
  copied++;
}
console.log(`${copied} files in ${dst} (${keepFont.size} of ${keepFont.size + dropFont.size} Noto Serif SC subsets kept)`);
