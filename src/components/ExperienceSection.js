import React, { useEffect, useRef, useState } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import "./ExperienceRiver.css";

const experiences = [
  {
    year: "2022",
    title: "University of Toronto",
    description:
      "B.A.Sc. Industrial Engineering with minors in CS, AI, and Engineering Business. Focus on data systems, ML, and product design.",
    logo: "UofT",
  },
  {
    year: "2023",
    title: "Cellinemory",
    description:
      "Revamped Shopify storefront, implemented custom domain migration, and tuned diffusion workflows for visual merchandising.",
    logo: "C",
  },
  {
    year: "2024",
    title: "Centivizer",
    description:
      "Improved research game onboarding, packaged data pipelines into JSON, and enhanced UI navigation for higher completion rates.",
    logo: "CT",
  },
  {
    year: "2025",
    title: "JB Research Group",
    description:
      "Exploring human-computer interaction research and ML-supported learning experiences for student creators.",
    logo: "JB",
  },
  {
    year: "2025",
    title: "JANA Corporation",
    description:
      "Developing production-level probabilistic risk models (Python) and full-stack analysis tools (C#/React) for utility infrastructure.",
    logo: "JN",
  },
  {
    year: "2026",
    title: "SJTU & UofT Research",
    description:
      "Researching linear attention mechanisms in Transformers (SJTU) and Bayesian Optimization under Uncertainty (UofT).",
    logo: "SJ",
  },
];

const ExperienceCycle = ({ isClone = false }) => (
  <ol
    className={`experience-horizon-cycle${isClone ? " is-clone" : ""}`}
    aria-label={isClone ? undefined : "Career milestones from 2022 to 2026"}
    aria-hidden={isClone || undefined}
  >
    {experiences.map((experience, index) => (
      <li
        className="experience-horizon-item"
        key={`${isClone ? "clone" : "primary"}-${experience.title}`}
      >
        <div className="experience-year-row">
          <span className="experience-year">{experience.year}</span>
          <span className="experience-waypoint" aria-hidden="true" />
        </div>

        <article
          className="experience-milestone-card"
          aria-labelledby={isClone ? undefined : `experience-title-${index}`}
        >
          <div className="experience-card-heading">
            <span className="experience-logo" aria-hidden="true">
              {experience.logo}
            </span>
            <h3 id={isClone ? undefined : `experience-title-${index}`}>
              {experience.title}
            </h3>
          </div>
          <p>{experience.description}</p>
        </article>
      </li>
    ))}
  </ol>
);

const ExperienceSection = () => {
  const stageRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.08);
      },
      { threshold: [0, 0.08, 0.35] },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const motionPaused =
    manualPaused || pointerPaused || focusPaused || !isInView;

  const handlePointerEnter = (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      setPointerPaused(true);
    }
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      setPointerPaused(false);
    }
  };

  return (
    <FullScreenSection
      id="experience-section"
      backgroundColor="var(--bg-primary)"
      px={{ base: 6, md: 12 }}
      py={{ base: 12, md: 20 }}
      alignItems="stretch"
      spacing={8}
      position="relative"
    >
      <VStack align="flex-start" spacing={3}>
        <Text
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="0.2em"
          color="var(--accent-primary)"
          fontWeight="600"
        >
          Journey
        </Text>
        <Heading
          id="experience-timeline-heading"
          size="lg"
          color="var(--text-primary)"
        >
          Experience Timeline
        </Heading>
        <Text maxW="680px" color="var(--text-secondary)">
          Follow the river through each milestone in my career journey.
        </Text>
      </VStack>

      <Box
        ref={stageRef}
        className="experience-river-stage"
        data-motion-paused={motionPaused ? "true" : "false"}
        role="region"
        aria-labelledby="experience-timeline-heading"
      >
        <div className="experience-river-toolbar">
          <p id="experience-motion-help" className="experience-motion-help">
            <span className="experience-motion-copy experience-motion-copy--animated">
              The horizon drifts automatically. Hover or focus it to pause.
            </span>
            <span className="experience-motion-copy experience-motion-copy--reduced">
              Motion is reduced. Scroll horizontally to explore the timeline.
            </span>
          </p>

          <button
            className="experience-motion-toggle"
            type="button"
            aria-pressed={manualPaused}
            aria-controls="experience-horizon-track"
            onClick={() => setManualPaused((paused) => !paused)}
          >
            <span
              className={`experience-motion-toggle-icon${manualPaused ? " is-play" : ""}`}
              aria-hidden="true"
            />
            <span>{manualPaused ? "Resume horizon" : "Pause horizon"}</span>
          </button>
        </div>

        <div className="experience-river" aria-hidden="true">
          <div className="experience-river-bank experience-river-bank--far" />
          <div className="experience-river-current experience-river-current--far" />
          <div className="experience-river-current experience-river-current--near" />
          <div className="experience-river-glints" />
          <div className="experience-river-bank experience-river-bank--near" />
        </div>

        <div
          className="experience-horizon-viewport"
          tabIndex={0}
          aria-describedby="experience-motion-help"
          aria-label="Experience timeline"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onFocus={() => setFocusPaused(true)}
          onBlur={() => setFocusPaused(false)}
        >
          <div
            id="experience-horizon-track"
            className="experience-horizon-track"
          >
            <ExperienceCycle />
            <ExperienceCycle isClone />
          </div>
        </div>
      </Box>
    </FullScreenSection>
  );
};

export default ExperienceSection;
