import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { profile, statusOptions } from "../data/profile";
import SocialLinks from "./SocialLinks";
import Blossom from "./Blossom";
import Material from "./Material";
import profilePic from "../assets/images/profile.webp";
import inkStudy from "../assets/decorations/ink-study.webp";
import "./HomeGlass.css";

const institutions = {
  UofT: "https://www.utoronto.ca/",
  SJTU: "https://www.sjtu.edu.cn/",
};

function workWithLinks(text) {
  return text.split(/\b(UofT|SJTU)\b/).map((part, index) =>
    institutions[part] ? (
      <a
        key={index}
        href={institutions[part]}
        target="_blank"
        rel="noopener noreferrer"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export default function LandingSection() {
  const status = statusOptions[profile.currentStatus];
  return (
    <section
      id="home-section"
      className="home-landing"
      aria-labelledby="home-title"
    >
      <img
        className="home-ink home-ink-mountains"
        src={inkStudy}
        width="800"
        height="800"
        alt=""
        aria-hidden="true"
      />
      <img
        className="home-ink home-ink-branch"
        src={inkStudy}
        width="800"
        height="800"
        alt=""
        aria-hidden="true"
      />
      <div className="home-journey-rail" aria-hidden="true" />
      <span className="home-signature" lang="zh-Hans" aria-hidden="true">
        佳洛
      </span>
      <div className="home-shell">
        <div className="home-copy">
          <p className="home-eyebrow">{profile.eyebrow}</p>
          <h1 id="home-title" className="home-title">
            <span className="home-name-en">{profile.name}</span>{" "}
            <span lang="zh-Hans">{profile.chineseName}</span>
          </h1>
          <p className="home-lede">{profile.introduction}</p>
          <Material quiet className="home-current home-reading-surface">
            <Blossom />
            <div className="home-current-copy">
              <p>{workWithLinks(profile.currentWork)}</p>
            </div>
          </Material>
          <SocialLinks labelled className="home-social-row" />
          <div className="home-connect-row">
            <Material
              as="a"
              opaque
              className="home-connect-button pressable"
              href="#connect-section"
            >
              <span>Let's connect</span>
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Material>
          </div>
        </div>
        <Material
          as="article"
          quiet
          className="home-profile-card home-reading-surface"
          aria-label="Profile"
        >
          <div className="home-avatar-stage">
            <img
              src={profilePic}
              width="800"
              height="600"
              alt={profile.name}
              className="home-avatar"
              fetchPriority="high"
            />
          </div>
          <h2>{profile.role}</h2>
          <p className="home-profile-subtitle">
            {profile.education.discipline} <span aria-hidden="true">·</span>{" "}
            {profile.education.university}
          </p>
          <span className="home-profile-rule" aria-hidden="true" />
          <div
            className="home-status"
            role="group"
            aria-label="Current status"
            data-status={profile.currentStatus}
          >
            <span className="home-status-ink" aria-hidden="true" />
            <span className="home-status-backplate" aria-hidden="true" />
            <span
              className="home-status-icon"
              style={{ "--status-x": `${(status.spriteColumn / 3) * 100}%` }}
              aria-hidden="true"
            />
            <Material quiet className="home-status-face">
              <p className="home-status-kicker">CURRENT STATUS</p>
              <p className="home-status-label">{status.label}</p>
            </Material>
          </div>
        </Material>
      </div>
    </section>
  );
}
