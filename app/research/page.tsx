/* Research (second level). The deal: hero collage (the HMITL figure in a window, its headline result on a
   card) · moment word-highlight (the statement) · the home's palette, type, nav, close and footer. */
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { h, SectionHead } from "@/components/Blocks";
import { Diagram } from "@/components/Diagrams";
import { Mark, Picture } from "@/components/Media";
import { positions } from "@/content/experience";
import { currentWork, findResearch, papers, statusLine, studies } from "@/content/research";
import { url } from "@/lib/site";

export const metadata: Metadata = {
  title: "Research: Jialuo Chen, AI researcher in Toronto",
  description:
    "Research by Jialuo (Eric) Chen: HMITL at IEEE ICHI 2026, role-aware Bayesian optimization under uncertainty, Surgical DeltaNet for linear attention, XR World Models at the University of Toronto and a hidden-state steering study.",
};

// one paper a screen, two to a section (a section is one screen or two); a third paper opens a second section
const pairs = <T,>(list: T[]) => list.reduce<T[][]>((out, x, i) => (i % 2 ? out[out.length - 1].push(x) : out.push([x]), out), []);
// the line beside the papers' heading: written by hand, so check it when a paper is added or changes status
const PAPERS_RUN = "One at IEEE ICHI, one manuscript.";
const STUDIES_RUN = "A finished study, April 2026.";

