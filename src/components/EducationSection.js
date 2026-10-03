import React from "react";
import Material from "./Material";
import OrganizationMark from "./OrganizationMark";
import SectionHeading from "./SectionHeading";
import "./EducationSection.css";

const minors = [
  "Computer Science",
  "Artificial Intelligence in Engineering",
  "Engineering Business",
];

const EducationSection = () => (
  <section
    id="education-section"
    className="scholar-section education-section"
    aria-labelledby="education-title"
  >
    <SectionHeading id="education-title" title="Education" chinese="教育" />

    <Material
      as="article"
      className="home-reading-surface education-card"
      aria-labelledby="education-school"
    >
      <aside className="education-card__emblem">
        <div className="education-card__seal">
          <OrganizationMark
            organization="University of Toronto"
            size="education"
          />
          <span aria-hidden="true">UNIVERSITY OF TORONTO</span>
        </div>
        <p>Faculty of Applied Science &amp; Engineering</p>
      </aside>

      <div className="education-card__content">
        <p className="education-card__period">September 2022–June 2027</p>
        <h3 id="education-school">University of Toronto</h3>
        <p className="education-card__degree">
          Bachelor of Applied Science in Industrial Engineering with PEY-COOP
        </p>
        <p className="education-card__focus">AI &amp; ML focus</p>

        <div className="education-minors" role="group" aria-label="Minors">
          {minors.map((minor) => (
            <div className="education-minors__item" key={minor}>
              <span className="scholar-kicker">Minor</span>
              <h4>{minor}</h4>
            </div>
          ))}
        </div>
      </div>
    </Material>
  </section>
);

export default EducationSection;
