import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faBookOpen,
  faChartLine,
  faCode,
  faCube,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import Material from "./Material";
import SectionHeading from "./SectionHeading";
import { skillGroups } from "../data/skills";
import "./PersonalSections.css";
import "./SkillsSection.css";

const categoryIcons = {
  spark: faWandMagicSparkles,
  cube: faCube,
  chart: faChartLine,
  code: faCode,
  brain: faBrain,
  book: faBookOpen,
};

const SkillCategory = ({ group }) => (
  <Material
    as="article"
    quiet
    className="home-reading-surface skills-category"
    aria-labelledby={`skills-category-${group.id}`}
  >
    <header className="skills-category__header">
      <span className="skills-category__icon" aria-hidden="true">
        <FontAwesomeIcon icon={categoryIcons[group.icon]} />
      </span>
      <h3 id={`skills-category-${group.id}`}>{group.title}</h3>
    </header>
    <ul className="skills-category__list">
      {[...group.items, ...(group.context || [])].map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  </Material>
);

const SkillsSection = () => (
  <section
    id="skills-section"
    className="scholar-section personal-section skills-section"
    aria-labelledby="skills-title"
  >
    <SectionHeading id="skills-title" title="Skills" chinese="技能" />
    <div className="skills-category-grid">
      {skillGroups.map((group) => (
        <SkillCategory group={group} key={group.id} />
      ))}
    </div>
  </section>
);

export default SkillsSection;
