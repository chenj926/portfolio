import React, { useEffect, useRef, useState } from "react";
import { resolvePortfolioHash } from "../data/portfolio";
import "./PortfolioDetailPage.css";

const readPortfolioRoute = () =>
  resolvePortfolioHash(
    typeof window === "undefined" ? "" : window.location.hash,
  );

export const usePortfolioRoute = () => {
  const [entry, setEntry] = useState(readPortfolioRoute);

  useEffect(() => {
    const handleHashChange = () => setEntry(readPortfolioRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return entry;
};

const PortfolioDetailPage = ({ entry }) => {
  const titleRef = useRef(null);

  useEffect(() => {
    if (!entry) {
      return undefined;
    }

    const previousTitle = document.title;
    document.title = `${entry.title} - Jialuo Chen`;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    titleRef.current?.focus();

    return () => {
      document.title = previousTitle;
    };
  }, [entry]);

  if (!entry) {
    return null;
  }

  const isPublication = entry.kind === "publication";

  return (
    <section
      className="portfolio-detail-page"
      data-kind={entry.kind}
      aria-labelledby="portfolio-detail-title"
    >
      <div className="portfolio-detail-shell">
        <a className="portfolio-detail-back" href="#/">
          <span aria-hidden="true">&larr;</span>
          <span>Back to portfolio</span>
        </a>

        <article className="portfolio-detail-article">
          <header className="portfolio-detail-hero">
            <div className="portfolio-detail-hero__copy">
              <p className="portfolio-detail-eyebrow">
                {isPublication ? entry.status : "Selected project"}
              </p>

              {isPublication && (
                <p className="portfolio-detail-publication-meta">
                  <span>{entry.venue}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{entry.year}</span>
                </p>
              )}

              <h1
                id="portfolio-detail-title"
                className="portfolio-detail-title"
                ref={titleRef}
                tabIndex="-1"
              >
                {entry.title}
              </h1>
              <p className="portfolio-detail-summary">{entry.description}</p>

              <ul
                className="portfolio-detail-tags"
                aria-label={`${entry.title} topics`}
              >
                {entry.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>

            {!isPublication && entry.image && (
              <figure className="portfolio-detail-visual">
                <img src={entry.image} alt="" />
              </figure>
            )}
          </header>

          <div className="portfolio-detail-content">
            <section
              className="portfolio-detail-panel portfolio-detail-facts"
              aria-labelledby="portfolio-detail-facts-title"
            >
              <p className="portfolio-detail-section-kicker">At a glance</p>
              <h2 id="portfolio-detail-facts-title">
                {isPublication ? "Publication facts" : "Project facts"}
              </h2>
              <dl>
                {entry.details.map((detail) => (
                  <div key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section
              className="portfolio-detail-panel portfolio-detail-highlights"
              aria-labelledby="portfolio-detail-highlights-title"
            >
              <p className="portfolio-detail-section-kicker">Scope</p>
              <h2 id="portfolio-detail-highlights-title">
                {isPublication ? "Research contribution" : "What it does"}
              </h2>
              <ul>
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </section>

            <section
              className="portfolio-detail-panel portfolio-detail-links"
              aria-labelledby="portfolio-detail-links-title"
            >
              <p className="portfolio-detail-section-kicker">Explore</p>
              <h2 id="portfolio-detail-links-title">External links</h2>
              {entry.links.length > 0 ? (
                <div className="portfolio-detail-link-list">
                  {entry.links.map((link) => (
                    <a
                      href={link.url}
                      key={`${link.label}-${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{link.label}</span>
                      <span
                        className="portfolio-detail-link-arrow"
                        aria-hidden="true"
                      >
                        &nearr;
                      </span>
                      <span className="portfolio-visually-hidden">
                        {" "}
                        (opens in a new tab)
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="portfolio-detail-empty-link">
                  No public link is listed for this project yet.
                </p>
              )}
            </section>
          </div>
        </article>

        <a className="portfolio-detail-footer-link" href="#/">
          <span aria-hidden="true">&larr;</span>
          <span>Return to all projects and publications</span>
        </a>
      </div>
    </section>
  );
};

export default PortfolioDetailPage;
