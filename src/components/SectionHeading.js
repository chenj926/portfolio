import React from "react";
import "./ScholarSections.css";

const SectionHeading = ({ id, title, chinese, aside }) => (
  <header className="section-heading">
    <div className="section-heading__copy">
      <div className="section-heading__title">
        <h2 id={id}>{title}</h2>
        {chinese && (
          <span className="section-heading__chinese" lang="zh-Hans">
            {chinese}
          </span>
        )}
      </div>
    </div>
    {aside && <div className="section-heading__aside">{aside}</div>}
  </header>
);

export default SectionHeading;
