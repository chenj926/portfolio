import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import Material from "./Material";
import { archivedNews, recentNews } from "../data/career";

const NewsItem = ({ item }) => (
  <li className="news-entry">
    <div className="news-entry__date">{item.date}</div>
    <div className="news-entry__copy">
      <span className="scholar-kicker">{item.category}</span>
      <h3>
        {item.href ? (
          <a
            href={item.href}
            {...(item.href.startsWith("https:")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {item.title}
            <span aria-hidden="true"> ↗</span>
          </a>
        ) : (
          item.title
        )}
      </h3>
      <p>{item.description}</p>
    </div>
  </li>
);

const NewsSection = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <section
      id="news-section"
      className="scholar-section news-section"
      aria-labelledby="news-title"
    >
      <SectionHeading id="news-title" title="Latest news" chinese="近况" />
      <ol className="news-list">
        {recentNews.map((item) => (
          <NewsItem item={item} key={item.title} />
        ))}
      </ol>
      <div id="earlier-news" hidden={!expanded}>
        <ol className="news-list news-list--archive">
          {archivedNews.map((item) => (
            <NewsItem item={item} key={item.title} />
          ))}
        </ol>
      </div>
      <Material
        as="button"
        type="button"
        className="scholar-button news-expand pressable"
        aria-controls="earlier-news"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Hide earlier updates" : "Earlier updates"}
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </Material>
    </section>
  );
};

export default NewsSection;
