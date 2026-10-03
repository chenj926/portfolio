import React from "react";
import { industryExperience } from "../data/career";
import SectionHeading from "./SectionHeading";
import InkStream from "./InkStream";
import OrganizationMark from "./OrganizationMark";
import "./ExperienceRiver.css";

const ExperienceSection = () => (
  <section
    id="experience-section"
    className="scholar-section experience-section"
    aria-labelledby="experience-title"
  >
    <SectionHeading id="experience-title" title="Experience" chinese="经历">
      Building dependable software, from probabilistic models to production
      interfaces.
    </SectionHeading>
    <ol className="experience-timeline">
      {industryExperience.map((experience) => (
        <li className="experience-entry" key={experience.organization}>
          <div className="experience-entry__mark" aria-hidden="true">
            <OrganizationMark
              organization={experience.organization}
              size="timeline"
            />
          </div>
          <article>
            <header className="experience-entry__heading">
              <div>
                <h3>{experience.organization}</h3>
                {experience.role && (
                  <p className="experience-entry__role">{experience.role}</p>
                )}
                {experience.location && (
                  <p className="experience-entry__location">
                    {experience.location}
                  </p>
                )}
              </div>
              <p className="experience-entry__period">{experience.period}</p>
            </header>
            <p className="experience-entry__summary">{experience.summary}</p>
            {experience.contributions && (
              <ul className="scholar-contributions">
                {experience.contributions.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
            <ul
              className="scholar-topics"
              aria-label={`${experience.organization} skills`}
            >
              {experience.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        </li>
      ))}
    </ol>
    <InkStream />
  </section>
);

export default ExperienceSection;
