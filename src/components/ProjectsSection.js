import React from "react";
import SectionHeading from "./SectionHeading";
import Material from "./Material";
import PortfolioAction from "./PortfolioAction";
import { getPortfolioHref, projects } from "../data/portfolio";
import "./PortfolioSections.css";

const ProjectsSection = () => {
  return (
    <section
      id="projects-section"
      className="scholar-section projects-section"
      aria-labelledby="projects-title"
    >
      <SectionHeading id="projects-title" title="Projects" chinese="项目" />

      <div className="project-grid">
        {projects.map((project) => (
          <Material
            as="article"
            quiet
            className="project-card home-reading-surface"
            key={project.slug}
          >
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
              <h3 className="project-card__title">
                <a href={getPortfolioHref(project)}>{project.title}</a>
              </h3>
              <p className="project-card__description">{project.description}</p>

              <ul
                className="scholar-topics"
                aria-label={`${project.title} topics`}
              >
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              <div className="project-card__footer">
                <PortfolioAction
                  href={getPortfolioHref(project)}
                  aria-label={`View ${project.title} details`}
                >
                  View project
                </PortfolioAction>
              </div>
            </div>
          </Material>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
