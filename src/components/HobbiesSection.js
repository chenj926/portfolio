import React from "react";
import Material from "./Material";
import SectionHeading from "./SectionHeading";
import GuqinImage from "../assets/hobbies/Guqin.jpg";
import TennisImage from "../assets/hobbies/Tennis.jpg";
import ArtImage from "../assets/hobbies/Art.jpg";
import MobileGameImage from "../assets/hobbies/MobileGame.jpg";
import WavesMark from "../assets/decorations/porcelain/waves.svg";
import LatticeMark from "../assets/decorations/porcelain/lattice.svg";
import VineMark from "../assets/decorations/porcelain/vine.svg";
import BambooMark from "../assets/decorations/porcelain/bamboo.svg";
import LotusMark from "../assets/decorations/porcelain/lotus.svg";
import CloudMark from "../assets/decorations/porcelain/cloud.svg";
import "./PersonalSections.css";

const hobbies = [
  {
    title: "Tennis",
    description: "Playing since age 12, always chasing a cleaner serve.",
    media: TennisImage,
    pattern: WavesMark,
  },
  {
    title: "Soccer",
    description: "Weekend matches and tactical deep-dives.",
    media:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
    pattern: LatticeMark,
  },
  {
    title: "Art",
    description: "Sketching and experimenting with generative visuals.",
    media: ArtImage,
    pattern: VineMark,
  },
  {
    title: "Music",
    description: "Guqin, guitar, and curated focus playlists.",
    media: GuqinImage,
    pattern: BambooMark,
  },
  {
    title: "Workouts",
    description: "Strength training to stay grounded.",
    media:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    pattern: LotusMark,
  },
  {
    title: "Mobile Games",
    description: "Quick strategy sessions between projects.",
    media: MobileGameImage,
    pattern: CloudMark,
  },
];

const HobbiesSection = () => (
  <section
    id="hobbies-section"
    className="scholar-section personal-section hobbies-section"
    aria-labelledby="hobbies-title"
  >
    <SectionHeading id="hobbies-title" title="Hobbies" chinese="生活" />

    <div className="hobbies-gallery">
      {hobbies.map((hobby, index) => (
        <Material
          as="article"
          className="home-reading-surface hobbies-card"
          key={hobby.title}
          aria-labelledby={`hobby-title-${index}`}
        >
          <div className="hobbies-card__media">
            <img
              className="hobbies-card__image"
              src={hobby.media}
              alt={hobby.title}
              loading="lazy"
              decoding="async"
            />
            <span className="hobby-light" aria-hidden="true" />
          </div>
          <div className="hobbies-card__copy">
            <h3 id={`hobby-title-${index}`}>{hobby.title}</h3>
            <p>{hobby.description}</p>
            <img
              className="hobbies-card__ornament"
              src={hobby.pattern}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Material>
      ))}
    </div>
  </section>
);

export default HobbiesSection;
