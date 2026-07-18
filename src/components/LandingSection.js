import React from "react";
import { Box, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import profilePic from "../assets/images/profile pic.jpg";
import "./HomeGlass.css";

const socials = [
  { icon: faEnvelope, label: "Email", url: "mailto:jialuo.chen@utoronto.ca" },
  { icon: faGithub, label: "GitHub", url: "https://github.com/chenj926" },
  {
    icon: faLinkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
  {
    icon: faInstagram,
    label: "Instagram",
    url: "https://www.instagram.com/ericchen7161/",
  },
];

const statuses = [
  { key: "opportunity", label: "Open to opportunities", tone: "green" },
  { key: "collaborate", label: "Open to collaborate", tone: "blue" },
  { key: "communicate", label: "Open to communicate", tone: "pink" },
  { key: "vacation", label: "Currently on vacation", tone: "red" },
];

const BotanicalMark = () => (
  <svg viewBox="0 0 72 72" role="img" aria-label="Growing branch motif">
    <path d="M23 58C40 49 41 31 39 14" />
    <path d="M38 28C31 25 27 20 27 14C34 15 39 20 38 28Z" />
    <path d="M38 38C47 35 53 29 54 22C45 22 39 28 38 38Z" />
    <path d="M34 48C27 46 21 41 19 35C27 34 33 39 34 48Z" />
    <path d="M19 58H54" />
  </svg>
);

const LandingSection = () => {
  const goToConnect = (event) => {
    const shouldMove =
      event.detail !== 0 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.getElementById("connect-section")?.scrollIntoView({
      behavior: shouldMove ? "smooth" : "auto",
      block: "start",
    });
  };

  return (
    <Box as="section" id="home-section" className="home-landing">
      <Box className="home-journey-rail" aria-hidden="true">
        <span className="home-journey-knot">
          <i />
          <i />
          <i />
        </span>
      </Box>

      <Box className="home-shell">
        <Box className="home-copy">
          <p className="home-eyebrow">AI Researcher &amp; Engineer</p>

          <h1 className="home-title">
            Jialuo (Eric) Chen <span lang="zh-Hans">陈佳洛</span>
          </h1>

          <p className="home-lede">
            Industrial Engineering student with a dual focus on{" "}
            <strong>Machine Learning</strong> and{" "}
            <strong>Software Architecture</strong>. I thrive at the intersection
            of complex algorithms and intuitive product design.
          </p>

          <div className="home-current">
            <div className="home-current-mark">
              <BotanicalMark />
            </div>
            <p>
              Currently engineering risk platforms at <strong>JANA Corp</strong>,
              researching <strong>Bayesian Optimization</strong> at{" "}
              <a href="https://www.utoronto.ca/" target="_blank" rel="noreferrer">
                UofT
              </a>{" "}
              and <strong>AI Reasoning</strong> at{" "}
              <a href="https://www.sjtu.edu.cn/" target="_blank" rel="noreferrer">
                SJTU
              </a>
              . Open to <strong>AI Engineering</strong> or{" "}
              <strong>Applied Research</strong> roles.
            </p>
          </div>

          <div className="home-social-row" aria-label="Profile links">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.url}
                isExternal={social.url.startsWith("http")}
                className="home-social-pill pressable"
              >
                <FontAwesomeIcon icon={social.icon} />
                <span>{social.label}</span>
              </Link>
            ))}
          </div>

          <div className="home-connect-row">
            <button
              className="home-connect-button pressable"
              type="button"
              onClick={goToConnect}
            >
              <span>Let&apos;s connect</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </Box>

        <Box className="home-profile-wrap">
          <article className="home-profile-card">
            <div className="home-avatar-stage">
              <img
                src={profilePic}
                alt="Jialuo (Eric) Chen"
                className="home-avatar"
              />
            </div>

            <h2>Software &amp; AI/ML Engineer</h2>
            <p className="home-profile-subtitle">
              Industrial Engineering <span aria-hidden="true">•</span> University of Toronto
            </p>

            <span className="home-profile-rule" aria-hidden="true" />

            <div className="home-status-grid" aria-label="Current availability">
              {statuses.map((status) => (
                <div
                  key={status.key}
                  className={`home-status-chip is-${status.tone}`}
                >
                  <span className="home-status-dot" aria-hidden="true" />
                  <span>{status.label}</span>
                </div>
              ))}
            </div>
          </article>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingSection;
