/* A paper or a piece of current research (third level). The deal: hero collage (the figure in a window, the
   headline result on a card) · moments word-highlight (the statement) and counter-rolls (the figures) ·
   the home's palette, type, nav, close and footer. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { ResearchTile, SectionHead } from "@/components/Blocks";
import Bibtex from "@/components/Bibtex";
import { Diagram } from "@/components/Diagrams";
import { Icon, Picture } from "@/components/Media";
import { findResearch, research, statusLine, type Research } from "@/content/research";
import { mailto } from "@/content/site";
import { url } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return research.map((r) => ({ slug: r.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const r = findResearch((await params).slug);
  if (!r) return {};
  return { title: `${r.short}: research by Jialuo Chen`, description: `${r.title}. ${r.summary}` };
}

function Visual({ r, sizes, eager }: { r: Research; sizes: string; eager?: boolean }) {
  if (r.figure) return <Picture pic={r.figure} sizes={sizes} eager={eager} />;
  if (r.diagram) return <Diagram id={r.diagram} />;
  return null;
}

export default async function ResearchItem({ params }: Params) {
  const r = findResearch((await params).slug);
  if (!r) notFound();
  const card = r.card;
  const figures = r.figures ?? [];
  const paper = r.kind === "paper";
  const since = r.period?.split(" to ")[0];
  const where = [r.institution, r.advisor && `with ${r.advisor}`].filter(Boolean).join(", ");
  const [first, second] = r.links;
  const others = research.filter((x) => x.slug !== r.slug);
  const tall = !!r.figure && r.figure.h > r.figure.w * 1.15;
  const cut = r.summary.search(/\.\s/);
  const lead = cut > 0 ? [r.summary.slice(0, cut + 1), r.summary.slice(cut + 2)] : [r.summary, ""];
  // figures with no table, list or gallery of their own stand under the statement
  const figsUp = !r.results && !r.experiments && !r.gallery;
  return (
    <>
      <SiteHeader current="Research" />
      <main id="top">
        <section className="hero hero--collage hero--detail" data-enter aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text grid hero__grid">
              <div className="hero__text span-5">
                <p className="hero__kicker">
                  <span className="dot" aria-hidden="true" />
                  {paper ? (r.status.includes(r.year) ? r.status : `${r.status}, ${r.year}`) : `${r.status}, since ${since}`}
                </p>
                <h1 id="hero-h">{r.h1}</h1>
                <p className="hero__lead">
                  {lead[0]}
                  {lead[1] && <span className="hero__lead-more"> {lead[1]}</span>}
                </p>
                <div className="btn-row">
                  {first ? (
                    <a className="btn btn--primary" href={first.href} rel="noopener">
                      {first.label}
                    </a>
                  ) : (
                    <a className="btn btn--primary" href={`${mailto}?subject=${encodeURIComponent(r.short)}`}>
                      Email me about it
                    </a>
                  )}
                  {paper && r.bibtex ? (
                    <a className="btn btn--secondary" href="#cite">
                      Cite the paper
                    </a>
                  ) : second ? (
                    <a className="btn btn--secondary" href={second.href} rel="noopener">
                      {second.label}
                    </a>
                  ) : (
                    <a className="btn btn--secondary" href={url("/cv/")}>
                      Read my CV
                    </a>
                  )}
                </div>
                <p className="hero__proof">{paper ? (r.authors ?? []).join(", ") : where}</p>
              </div>
              <div className="hero__art span-6 start-7" role="img" aria-label={`${r.figure?.alt ?? r.title}. ${card.k}: ${card.v}.`}>
                <div className={`ly-piece ly-piece--main rwin${tall ? " rwin--tall" : ""}${r.diagram ? " rwin--diagram" : ""}`} aria-hidden="true">
                  <div className="rwin__bar">
                    <span>{r.short}</span>
                    <span>{paper ? r.status : r.institution}</span>
                  </div>
                  <div className="rwin__body">
                    <Visual r={r} sizes="(max-width: 639px) 340px, 600px" eager />
                  </div>
                  {!tall && (
                    <div className="rnote rnote--in">
                      <span className="rnote__k">{card.k}</span>
                      <span className="rnote__v">{card.v}</span>
                    </div>
                  )}
                </div>
                {tall && (
                  <div className="ly-piece rnote" aria-hidden="true">
                    <span className="rnote__k">{card.k}</span>
                    <span className="rnote__v">{card.v}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section wh" id="statement" data-moment="word-highlight" aria-label={`${r.short} in brief`}>
          <div className="wrap">
            <p className="mo-wh__text">{r.statement}</p>
            {figsUp && (
              <div className="grid figs figs--under">
                {figures.map((x) => (
                  <div key={x.k} className="span-4 fig">
                    <p className="t-stat">{x.v}</p>
                    <p className="fig__k">{x.k}</p>
                    {x.note && <p className="fig__note">{x.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={`section${r.points.length > 4 || r.points.reduce((n, x) => n + x.body.length, 0) > 600 ? " m2" : ""}`} id="parts" aria-labelledby="parts-h">
          <div className="wrap">
            <SectionHead id="parts-h" title={`${r.pointsHeading}.`} run={paper ? r.title.split(":")[0] : `${where}.`} mark="方法" />
            <div className="grid parts">
              <ol className={`span-6 parts__list${r.points.length > 4 || r.points.reduce((n, x) => n + x.body.length, 0) > 380 ? " parts__list--dense" : ""}`}>
                {r.points.map((pt) => (
                  <li key={pt.title}>
                    <h3>{pt.title}</h3>
                    <p>{pt.body}</p>
                  </li>
                ))}
              </ol>
              <div className={`span-6 parts__visual tile__media${r.gallery || !r.figure ? "" : " tile__media--figure"}${r.diagram ? " tile__media--diagram" : ""}`}>
                {r.gallery ? <Picture pic={r.gallery[1]} sizes="(max-width: 1023px) 100vw, 628px" /> : <Visual r={r} sizes="(max-width: 1023px) 100vw, 628px" />}
              </div>
            </div>
          </div>
        </section>

        {!figsUp && (
        <section className={`section${r.results || r.gallery ? " m2" : ""}`} id="results" aria-labelledby="results-h">
          <div className="wrap">
            {r.results ? (
              <>
                <SectionHead id="results-h" title={r.resultsHead?.title ?? "Results."} run={r.resultsHead?.run} mark="实证" />
                <div className="grid figs" data-moment="counter-rolls">
                  {r.results.map((x) => (
                    <div key={x.task} className="span-4 fig">
                      <p className="fig__k">{x.task}</p>
                      <p className="t-stat">{x.result}</p>
                      <p className="fig__note">
                        {x.metric}, {x.better} is better; from {x.baseline}. {x.setting}.
                      </p>
                    </div>
                  ))}
                </div>
                <div className="results__foot">
                  <p className="results__note">
                    {r.resultNote} {r.origin}
                  </p>
                  <div className="results__links">
                    {r.links.map((l) => (
                      <a key={l.href} className="link" href={l.href} rel="noopener">
                        {l.icon && <Icon id={l.icon} size={18} />}
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <SectionHead
                  id="results-h"
                  title={r.resultsHead?.title ?? (paper ? "Experiments." : "Research in numbers.")}
                  run={r.resultsHead?.run ?? `${r.institution}, ${r.period}.`}
                  mark="实证"
                />
                <div className="grid figs" data-moment="counter-rolls">
                  {figures.map((x) => (
                    <div key={x.k} className="span-4 fig">
                      <p className="t-stat">{x.v}</p>
                      <p className="fig__k">{x.k}</p>
                      {x.note && <p className="fig__note">{x.note}</p>}
                    </div>
                  ))}
                </div>
                {r.experiments ? (
                  <ul className="results__list">
                    {r.experiments.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                ) : r.gallery ? (
                  <div className="grid results__gallery">
                    {r.gallery.map((g) => (
                      <figure key={g.name} className="span-4 results__frame">
                        <Picture pic={g} sizes="(max-width: 639px) 342px, 410px" />
                      </figure>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
        )}

        {paper && r.bibtex && (
          <section className="section ground-surface" id="cite" aria-labelledby="cite-h">
            <div className="wrap">
              <SectionHead id="cite-h" title={`Cite ${r.short}.`} run={r.pages ? `${r.status}, pages ${r.pages}.` : `${statusLine(r)}.`} mark="引用" />
              <div className="grid cite">
                <div className="span-6">
                  <Bibtex text={r.bibtex} />
                </div>
                <div className="span-6 tile__media tile__media--figure cite__figure">
                  <Picture pic={r.figure!} sizes="410px" />
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="section" id="more" aria-labelledby="more-h">
          <div className="wrap">
            <SectionHead
              id="more-h"
              title="More research."
              mark="续篇"
              action={
                <a className="link" href={url("/research/")}>
                  See all research
                </a>
              }
            />
            <div className="grid">
              {others.map((o) => (
                <ResearchTile key={o.slug} r={o} className="span-4" sizes="(max-width: 639px) 342px, (max-width: 1023px) 50vw, 410px" />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
