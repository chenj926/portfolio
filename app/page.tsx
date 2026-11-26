/* The deal (.taste-skill/PLAN.md): kind software · hero statement (client's choice; triptych re-dealt) ·
   palette the client's own (宣纸 #f4f3ef, 墨 #1b1a18) · type albert · radius soft · buttons solid ·
   nav-mega · footer-columns · close-type · rhythm surface-pairs · mark the client's seal ·
   effect the wintersweet attention ground · moments letters-assemble, line-carries-colour */
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { h, ProjectTile, ResearchTile, SectionHead } from "@/components/Blocks";
import { Icon, Mark, Picture } from "@/components/Media";
import WintersweetGround from "@/components/WintersweetGround";
import { docHref, documents } from "@/content/docs";
import { education, jobs, positions, updates } from "@/content/experience";
import { avatar, pastimes } from "@/content/life";
import { findProject, projects } from "@/content/projects";
import { findResearch, papers } from "@/content/research";
import { social } from "@/content/site";
import { url } from "@/lib/site";

// the news: the two newest items with a picture lead, then the next ones as a list, each page linked once
const lead = updates.filter((u) => u.pic).slice(0, 2);
const linked = new Set(lead.map((u) => u.href));
const list = updates.filter((u) => !lead.includes(u) && !(u.href && linked.has(u.href))).slice(0, 6);
/** what a news item is about, from the page it links to: "XR capstone", "XR World Models" */
const about = (href?: string) => {
  const m = href?.match(/^\/(projects|research)\/([^/]+)\/$/);
  if (!m) return "";
  return m[1] === "projects" ? (findProject(m[2])?.name ?? "") : (findResearch(m[2])?.short ?? "");
};

