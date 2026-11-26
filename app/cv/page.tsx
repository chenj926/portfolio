/* CV (second level). The deal: hero triptych (the headline, the documents' pages in a collage that changes
   set, one large download button) · moment iris-opens (the reader, on the surface ground) · the home's
   palette, type, nav, close and footer. The phone number and street address are taken out of the
   published PDFs and page images (true redaction, scripts outside the repo). */
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { SectionHead } from "@/components/Blocks";
import DocViewer from "@/components/DocViewer";
import { documents } from "@/content/docs";
import { url } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV: Jialuo Chen, AI researcher and engineer",
  description:
    "The CV and the one-page résumé of Jialuo (Eric) Chen, AI researcher and engineer at the University of Toronto, to read here or download as PDF.",
};


function Page({ name, alt, style }: { name: string; alt?: string; style: CSSProperties }) {
  return (
    <div className="ly-piece doc-piece" style={style}>
      <img src={url(`/docs/${name}-800.webp`)} width={800} height={1035} alt={alt ?? ""} loading="eager" />
    </div>
  );
}

export default function CvPage() {
  return (
    <>
      <SiteHeader current="CV" />
      <main id="top">
        <section className="hero hero--triptych" data-enter aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text grid hero__grid">
              <div className="span-3">
                <h1 id="hero-h">Research CV and engineering résumé</h1>
                <p className="hero__lead">
                  The CV, two pages, is for research programs; the one-page résumé is for engineering roles. Both are from
                  2026, to read here or download.
                </p>
              </div>
              <div className="ly-collage span-6 start-4" role="img" aria-label="The two pages of the CV and the page of the résumé.">
                <div className="ly-collage__set is-on">
                  <Page name="cv-1" style={{ left: "3%", top: "4%", width: "46%", height: "88%" }} />
                  <Page name="cv-2" style={{ left: "51%", top: "8%", width: "46%", height: "88%" }} />
                </div>
                <div className="ly-collage__set" aria-hidden="true">
                  <Page name="resume-1" style={{ left: "25%", top: "4%", width: "50%", height: "92%" }} />
                </div>
              </div>
              <div className="span-3 start-10 hero__cta">
                <a className="btn btn--primary" href={url(documents[0].pdf)} download>
                  Download my CV
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section ground-surface" id="read" data-moment="iris-opens" data-moment-opts='{"from": "base"}' aria-labelledby="read-h">
          <div className="wrap">
            <SectionHead id="read-h" title="Read the CV and the résumé." run="Scroll the pages here." mark="履历" />
            <DocViewer docs={documents} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