export default function ResearchPage() {
  const hmitl = findResearch("hmitl")!;
  const top = hmitl.results![0];
  return (
    <>
      <SiteHeader current="Research" />
      <main id="top">
        <section className="hero hero--collage" data-enter aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text grid hero__grid">
              <div className="hero__text span-5">
                <h1 id="hero-h">Research on uncertainty and efficient attention</h1>
                <p className="hero__lead">
                  Two papers, two projects in progress and a finished study: governed LLM pipelines, role-aware Bayesian
                  optimization, memory for linear attention, an XR world model and hidden-state steering.
                </p>
                <div className="btn-row">
                  <a className="btn btn--primary" href="#papers">
                    See the papers
                  </a>
                  <a className="btn btn--secondary" href={url("/cv/")}>
                    Read my CV
                  </a>
                </div>
                <p className="hero__proof">First author at IEEE ICHI 2026, pages 1218 to 1226.</p>
              </div>
              <div
                className="hero__art span-6 start-7"
                role="img"
                aria-label="The HMITL protocol figure in a window, and a card with its 30-day readmission result: Macro-F1 from 0.6198 to 0.9014."
              >
                <div className="ly-piece ly-piece--main rwin" aria-hidden="true">
                  <div className="rwin__bar">
                    <span>{hmitl.short}</span>
                    <span>{hmitl.status}</span>
                  </div>
                  <div className="rwin__body">
                    <Picture pic={hmitl.figure!} sizes="(max-width: 639px) 340px, 600px" eager />
                  </div>
                </div>
                <div className="ly-piece rnote" aria-hidden="true">
                  <span className="rnote__k">{top.task}, {top.metric}</span>
                  <span className="rnote__v">
                    {top.baseline} <span className="rnote__to">to</span> {top.result}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {pairs(papers).map((pair, n) => (
          <section
            key={n}
            className={`section${pair.length > 1 ? " g2 m2" : ""}`}
            id={n ? `papers-${n + 1}` : "papers"}
            style={h(pair.length)}
            aria-labelledby={n ? undefined : "papers-h"}
            aria-label={n ? "More research papers" : undefined}
          >
            <div className="wrap">
              {pair.map((p, k) => (
                <div key={p.slug} className="group">
                  {n === 0 && k === 0 && <SectionHead id="papers-h" title="Research papers." run={PAPERS_RUN} mark="论著" />}
                  <article className="grid paper">
                    <div className="span-6 paper__words">
                      <p className="tile__meta">
                        <span>{statusLine(p)}</span>
                        {p.institution && <span>{p.institution}</span>}
                      </p>
                      <h3 className="paper__title">
                        <a href={url(`/research/${p.slug}/`)}>{p.title}</a>
                      </h3>
                      <p className="paper__authors">{(p.authors ?? []).join(", ")}</p>
                      <p className="paper__summary">{p.summary}</p>
                      <p className="paper__links">
                        <a className="link" href={url(`/research/${p.slug}/`)}>
                          Read the summary
                        </a>
                        {p.links.slice(0, 2).map((l) => (
                          <a key={l.href} className="link" href={l.href} rel="noopener">
                            {l.label}
                          </a>
                        ))}
                      </p>
                    </div>
                    <div className={`span-6 paper__visual tile__media${p.figure ? " tile__media--figure" : " tile__media--diagram"}`}>
                      {p.figure ? <Picture pic={p.figure} sizes="(max-width: 1023px) 100vw, 628px" /> : p.diagram ? <Diagram id={p.diagram} /> : null}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="section wh" id="statement" data-moment="word-highlight" aria-label="What the research is about">
          <div className="wrap">
            <p className="mo-wh__text">
              I study how to decide well under uncertainty and how to attend efficiently: <strong>Bayesian optimization</strong>{" "}
              that gives each input its role, LLM pipelines a human manager can audit, and linear attention that keeps what
              matters.
            </p>
          </div>
        </section>

        <section className="section" id="current" aria-labelledby="current-h">
          <div className="wrap">
            <SectionHead id="current-h" title="Current research." run="Two projects in progress, since 2026." mark="近况" />
            <div className="grid">
              {currentWork.map((w) => (
                <a key={w.slug} className="tile span-6" href={url(`/research/${w.slug}/`)}>
                  <div className={`tile__media tile__media--wide${w.diagram ? " tile__media--diagram" : ""}`}>
                    {w.figure ? <Picture pic={w.figure} sizes="(max-width: 1023px) 100vw, 628px" /> : w.diagram ? <Diagram id={w.diagram} /> : null}
                  </div>
                  <div className="tile__words">
                    <p className="tile__meta">
                      <span>
                        {w.institution}, with {w.advisor}
                      </span>
                      <span>{w.period}</span>
                    </p>
                    <h3 className="tile__title">{w.h1}</h3>
                    <p className="tile__line">{w.summary}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {studies.length > 0 && (
          <section className="section" id="studies" aria-labelledby="studies-h">
            <div className="wrap">
              <SectionHead id="studies-h" title="Earlier research." run={STUDIES_RUN} mark="旧作" />
              {studies.map((w) => (
                <article key={w.slug} className="grid paper">
                  <div className="span-6 paper__words">
                    <p className="tile__meta">
                      <span>{statusLine(w)}</span>
                      <span>{w.institution}</span>
                    </p>
                    <h3 className="paper__title">
                      <a href={url(`/research/${w.slug}/`)}>{w.title}</a>
                    </h3>
                    <p className="paper__authors">With {w.advisor}</p>
                    <p className="paper__summary">{w.summary}</p>
                    <p className="paper__links">
                      <a className="link" href={url(`/research/${w.slug}/`)}>
                        Read the summary
                      </a>
                      {w.links.slice(0, 1).map((l) => (
                        <a key={l.href} className="link" href={l.href} rel="noopener">
                          {l.label}
                        </a>
                      ))}
                    </p>
                  </div>
                  <div className={`span-6 paper__visual tile__media${w.figure ? " tile__media--figure" : " tile__media--diagram"}`}>
                    {w.figure ? <Picture pic={w.figure} sizes="(max-width: 1023px) 100vw, 628px" /> : w.diagram ? <Diagram id={w.diagram} /> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="section ground-surface m2" id="advisors" aria-labelledby="advisors-h">
          <div className="wrap">
            <SectionHead id="advisors-h" title="Advisors." run="Research positions at two universities." mark="师承" />
            <div className="grid labs">
              {positions.map((x) => {
                const w = x.research ? findResearch(x.research) : undefined;
                const Card = w ? "a" : "div";
                return (
                  <Card key={x.role + x.when} className="lab span-4" {...(w ? { href: url(`/research/${w.slug}/`) } : {})}>
                    <span className={`lab__visual tile__media${w?.gallery ? "" : " tile__media--diagram"}`}>
                      {w?.gallery ? (
                        <Picture pic={w.gallery[0]} sizes="(max-width: 639px) 342px, 410px" />
                      ) : w?.diagram ? (
                        <Diagram id={w.diagram} />
                      ) : (
                        <span className="lab__plate">
                          <Mark id={x.mark} />
                        </span>
                      )}
                    </span>
                    <span className="lab__words">
                      <span className="lab__badge">
                        <Mark id={x.mark} />
                      </span>
                      <span className="lab__advisor">{x.advisor}</span>
                      <span className="lab__name">{x.role}</span>
                      <span className="lab__where">
                        {x.institution}, {x.when}
                      </span>
                      <span className="lab__topic">{x.topic}</span>
                    </span>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
