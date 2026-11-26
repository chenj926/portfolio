/* A project (third level). The deal: hero split, re-dealt to collage so every third-level page shares one
   template (the projects' pictures are wide posters, which a split's 628 x 740 frame would crop to their
   middle) · moments word-highlight (the statement) and pinned-chapters (the steps, where each step has a
   picture) · the home's palette, type, nav, close and footer. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { ProjectTile, SectionHead, StackRow } from "@/components/Blocks";
import { Diagram } from "@/components/Diagrams";
import { Icon, Picture } from "@/components/Media";
import { findProject, projects, type Project } from "@/content/projects";
import { mailto } from "@/content/site";
import { url } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = findProject((await params).slug);
  if (!p) return {};
  return { title: `${p.name}: a project by Jialuo Chen`, description: p.summary };
}

function Main({ p, sizes, eager }: { p: Project; sizes: string; eager?: boolean }) {
  const pic = p.hero ?? p.cover;
  if (pic) return <Picture pic={pic} sizes={sizes} eager={eager} />;
  if (p.diagram) return <Diagram id={p.diagram} />;
  return null;
}

export default async function ProjectItem({ params }: Params) {
  const p = findProject((await params).slug);
  if (!p) notFound();
  const card = p.card;
  const statement = p.statement;
  const visuals = p.stepVisuals;
  const [first, second] = p.links;
  const i = projects.indexOf(p);
  const more = [1, 2, 3].map((k) => projects[(i + k) % projects.length]);
  const pic = p.hero ?? p.cover;
  const cut = p.summary.search(/\.\s/);
  const lead = cut > 0 ? [p.summary.slice(0, cut + 1), p.summary.slice(cut + 2)] : [p.summary, ""];
  const twoScreens = p.stepsScreens === 2;
  return (
    <>
      <SiteHeader current="Projects" />
      <main id="top">
        <section className="hero hero--collage hero--detail" data-enter aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text grid hero__grid">
              <div className="hero__text span-5">
                <p className="hero__kicker">
                  <span className="dot" aria-hidden="true" />
                  {[p.tags.join(", "), p.when].filter(Boolean).join(", ")}
                </p>
                <h1 id="hero-h">{p.h1}</h1>
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
                    <a className="btn btn--primary" href={`${mailto}?subject=${encodeURIComponent(p.name)}`}>
                      Email me about it
                    </a>
                  )}
                  {second ? (
                    <a className="btn btn--secondary" href={second.href} rel="noopener">
                      {second.label}
                    </a>
                  ) : (
                    <a className="btn btn--secondary" href={url("/projects/")}>
                      See all projects
                    </a>
                  )}
                </div>
              </div>
              <div className="hero__art span-6 start-7" role="img" aria-label={`${pic?.alt ?? p.name}. ${card.k}: ${card.v}.`}>
                <div className={`ly-piece ly-piece--main rwin${pic ? "" : " rwin--diagram"}`} aria-hidden="true">
                  <div className="rwin__bar">
                    <span>{p.name}</span>
                    <span>{p.year || p.tags[0]}</span>
                  </div>
                  <div className="rwin__body">
                    <Main p={p} sizes="(max-width: 639px) 340px, 600px" eager />
                  </div>
                  <div className="rnote rnote--in">
                    <span className="rnote__k">{card.k}</span>
                    <span className="rnote__v">{card.v}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section wh wh--facts" id="statement" data-moment="word-highlight" aria-label={`${p.name} in brief`}>
          <div className="wrap">
            <p className="mo-wh__text">{statement}</p>
            <div className="grid facts">
              <dl className="span-6 facts__list">
                {p.facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="span-6 facts__side">
                {p.stack.length > 0 && <StackRow items={p.stack} />}
                {p.links.length > 0 && (
                  <p className="facts__links">
                    {p.links.map((l) => (
                      <a key={l.href} className="link" href={l.href} rel="noopener">
                        {l.icon && <Icon id={l.icon} size={18} />}
                        {l.label}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {visuals ? (
          <section
            className={`section${twoScreens ? " m2" : ""} steps-pinned steps-pinned--${p.stepsShape ?? "plate"}`}
            id="steps"
            data-moment="pinned-chapters"
            aria-labelledby="steps-h"
          >
            <div className="wrap mo-pc__grid">
              <div className="mo-pc__text">
                <h2 id="steps-h">{p.stepsHeading}</h2>
                <ol className="mo-pc__steps">
                  {p.steps.map((s, k) => {
                    const v = visuals[k];
                    return (
                      <li key={s.title} className="mo-pc__step">
                        <h3>{s.title}</h3>
                        <p>{s.body}</p>
                        <figure className={`mo-pc__visual${"focus" in v ? " mo-pc__visual--diagram" : ""}`}>
                          {"pic" in v ? <Picture pic={v.pic} sizes="(max-width: 1023px) 100vw, 640px" /> : <Diagram id={p.diagram!} focus={v.focus} />}
                        </figure>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="mo-pc__visuals frame" />
            </div>
          </section>
        ) : (
          <section className={`section${twoScreens ? " m2" : ""}`} id="steps" aria-labelledby="steps-h">
            <div className="wrap">
              <SectionHead id="steps-h" title={`${p.stepsHeading}.`} run={p.name} mark="法度" />
              <div className="grid parts">
                <ol className={`span-6 parts__list${p.steps.reduce((n, x) => n + x.body.length, 0) > 340 ? " parts__list--dense" : ""}`}>
                  {p.steps.map((s) => (
                    <li key={s.title}>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </li>
                  ))}
                </ol>
                <div className={`span-6 parts__visual tile__media${p.diagram ? " tile__media--diagram" : ""}`}>
                  {p.diagram ? <Diagram id={p.diagram} /> : p.cover ? <Picture pic={p.cover} sizes="(max-width: 1023px) 100vw, 628px" /> : null}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="section" id="more" aria-labelledby="more-h">
          <div className="wrap">
            <SectionHead
              id="more-h"
              title="More engineering projects."
              mark="续篇"
              action={
                <a className="link" href={url("/projects/")}>
                  See all projects
                </a>
              }
            />
            <div className="grid">
              {more.map((m) => (
                <ProjectTile key={m.slug} p={m} sizes="(max-width: 639px) 342px, (max-width: 1023px) 50vw, 410px" />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
