import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "./SectionHeading";
import PortfolioAction from "./PortfolioAction";
import PublicationAuthors from "./PublicationAuthors";
import { getPortfolioHref, publications } from "../data/portfolio";
import books from "../assets/decorations/book-scroll.webp";

const PublicationStatus = ({ status }) => {
  const underReview = status === "Under review";

  return (
    <span className="publication-page__status" data-review={underReview}>
      <FontAwesomeIcon
        icon={underReview ? faClock : faCheck}
        aria-hidden="true"
      />
      {status}
    </span>
  );
};

const PublicationsSection = () => (
  <section
    id="publications-section"
    className="scholar-section publications-section"
    aria-labelledby="publications-title"
  >
    <SectionHeading
      id="publications-title"
      title="Publications"
      chinese="论著"
      aside={
        <PortfolioAction href="https://scholar.google.ca/citations?user=E_qNOCcAAAAJ&hl=en">
          Google Scholar
        </PortfolioAction>
      }
    />
    <div className="publication-folio">
      <aside className="publication-folio__binding" aria-hidden="true">
        <span lang="zh-Hans">论著</span>
        <span>2026</span>
        <img
          src={books}
          alt=""
          loading="lazy"
          decoding="async"
          width="600"
          height="223"
        />
      </aside>
      <ol className="publication-folio__pages">
        {publications.map((publication, index) => (
          <li className="publication-page" key={publication.slug}>
            <div className="publication-page__meta">
              <span className="publication-page__venue">
                {publication.venue}
              </span>
              <PublicationStatus status={publication.status} />
              <span className="publication-page__year">{publication.year}</span>
            </div>
            <h3>
              <a href={getPortfolioHref(publication)}>{publication.title}</a>
            </h3>
            <p className="publication-page__authors">
              <PublicationAuthors authors={publication.authors} />
            </p>
            <p className="publication-page__description">
              {publication.description}
            </p>
            <ul
              className="scholar-topics"
              aria-label={`${publication.title} topics`}
            >
              {publication.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <div className="publication-page__footer">
              <PortfolioAction href={getPortfolioHref(publication)}>
                Read details
              </PortfolioAction>
              <span className="publication-page__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default PublicationsSection;
