/* About (second level). The deal: hero film, re-dealt to split (his own photograph whole beside the words:
   the guqin photograph is upright, and a cinema frame would crop it to a strip) · moment marquee-row,
   re-dealt to liquid-hover on the guqin photograph (the pointer moves it like water; picture-develops is
   not dealt to software pages): the marquee's track runs past the container
   and is cut at rest · the home's palette, type, nav, close and footer. */
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { SectionHead } from "@/components/Blocks";
import { Picture } from "@/components/Media";
import { updates } from "@/content/experience";
import { pastimes, portrait } from "@/content/life";
import { person } from "@/content/site";
import { url } from "@/lib/site";

export const metadata: Metadata = {
  title: "About: Jialuo Chen, AI researcher in Toronto",
  description:
    "About Jialuo (Eric) Chen, AI researcher and engineer at the University of Toronto: the guqin, oil portraits, tennis and the news from his research and work since 2025.",
};

// the news in two columns of this many rows
const ROWS = Math.ceil(updates.length / 2);

export default function AboutPage() {
  const [guqin, ...rest] = pastimes;
  return (
    <>
      <SiteHeader current="About" />
      <main id="top">
        <section className="hero hero--split" data-enter aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text grid hero__grid">
              <div className="hero__text span-5">
                <h1 id="hero-h">An AI researcher who plays the guqin</h1>
                <p className="hero__lead">
                  I am {person.fullName}, in Industrial Engineering at the University of Toronto, class of 2027, with a focus in
                  AI and ML. Outside research and work, I play the guqin and the guitar, paint portraits in oils and play tennis.
                </p>
                <div className="btn-row">
                  <a className="btn btn--primary" href={url("/cv/")}>
                    Read my CV
                  </a>
                  <a className="btn btn--secondary" href={url("/research/")}>
                    See my research
                  </a>
                </div>
              </div>
              <div className="hero__media span-6 start-7" data-moment="liquid-hover" data-moment-opts='{"strength": 0.55, "radius": 0.12}'>
                <Picture pic={guqin.pic} sizes="(max-width: 1023px) 100vw, 628px" eager style={{ ["--ly-pos" as string]: "50% 42%" }} />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="life" aria-labelledby="life-h">
          <div className="wrap">
            <SectionHead id="life-h" title="Life outside research." run="Music, painting and sport." mark="其人" />
            <div className="grid life-grid">
              {rest.map((p) => (
                <figure key={p.id} className={`span-3 life-grid__photo life-grid__photo--${p.id}`}>
                  <Picture pic={p.pic} sizes="(max-width: 639px) 342px, 302px" />
                </figure>
              ))}
              <ul className="span-3 pastimes">
                {pastimes.map((p) => (
                  <li key={p.id}>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section ground-surface" id="news" aria-labelledby="news-h">
          <div className="wrap">
            <SectionHead id="news-h" title="News." run="Research, work and awards since 2025." mark="纪事" />
            <div className="grid news">
              {/* one list in two columns, newest first down the left and on down the right; the rows line up */}
              <ol className="span-6 news__list news__list--two" style={{ "--rows": ROWS } as CSSProperties}>
                {updates.map((u, i) => (
                  <li key={u.what} className={i === ROWS - 1 ? "news__col-end" : undefined}>
                    <span className="news__when">{u.when}</span>
                    {u.href ? (
                      <a className="news__what" href={url(u.href)}>
                        {u.what}
                      </a>
                    ) : (
                      <span className="news__what">{u.what}</span>
                    )}
                  </li>
                ))}
              </ol>
              <figure className="span-6 news__photo">
                <Picture pic={portrait} sizes="(max-width: 639px) 342px, 628px" />
              </figure>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
