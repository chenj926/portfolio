import React from "react";
import { researchExperience } from "../data/career";
import SectionHeading from "./SectionHeading";
import PortfolioAction from "./PortfolioAction";
import OrganizationMark from "./OrganizationMark";
import { faPlay, faFileLines } from "@fortawesome/free-solid-svg-icons";

const ResearchSection = () => (
  <section
    id="research-section"
    className="scholar-section research-section"
    aria-labelledby="research-title"
  >
    <SectionHeading id="research-title" title="Research" chinese="研究" />
    <div className="research-entries">
      {researchExperience.map((experience, index) => (
        <article
          className="research-entry"
          id={experience.id}
          key={experience.id}
        >
          <div className="research-entry__identity">
            <span className="research-entry__number" aria-hidden="true">
              0{index + 1}
            </span>
            <div className="research-entry__institution-line">
              <OrganizationMark
                organization={experience.institution}
                size="research"
              />
              <p className="scholar-kicker">{experience.institution}</p>
            </div>
            <h3>{experience.lab}</h3>
            <p className="research-entry__role">{experience.role}</p>
            <p className="research-entry__period">{experience.period}</p>
            <p className="research-entry__advisor">
              Advisor · {experience.advisor}
            </p>
          </div>
          <div className="research-entry__work">
            <h4>{experience.focus}</h4>
            <p>{experience.summary}</p>
            <details className="research-details">
              <summary aria-label={`Research details: ${experience.lab}`}>
                Research details<span aria-hidden="true">+</span>
              </summary>
              <ul className="scholar-contributions">
                {experience.contributions.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </details>
            <div className="research-entry__footer">
              <ul
                className="scholar-topics"
                aria-label={`${experience.lab} topics`}
              >
                {experience.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
              {experience.link && (
                <PortfolioAction
                  href={experience.link.href}
                  icon={
                    experience.link.label === "Watch demo"
                      ? faPlay
                      : faFileLines
                  }
                >
                  {experience.link.label}
                </PortfolioAction>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default ResearchSection;
