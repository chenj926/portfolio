"use client";
// The CV and the résumé, read in the page: a switch between the two, their pages in a scrolling sheet, and
// the PDF to download. A link can open it on one document (/cv/?doc=resume#read). Without script the first
// document shows and both downloads stay.
import { useEffect, useState } from "react";
import type { Doc } from "@/content/docs";
import { url } from "@/lib/site";

export default function DocViewer({ docs }: { docs: Doc[] }) {
  const [on, setOn] = useState(docs[0].id);
  useEffect(() => {
    const want = new URLSearchParams(location.search).get("doc");
    if (want && docs.some((d) => d.id === want)) setOn(want);
  }, [docs]);
  const doc = docs.find((d) => d.id === on) ?? docs[0];
  return (
    <div className="docs">
      <div className="docs__bar">
        <div className="docs__switch" role="group" aria-label="Document">
          {docs.map((d) => (
            <button
              key={d.id}
              type="button"
              className="docs__opt"
              aria-pressed={d.id === on}
              onClick={() => setOn(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="docs__note">{doc.note}</p>
        <a className="btn btn--secondary docs__dl" href={url(doc.pdf)} download>
          {doc.download}
        </a>
      </div>
      <div className="docs__sheet" tabIndex={0} aria-label={`${doc.label}, ${doc.pages.length} ${doc.pages.length > 1 ? "pages" : "page"}`}>
        {doc.pages.map((p, i) => (
          <img
            key={p}
            className="docs__page"
            src={url(`/docs/${p}-800.webp`)}
            srcSet={`${url(`/docs/${p}-800.webp`)} 800w, ${url(`/docs/${p}-1275.webp`)} 1275w`}
            sizes="(max-width: 639px) 342px, 760px"
            width={1275}
            height={1650}
            alt={`${doc.label}, page ${i + 1} of ${doc.pages.length}`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
    </div>
  );
}
