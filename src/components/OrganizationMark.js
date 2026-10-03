import React from "react";
import janaLogo from "../assets/organizations/jana.webp";
import sjtuLogo from "../assets/organizations/sjtu.webp";
import torontoLogo from "../assets/organizations/utoronto.webp";
import "./OrganizationMark.css";

const organizationMarks = {
  "JANA Corporation": {
    image: janaLogo,
    variant: "jana",
    width: 512,
    height: 162,
  },
  "Shanghai Jiao Tong University": {
    image: sjtuLogo,
    variant: "sjtu",
    width: 128,
    height: 128,
  },
  "University of Toronto": {
    image: torontoLogo,
    variant: "uoft",
    width: 48,
    height: 48,
  },
};

const fallbackMonogram = (organization) =>
  String(organization || "")
    .trim()
    .charAt(0)
    .toUpperCase() || "•";

const OrganizationMark = ({ organization, size = "research" }) => {
  const mark = organizationMarks[organization];

  return (
    <span
      className={`organization-mark organization-mark--${size} organization-mark--${
        mark ? mark.variant : "monogram"
      }`}
      aria-hidden="true"
    >
      {mark ? (
        <img
          src={mark.image}
          alt=""
          width={mark.width}
          height={mark.height}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span>{fallbackMonogram(organization)}</span>
      )}
    </span>
  );
};

export default OrganizationMark;
