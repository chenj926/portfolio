// Checks the content files at build time, so a missing picture, icon or page link stops the build with a
// plain message instead of shipping a broken page. Called once from app/layout.tsx; it runs on the server
// only (the build and `next dev`), never in the browser.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { education, jobs, positions, updates } from "@/content/experience";
import { avatar, pastimes, portrait } from "@/content/life";
import { marks } from "@/content/marks";
import { projects } from "@/content/projects";
import { research } from "@/content/research";
import type { Pic } from "@/lib/site";

let done = false;

export function validateContent() {
  if (done) return;
  done = true;
  const problems: string[] = [];
  const has = (path: string) => existsSync(join(process.cwd(), "public", path));
  const pic = (where: string, p?: Pic) => {
    if (!p) return;
    for (const w of p.widths) if (!has(`images/${p.name}-${w}.webp`)) problems.push(`${where}: public/images/${p.name}-${w}.webp is missing (scripts/images.mjs makes it)`);
    if (!p.alt.trim()) problems.push(`${where}: the picture ${p.name} has no alt text`);
  };
  const icon = (where: string, id?: string) => {
    if (id && !has(`icons/${id}.svg`)) problems.push(`${where}: public/icons/${id}.svg is missing (add it to scripts/build-icons.mjs)`);
  };
  const unique = (kind: string, slugs: string[]) => {
    for (const s of slugs) if (slugs.indexOf(s) !== slugs.lastIndexOf(s)) problems.push(`${kind}: the slug "${s}" is used twice`);
    for (const s of slugs) if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) problems.push(`${kind}: the slug "${s}" should be lowercase words joined by hyphens`);
  };

  unique("research", research.map((r) => r.slug));
  unique("projects", projects.map((p) => p.slug));
  const pages = new Set(["/", "/research/", "/projects/", "/about/", "/cv/", ...research.map((r) => `/research/${r.slug}/`), ...projects.map((p) => `/projects/${p.slug}/`)]);

  for (const r of research) {
    const at = `research "${r.slug}"`;
    pic(at, r.figure);
    r.gallery?.forEach((g) => pic(at, g));
    r.links.forEach((l) => icon(at, l.icon));
    if (!r.figure && !r.diagram) problems.push(`${at}: give it a figure or a diagram`);
    if (r.h1.length > 60) problems.push(`${at}: the h1 has ${r.h1.length} characters; keep it to 55 or so`);
    if (!r.results && !r.experiments && !r.figures?.length) problems.push(`${at}: give it results, experiments or three figures`);
  }
  for (const p of projects) {
    const at = `project "${p.slug}"`;
    pic(at, p.cover);
    pic(at, p.hero);
    p.gallery?.forEach((g) => pic(at, g));
    p.stack.forEach((s) => icon(at, s.icon));
    p.links.forEach((l) => icon(at, l.icon));
    if (!p.cover && !p.diagram) problems.push(`${at}: give it a cover picture or a diagram`);
    if (p.h1.length > 60) problems.push(`${at}: the h1 has ${p.h1.length} characters; keep it to 55 or so`);
    if (p.stepVisuals) {
      if (p.stepVisuals.length !== p.steps.length) problems.push(`${at}: ${p.steps.length} steps but ${p.stepVisuals.length} step visuals`);
      p.stepVisuals.forEach((v) => ("pic" in v ? pic(at, v.pic) : !p.diagram && problems.push(`${at}: a step lights a diagram the project does not have`)));
    }
  }
  for (const x of positions) if (x.research && !research.some((r) => r.slug === x.research)) problems.push(`position "${x.role}": no research page "${x.research}"`);
  for (const u of updates) if (u.href?.startsWith("/") && !pages.has(u.href)) problems.push(`news "${u.what}": no page at ${u.href}`);
  for (const [id, m] of Object.entries(marks)) if (!has(m.src.slice(1))) problems.push(`mark "${id}": public${m.src} is missing`);
  if (!education.length) problems.push("education: the hero needs at least one entry");
  if (!jobs.length) problems.push("jobs: the Experience section needs at least one entry");
  [portrait, avatar, ...pastimes.map((x) => x.pic)].forEach((p) => pic("life", p));

  if (problems.length) throw new Error(`The content check found ${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
}
