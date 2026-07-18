import React from "react";
import { Heading, Text, VStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import { getPortfolioHref, publications } from "../data/portfolio";
import "./PortfolioSections.css";

const ResearchSection = () => {
  return (
    <FullScreenSection
      id="research-section"
      backgroundColor="var(--bg-primary)"
      px={{ base: 6, md: 12 }}
      py={{ base: 12, md: 20 }}
      alignItems="stretch"
      spacing={8}
    >
      <VStack align="flex-start" spacing={3}>
        <Text
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="0.2em"
          color="var(--accent-primary)"
          fontWeight="600"
        >
          Research
        </Text>
        <Heading size="lg" color="var(--text-primary)">
          Publications
        </Heading>
        <Text maxW="640px" color="var(--text-secondary)">
          Selected papers, open review submissions, and research prototypes.
        </Text>
      </VStack>

      <div className="publication-list">
        {publications.map((publication) => (
          <a
            className="publication-card-link"
            href={getPortfolioHref(publication)}
            key={publication.slug}
          >
            <article className="publication-sheet">
              <p className="publication-sheet__eyebrow">Publication</p>
              <p className="publication-sheet__meta">
                <span>{publication.venue}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{publication.year}</span>
              </p>
              <h3 className="publication-sheet__title">{publication.title}</h3>
              <p className="publication-sheet__description">
                {publication.description}
              </p>

              <ul
                className="portfolio-tag-list"
                aria-label={`${publication.title} topics`}
              >
                {publication.tags.map((tag) => (
                  <li className="portfolio-tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="publication-sheet__footer">
                <span>Read publication details</span>
                <span className="portfolio-card-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </div>
            </article>
          </a>
        ))}
      </div>
    </FullScreenSection>
  );
};

export default ResearchSection;
