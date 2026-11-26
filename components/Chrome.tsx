// The header and the closing footer every page shares (system.md: one fixed opaque bar; footer.closing =
// the dealt close, close-type, over the footer columns).
import { mailto, nav, person, social } from "@/content/site";
import { currentWork, papers, statusLine } from "@/content/research";
import { projects } from "@/content/projects";
import { url } from "@/lib/site";
import { Arrow, Icon, Picture, Seal } from "./Media";
import ThemeToggle from "./ThemeToggle";
import CopyEmail from "./CopyEmail";

// the research in progress with pictures leads the Research menu's card
const feature = currentWork.find((w) => w.gallery?.length || w.figure);

export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="nav">
      <div className="wrap nav__bar">
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        <a className="nav__logo" href={url("/")}>
          <Seal size={28} />
          {person.name}
        </a>
        <nav className="nav__links" aria-label="Main">
          {nav.map((item) =>
            item.label === "Research" ? (
              <div className="nav__item" key={item.href}>
                <a className="nav__link" href={url(item.href)} aria-current={current === item.label ? "page" : undefined}>
                  {item.label}{" "}
                  <svg className="chev" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <div className="nav__menu">
                  <div className="wrap grid">
                    <div className="menu-col span-3">
                      <p className="t-label">Papers</p>
                      {papers.map((p) => (
                        <a key={p.slug} href={url(`/research/${p.slug}/`)}>
                          {p.short}
                          <span>{statusLine(p)}</span>
                        </a>
                      ))}
                    </div>
                    <div className="menu-col span-3">
                      <p className="t-label">In progress</p>
                      {currentWork.map((w) => (
                        <a key={w.slug} href={url(`/research/${w.slug}/`)}>
                          {w.short}
                          <span>{w.institution}</span>
                        </a>
                      ))}
                    </div>
                    {feature && (
                      <a className="menu-card span-3 start-10" href={url(`/research/${feature.slug}/`)}>
                        <div className="panel">
                          <Picture className="frame__img" pic={(feature.gallery?.[1] ?? feature.figure)!} sizes="302px" />
                        </div>
                        <span className="t-card">{feature.short}</span>
                        <span className="t-small muted">
                          {feature.card.k}: {feature.card.v}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="nav__item" key={item.href}>
                <a className="nav__link" href={url(item.href)} aria-current={current === item.label ? "page" : undefined}>
                  {item.label}
                </a>
              </div>
            ),
          )}
        </nav>
        <div className="nav__actions">
          <ul className="nav__social" aria-label="Elsewhere">
            {social.map((s) => (
              <li key={s.id}>
                <a href={s.href} rel="noopener" aria-label={s.label} title={s.label}>
                  <Icon id={s.id} size={18} />
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <a className="btn btn--primary" href={mailto}>
            Email me
          </a>
        </div>
        <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="footer closing" id="contact" aria-labelledby="close-h">
      <div className="wrap">
        <div className="closing__cta close--type">
          <div className="section-head">
            <h2 id="close-h">Let&rsquo;s make this better together.</h2>
            <p>{person.availability}, and to research collaboration now.</p>
            <CopyEmail email={person.email} />
          </div>
          <a className="btn btn--primary btn--xl btn--wide" href={mailto}>
            Email me
            <Arrow />
          </a>
        </div>
        <div className="closing__links">
          <div className="grid">
            <div className="span-4 stack-4">
              <a className="nav__logo" href={url("/")}>
                <Seal size={28} />
                {person.name}
              </a>
              <p className="footer__lede">AI researcher and engineer at the University of Toronto.</p>
            </div>
            <div className="span-2 footer__col">
              <h3>Pages</h3>
              <ul>
                {nav.map((n) => (
                  <li key={n.href}>
                    <a href={url(n.href)}>{n.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>Research</h3>
              <ul>
                {[...papers, ...currentWork].map((r) => (
                  <li key={r.slug}>
                    <a href={url(`/research/${r.slug}/`)}>{r.short}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>Projects</h3>
              <ul>
                {projects.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <a href={url(`/projects/${p.slug}/`)}>{p.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>Elsewhere</h3>
              <ul>
                {social.map((s) => (
                  <li key={s.id}>
                    <a href={s.href} rel="noopener">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer__legal">
            <span>&copy; {year} {person.fullName}, Toronto</span>
            <div className="socials">
              {social.map((s) => (
                <a key={s.id} href={s.href} aria-label={s.label} rel="noopener">
                  <Icon id={s.id} size={18} />
                </a>
              ))}
            </div>
            <span className="credits">Product names and logos are trademarks of their owners.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
