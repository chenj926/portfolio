/* Projects (second level). The deal: hero film, re-dealt to collage: the projects have two real films, the
   XR capstone's and NeuroCommute's demos, and a frame of each sits in its own window with its play button
   (a demo frame is a wide screen recording or a square headset view, which a cinema frame would crop) ·
   moment liquid-type on the headline · the home's palette, type, nav, close and footer. */
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { h, SectionHead } from "@/components/Blocks";
import { Diagram } from "@/components/Diagrams";
import { Icon, Picture } from "@/components/Media";
import { toolkit, methods } from "@/content/life";
import { findProject, projects, type Project } from "@/content/projects";
import { url } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects: Jialuo Chen, AI researcher and engineer",
  description:
    "Projects by Jialuo (Eric) Chen: an XR capstone on a Meta Quest 3, NeuroCommute, ADHD Scholarship Copilot, LineToLive, a Multimodal Risk Predictor, a P&G business case and Personal WealthTracker.",
};

const COUNT: Record<number, string> = { 5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten" };

function Row({ p }: { p: Project }) {
  // the row's frame is wide (2:1): a wide demo frame fits it whole, a 4:3 cover is cut to its middle; a
  // phone's square frame takes the 4:3 cover
  const pic = p.hero && p.hero.w / p.hero.h >= 1.6 ? p.hero : p.cover;
  return (
    <article className="prow span-12">
      <div className="prow__media" aria-hidden="true">
        <span className={`tile__media m-zoom${p.diagram && !p.cover ? " tile__media--diagram" : ""}`}>
          {pic && pic !== p.cover && p.cover ? (
            <>
              <Picture className="prow__wide" pic={pic} sizes="(max-width: 639px) 1px, 302px" />
              <Picture className="prow__narrow" pic={p.cover} sizes="(max-width: 639px) 220px, 1px" />
            </>
          ) : pic ? (
            <Picture pic={pic} sizes="(max-width: 639px) 220px, 302px" />
          ) : p.diagram ? (
            <Diagram id={p.diagram} />
          ) : null}
        </span>
      </div>
      <div className="prow__words">
        <p className="tile__meta">
          <span>{p.tags.join(", ")}</span>
          {p.when && <span>{p.when}</span>}
        </p>
        <h3 className="prow__name">
          <a href={url(`/projects/${p.slug}/`)}>{p.name}</a>
        </h3>
        <p className="prow__line">{p.line}</p>
      </div>
      <div className="prow__side">
        <p className="prow__links">
          <a className="link" href={url(`/projects/${p.slug}/`)}>
            Read how it works
          </a>
        </p>
      </div>
    </article>
  );
}

// the two demos in the hero, the wide one first; any project with a picture and a YouTube link can stand here
const FILMS = ["neurocommute", "xr-capstone"];

export default function ProjectsPage() {
  const films = FILMS.map((slug) => findProject(slug))
    .map((p) => ({ p: p!, demo: p?.links.find((l) => /youtu/.test(l.href))?.href }))
    .filter((f): f is { p: Project; demo: string } => !!f.p?.hero && !!f.demo);
  return (
    <>
      <SiteHeader current="Projects" />
      <main id="top">
        <section className="hero hero--collage" data-enter aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text grid hero__grid">
              <div className="hero__text span-5">
                <h1 id="hero-h" data-moment="liquid-type" data-moment-opts='{"strength": 0.8}'>
                  Engineering projects, built and measured
                </h1>
                <p className="hero__lead">
                  An XR system for machine inspections on a Meta Quest 3, a Toronto transit planner, a scholarship copilot for
                  students with ADHD and four more, with their demos, code and decks where they are public.
                </p>
                <div className="btn-row">
                  <a className="btn btn--primary" href="#all">
                    See the projects
                  </a>
                  <a className="btn btn--secondary" href="https://github.com/chenj926" rel="noopener">
                    See my GitHub
                  </a>
                </div>
              </div>
              <div className="hero__art hero__art--pair span-6 start-7">
                {films.map(({ p, demo }, k) => (
                  <a key={p.slug} className={`ly-piece rwin rwin--film ${k ? "rwin--b" : "ly-piece--main rwin--a"}`} href={demo} rel="noopener" aria-label={`Watch the ${p.name} demo on YouTube`}>
                    <span className="rwin__bar">
                      <span>{p.name}</span>
                      <span>Demo on YouTube</span>
                    </span>
                    <span className="rwin__body">
                      <Picture pic={p.hero!} sizes={k ? "(max-width: 639px) 1px, (max-width: 1023px) 260px, 300px" : "(max-width: 639px) 342px, (max-width: 1023px) 540px, 460px"} eager />
                      <span className="rwin__play" aria-hidden="true">
                        <svg viewBox="0 0 18 18">
                          <path d="M4.5 2.6v12.8c0 .8.9 1.3 1.6.9l10.3-6.4c.6-.4.6-1.3 0-1.7L6.1 1.7c-.7-.4-1.6.1-1.6.9Z" fill="currentColor" />
                        </svg>
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section g2 projects-all" id="all" style={h(2)} aria-labelledby="all-h">
          <div className="wrap">
            <div className="group">
              <SectionHead id="all-h" title={`${COUNT[projects.length] ?? projects.length} engineering projects.`} run="AI and ML, software and two competitions." mark="作品" />
              <div className="prows grid">
                {projects.slice(0, 3).map((p) => (
                  <Row key={p.slug} p={p} />
                ))}
              </div>
            </div>
            <div className="group">
              <div className="prows grid">
                {projects.slice(3).map((p) => (
                  <Row key={p.slug} p={p} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section ground-surface m2" id="toolkit" aria-labelledby="toolkit-h">
          <div className="wrap">
            <SectionHead id="toolkit-h" title="Engineering toolkit." run="What these projects are built with." mark="器用" />
            <div className="grid toolkit">
              {toolkit.map((g) => (
                <div key={g.group} className="span-4 toolkit__group">
                  <h3 className="group-title">{g.group}</h3>
                  <ul className="toolkit__list">
                    {g.items.map(([label, icon]) => (
                      <li key={label}>
                        <span className="toolkit__ic">
                          <Icon id={icon} size={24} />
                        </span>
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="toolkit__methods">
              <span className="courses__label">Methods</span> {methods.join(", ")}.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
