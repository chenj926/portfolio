import React, { useState } from "react";
import { faCheck, faCopy, faDownload } from "@fortawesome/free-solid-svg-icons";
import PortfolioAction from "./PortfolioAction";

// Author order, title, and year come from the same record as the visible paper.
export const formatBibtex = (publication) => {
  const { citation, authors, title, year } = publication;
  return `@inproceedings{${citation.key},
  author = {${authors.join(" and ")}},
  title = {{${title}}},
  booktitle = {${citation.booktitle}},
  year = {${year}},
  pages = {${citation.pages}},
  doi = {${citation.doi}}
}`;
};

const PublicationCitation = ({ publication }) => {
  const [copyState, setCopyState] = useState("idle");
  const bibtex = formatBibtex(publication);
  const copyCitation = async () => {
    if (copyState === "pending") return;
    setCopyState("pending");
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <section className="publication-citation" aria-labelledby="citation-title">
      <header className="publication-citation__header">
        <div>
          <p className="portfolio-detail-section-kicker">Citation</p>
          <h2 id="citation-title">Cite this paper</h2>
        </div>
        <div className="publication-citation__actions">
          <PortfolioAction
            onClick={copyCitation}
            aria-disabled={copyState === "pending"}
            icon={copyState === "copied" ? faCheck : faCopy}
          >
            {copyState === "copied" ? "Copied" : "Copy BibTeX"}
          </PortfolioAction>
          <PortfolioAction
            href={`data:application/x-bibtex;charset=utf-8,${encodeURIComponent(bibtex)}`}
            download={`${publication.citation.key}.bib`}
            icon={faDownload}
          >
            Download .bib
          </PortfolioAction>
        </div>
      </header>
      <p className="publication-citation__status" role="status">
        {copyState === "failed"
          ? "Copy is unavailable. Select the citation below to copy it, or download the .bib file."
          : copyState === "copied"
            ? "BibTeX copied to clipboard."
            : "BibTeX"}
      </p>
      <pre aria-label="BibTeX citation">
        <code>{bibtex}</code>
      </pre>
      <a
        className="publication-citation__doi"
        href={`https://doi.org/${publication.citation.doi}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        DOI: {publication.citation.doi}
        <span className="portfolio-visually-hidden"> (opens in a new tab)</span>
      </a>
    </section>
  );
};

export default PublicationCitation;
