import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { socialLinks } from "../data/profile";
import Material from "./Material";

const SocialLinks = ({ labelled = false, className }) => {
  const links = socialLinks.map((social) => {
    const external = social.url.startsWith("http");

    return (
      <Material
        as="a"
        key={social.label}
        href={social.url}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        aria-label={labelled ? undefined : social.label}
        title={labelled ? undefined : social.label}
        className={
          labelled ? "home-social-pill pressable" : "home-glass-icon pressable"
        }
      >
        <FontAwesomeIcon icon={social.icon} aria-hidden="true" />
        {labelled && <span>{social.label}</span>}
      </Material>
    );
  });

  return (
    <nav
      aria-label={labelled ? "Profile links" : "Social links"}
      className={
        className || (labelled ? "home-social-row" : "home-social-nav")
      }
    >
      {labelled ? links : <div className="home-social-stack">{links}</div>}
    </nav>
  );
};

export default SocialLinks;
