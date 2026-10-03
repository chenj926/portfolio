import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Material from "./Material";
import SectionHeading from "./SectionHeading";
import RedNoteMark from "../assets/social/rednote.png";
import RedditMark from "../assets/social/reddit.svg";
import ArtImage from "../assets/hobbies/Art.jpg";
import "./PersonalSections.css";

const channels = [
  {
    id: "rednote",
    title: "RedNote",
    description: "Lifestyle notes, study routines, and visual storytelling.",
    url: "https://www.xiaohongshu.com/user/profile/60b414de0000000001007140",
    mark: RedNoteMark,
  },
  {
    id: "reddit",
    title: "Reddit",
    description:
      "Sharing study experiments and engaging in creator communities.",
    url: "https://www.reddit.com/user/Every-Movie7060/",
    mark: RedditMark,
  },
];

const ChannelLink = ({ channel }) => (
  <a
    className="community-card__link"
    href={channel.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>Visit {channel.title}</span>
    <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
  </a>
);

const RedNoteCard = ({ channel }) => (
  <Material
    as="article"
    quiet
    className="home-reading-surface community-card rednote-card"
    aria-labelledby="rednote-title"
  >
    <header className="community-card__header">
      <img className="community-card__mark" src={channel.mark} alt="" />
      <div>
        <h3 id="rednote-title">{channel.title}</h3>
        <p>{channel.description}</p>
      </div>
    </header>

    <div className="community-card__post">
      <figure className="community-card__cover">
        <img
          src={ArtImage}
          alt="Artwork from my Art collection"
          loading="lazy"
          decoding="async"
        />
        <figcaption>Art &amp; everyday life</figcaption>
      </figure>
      <div className="community-card__post-copy">
        <h4>Small moments, shared.</h4>
        <p>
          Life outside the lab: art, study routines, and everyday observations.
        </p>
      </div>
    </div>

    <ChannelLink channel={channel} />
  </Material>
);

const RedditCard = ({ channel }) => (
  <Material
    as="article"
    quiet
    className="home-reading-surface community-card reddit-card"
    aria-labelledby="reddit-title"
  >
    <header className="community-card__header">
      <img className="community-card__mark" src={channel.mark} alt="" />
      <div>
        <h3 id="reddit-title">{channel.title}</h3>
        <p>{channel.description}</p>
      </div>
    </header>

    <div className="community-card__conversation">
      <h4>Ideas grow in conversation.</h4>
      <p>
        Study experiments.
        <br />
        Thoughtful exchanges.
        <br />A shared curiosity.
      </p>
      <div className="community-card__handle">
        <img src={channel.mark} alt="" />
        <span>u/Every-Movie7060</span>
      </div>
    </div>

    <ChannelLink channel={channel} />
  </Material>
);

const ContentSection = () => (
  <section
    id="content-section"
    className="scholar-section personal-section community-section"
    aria-labelledby="content-title"
  >
    <SectionHeading id="content-title" title="Content & Community" />
    <div className="community-grid">
      <RedNoteCard channel={channels[0]} />
      <RedditCard channel={channels[1]} />
    </div>
  </section>
);

export default ContentSection;
