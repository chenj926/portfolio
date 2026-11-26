import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { url } from "@/lib/site";

export const metadata = { title: "Page not found: Jialuo Chen", description: "This address has no page on Jialuo Chen's site." };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="hero hero--statement" data-enter aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text hero__in">
              <div>
                <h1 id="hero-h">This page has moved or never existed</h1>
                <p className="hero__lead">The research, the projects and the CV are one click away.</p>
                <div className="btn-row">
                  <a className="btn btn--secondary" href={url("/research/")}>See research</a>
                  <a className="btn btn--secondary" href={url("/projects/")}>See projects</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