export default function Home() {
  const school = education[0];
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="hero hero--statement hero--home" data-enter aria-labelledby="hero-h">
          <WintersweetGround />
          <div className="wrap">
            <div className="hero-text hero__in">
              <div>
                <h1 id="hero-h">
                  <span className="h1-face">
                    <Picture pic={avatar} sizes="80px" eager />
                  </span>
                  Jialuo Chen, AI researcher and engineer in Toronto
                </h1>
                <p className="hero__lead">
                  I study decision-making under uncertainty and memory in linear attention, and I build working systems
                  around them: XR headsets that keep track of real objects, and pipeline-risk software at JANA.
                </p>
                <div className="btn-row">
                  <a className="btn btn--secondary" href={url("/research/")}>
                    See research
                  </a>
                  <a className="btn btn--secondary" href={url("/projects/")}>
                    See projects
                  </a>
                </div>
                <ul className="hero-social" aria-label="Elsewhere">
                  {social.map((s) => (
                    <li key={s.id}>
                      <a href={s.href} rel="noopener" aria-label={s.label}>
                        <Icon id={s.id} size={20} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hero__creds">
                <div className="cred">
                  <span className="cred__mark">
                    <Mark id={school.mark} />
                  </span>
                  <span className="cred__main">
                    <span className="cred__title">{school.school}</span>
                    <span className="cred__sub">
                      <span className="cred__degree">{school.degree}</span>
                      <span className="cred__focus">{school.focus}</span>
                    </span>
                    {school.minors && <span className="cred__minor">Minors in {school.minors.join(", ").replace(/, ([^,]*)$/, " and $1").replace("Artificial Intelligence", "AI")}</span>}
                    <span className="cred__when">
                      {school.short}
                      {school.honours && <span className="cred__honours">, {school.honours}</span>}
                    </span>
                  </span>
                </div>
                <ul className="docs-row" aria-label="CV and résumé">
                  {documents.map((d, i) => (
                    <li key={d.id}>
                      <a className="doc-link" href={url(docHref(d, i))}>
                        <span className="doc-link__page">
                          <img src={url(`/docs/${d.pages[0]}-800.webp`)} width={800} height={1035} alt="" loading="lazy" />
                        </span>
                        <span className="doc-link__title">{d.label}</span>
                        <span className="doc-link__note">{d.short}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="now" aria-labelledby="now-h">
          <div className="wrap">
            <SectionHead id="now-h" title="News." run="What is happening now, newest first." mark="近况" />
            <div className="grid now-grid">
              {lead.map((u) => {
                const Item = u.href ? "a" : "div";
                return (
                  <Item key={u.what} className="tile span-4" {...(u.href ? { href: url(u.href) } : {})}>
                    <div className="tile__media">
                      <Picture pic={u.pic!} sizes="(max-width: 639px) 342px, (max-width: 1023px) 50vw, 410px" />
                    </div>
                    <div className="tile__words">
                      <p className="tile__meta">
                        <span>{u.when}</span>
                        {about(u.href) && <span>{about(u.href)}</span>}
                      </p>
                      <h3 className="tile__title">{u.what}</h3>
                      {u.line && <p className="tile__line">{u.line}</p>}
                    </div>
                  </Item>
                );
              })}
              <div className="span-4 updates">
                <ol className="updates__list">
                  {list.map((u) => (
                    <li key={u.what}>
                      <span className="updates__when">{u.when}</span>
                      {u.href ? (
                        <a className="updates__what" href={url(u.href)}>
                          {u.what}
                        </a>
                      ) : (
                        <span className="updates__what">{u.what}</span>
                      )}
                    </li>
                  ))}
                </ol>
                <a className="link" href={url("/about/#news")}>
                  See all news
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="research" aria-labelledby="research-h">
          <div className="wrap">
            <SectionHead
              id="research-h"
              title="Research"
              lead="Two papers so far: a protocol for LLM-built healthcare pipelines, and Bayesian optimization that treats each kind of input by its role."
              mark="论著"
              action={
                <a className="link" href={url("/research/")}>
                  See all research
                </a>
              }
            />
            <div className="grid papers">
              {papers.map((p) => (
                <ResearchTile key={p.slug} r={p} sizes="(max-width: 1023px) 100vw, 628px" />
              ))}
            </div>
          </div>
        </section>

        <section className="section g2" id="projects" style={h(2)} aria-labelledby="projects-h">
          <div className="wrap">
            <div className="group">
              <SectionHead
                id="projects-h"
                title="Engineering projects"
                lead="From equipment audits with Magna on a Meta Quest 3 to a Toronto transit planner and a sketch-to-face GAN."
                mark="作品"
                action={
                  <a className="link" href={url("/projects/")}>
                    See all projects
                  </a>
                }
              />
              <div className="grid">
                {projects.slice(0, 3).map((p) => (
                  <ProjectTile key={p.slug} p={p} sizes="(max-width: 639px) 342px, (max-width: 1023px) 50vw, 410px" />
                ))}
              </div>
            </div>
            <div className="group">
              <div className="grid">
                {projects.slice(3, 6).map((p) => (
                  <ProjectTile key={p.slug} p={p} sizes="(max-width: 639px) 342px, (max-width: 1023px) 50vw, 410px" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="section statement"
          id="statement"
          data-moment="letters-assemble"
          data-moment-opts='{"spread": 0.7}'
          aria-labelledby="statement-h"
        >
          <div className="wrap">
            <h2 className="mo-la__type" id="statement-h">
              From research to running systems
            </h2>
            <p className="mo-la__sub">
              Gaussian-process models and linear-attention memory on one side; XR headsets, a transit planner and
              pipeline-risk software on the other.
            </p>
          </div>
        </section>

        <section
          className="section ground-surface"
          id="experience"
          data-moment="line-carries-colour"
          data-moment-opts='{"from": "base"}'
          aria-labelledby="experience-h"
        >
          <div className="wrap">
            <SectionHead
              id="experience-h"
              title="Experience."
              run="Research, industry and a degree."
              mark="经历"
              action={
                <a className="link" href={url("/cv/")}>
                  Read my CV
                </a>
              }
            />
            <div className="grid xp">
              <div className="span-4 xp__col">
                <h3 className="group-title">Research positions</h3>
                {positions.map((x) => {
                  const Entry = x.research ? "a" : "div";
                  return (
                  <Entry key={x.role + x.when} className="entry" {...(x.research ? { href: url(`/research/${x.research}/`) } : {})}>
                    <span className="entry__mark">
                      <Mark id={x.mark} />
                    </span>
                    <span className="entry__main">
                      <span className="entry__title">{x.role}</span>
                      <span className="entry__sub">
                        {x.institution}, with {x.advisor}
                      </span>
                      <span className="entry__when">{x.when}</span>
                    </span>
                  </Entry>
                  );
                })}
              </div>
              <div className="span-4 xp__col">
                <h3 className="group-title">Industry jobs</h3>
                {jobs.map((j) => (
                  <div key={j.org} className="entry">
                    <span className="entry__mark">
                      {j.mark ? <Mark id={j.mark} /> : <span className="entry__initial" aria-hidden="true">{j.org[0]}</span>}
                    </span>
                    <span className="entry__main">
                      <span className="entry__title">{j.org}</span>
                      <span className="entry__sub">{j.role || j.topic}</span>
                      <span className="entry__when">{j.when}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="span-4 xp__col">
                <h3 className="group-title">{education.length === 1 ? school.school : "Education"}</h3>
                {education.map((e) => (
                  <div key={e.degree} className="entry">
                    <span className="entry__mark">
                      <Mark id={e.mark} />
                    </span>
                    <span className="entry__main">
                      <span className="entry__title">{e.degree}</span>
                      <span className="entry__sub">
                        {e.focus}
                        {e.honours && `; ${e.honours}`}
                      </span>
                      <span className="entry__when">{e.when}</span>
                    </span>
                  </div>
                ))}
                {school.courses && (
                  <>
                    <p className="courses__label">Courses</p>
                    <ul className="courses">
                      {school.courses.map((c) => (
                        <li key={c.code}>
                          <span className="courses__name">{c.name}</span>
                          <span className="courses__code">{c.code}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="about" aria-labelledby="about-h">
          <div className="wrap">
            <SectionHead
              id="about-h"
              title="About me."
              run="Outside research and work."
              lead="I play the guqin and the guitar, paint portraits in oils, and have played tennis since I was twelve."
              mark="其人"
              action={
                <a className="link" href={url("/about/")}>
                  See hobbies and photos
                </a>
              }
            />
            <div className="grid life">
              {pastimes.slice(0, 4).map((p) => (
                <figure key={p.id} className="life__photo span-3">
                  <Picture pic={p.pic} sizes="(max-width: 639px) 165px, (max-width: 1023px) 50vw, 302px" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
