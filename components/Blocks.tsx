// The pieces sections are built from: open tiles for anything with a picture, rows for lists.
import type { CSSProperties, ReactNode } from "react";
import type { Project } from "@/content/projects";
import { type Research, statusLine } from "@/content/research";
import { url } from "@/lib/site";
import { Diagram } from "./Diagrams";
import { Icon, Picture } from "./Media";

export const h = (n: number): CSSProperties => ({ ["--h" as string]: n });

export function ResearchTile({ r, sizes, className = "span-6", headingLevel = 3 }: { r: Research; sizes: string; className?: string; headingLevel?: 3 | 4 }) {
  const H = headingLevel === 3 ? "h3" : "h4";
  return (
    <a className={`tile ${className}`} href={url(`/research/${r.slug}/`)}>
      <div className={`tile__media${r.figure && r.figure.h > r.figure.w ? " tile__media--figure" : ""}${r.diagram ? " tile__media--diagram" : ""}`}>
        {r.figure ? <Picture pic={r.figure} sizes={sizes} /> : r.diagram ? <Diagram id={r.diagram} /> : null}
      </div>
      <div className="tile__words">
        <p className="tile__meta">
          <span>{statusLine(r)}</span>
          {r.institution && <span>{r.institution}</span>}
        </p>
        <H className="tile__title">{r.kind === "paper" ? r.title : r.h1}</H>
        <p className="tile__line">{r.kind === "paper" ? (r.authors ?? []).join(", ") : r.summary}</p>
      </div>
    </a>
  );
}

export function ProjectTile({ p, sizes, className = "span-4" }: { p: Project; sizes: string; className?: string }) {
  return (
    <a className={`tile ${className}`} href={url(`/projects/${p.slug}/`)} data-tags={p.tags.join("|")}>
      <div className={`tile__media${p.diagram ? " tile__media--diagram" : ""}`}>
        {p.cover ? <Picture pic={p.cover} sizes={sizes} /> : p.diagram ? <Diagram id={p.diagram} /> : null}
      </div>
      <div className="tile__words">
        <p className="tile__meta">
          <span>{p.tags.join(", ")}</span>
          {p.year && <span>{p.year}</span>}
        </p>
        <h3 className="tile__title">{p.name}</h3>
        <p className="tile__line">{p.line}</p>
      </div>
    </a>
  );
}

export function StackRow({ items }: { items: { label: string; icon?: string }[] }) {
  if (!items.length) return null;
  return (
    <ul className="stack-row" aria-label="Built with">
      {items.map((s) => (
        <li key={s.label}>
          {s.icon ? <Icon id={s.icon} size={18} /> : <span className="stack-row__dot" aria-hidden="true" />}
          {s.label}
        </li>
      ))}
    </ul>
  );
}

export function SectionHead({ id, title, run, lead, mark, action }: { id: string; title: string; run?: string; lead?: ReactNode; mark: string; action?: ReactNode }) {
  return (
    <div className="section-head section-head--row head-row">
      <div className="head-row__text">
        <h2 id={id}>
          {title}
          {run && (
            <>
              {" "}
              <span className="muted">{run}</span>
            </>
          )}
        </h2>
        {lead && <p className="head-row__lead">{lead}</p>}
      </div>
      <div className="head-row__side">
        {action}
        <span className="zh-mark" lang="zh-Hans" aria-hidden="true">
          {mark}
        </span>
      </div>
    </div>
  );
}
