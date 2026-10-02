import React from "react";
import { Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import { getPortfolioHref, projects } from "../data/portfolio";
import "./PortfolioSections.css";

const ProjectsSection = () => {
  return (
    <FullScreenSection
      id="projects-section"
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
          Portfolio
        </Text>
        <Heading size="lg" color="var(--text-primary)">
          Projects &amp; Research
        </Heading>
        <Text maxW="640px" color="var(--text-secondary)">
          Featured builds with visuals, context, and dedicated pages for a
          closer look.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} width="100%">
        {projects.map((project) => (
          <a
            className="portfolio-card-link"
            href={getPortfolioHref(project)}
            key={project.slug}
          >
            <article className="project-card">
              <div className="project-card__media">
                <img
                  className="project-card__image"
                  src={project.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="project-card__body">
                <p className="project-card__eyebrow">Project</p>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__description">
                  {project.description}
                </p>

                <ul
                  className="portfolio-tag-list"
                  aria-label={`${project.title} topics`}
                >
                  {project.tags.map((tag) => (
                    <li className="portfolio-tag" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="project-card__footer">
                  <span>View project details</span>
                  <span className="portfolio-card-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </div>
              </div>
            </article>
          </a>
        ))}
      </SimpleGrid>
    </FullScreenSection>
  );
};

export default ProjectsSection;
