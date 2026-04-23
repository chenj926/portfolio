import React, { useEffect, useRef } from "react";
import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import FullScreenSection from "./FullScreenSection";

const MotionBox = motion(Box);

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

const ExperienceSection = () => {
  const scrollRef = useRef(null);
  const cardPausedRef = useRef(false);
  const pointerPausedRef = useRef(false);
  const inViewRef = useRef(false);
  const directionRef = useRef(1);
  const pointerResumeTimeoutRef = useRef(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    let animationFrameId;
    let lastTimestamp = 0;
    const pixelsPerSecond = 26;

    const shouldPause = () =>
      !inViewRef.current ||
      cardPausedRef.current ||
      pointerPausedRef.current;

    const clearPointerResumeTimeout = () => {
      if (pointerResumeTimeoutRef.current) {
        window.clearTimeout(pointerResumeTimeoutRef.current);
        pointerResumeTimeoutRef.current = null;
      }
    };

    const pauseForInteraction = () => {
      pointerPausedRef.current = true;
      clearPointerResumeTimeout();
    };

    const resumeAfterInteraction = () => {
      clearPointerResumeTimeout();
      pointerResumeTimeoutRef.current = window.setTimeout(() => {
        pointerPausedRef.current = false;
        pointerResumeTimeoutRef.current = null;
      }, 900);
    };

    const animate = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;

      if (!shouldPause() && maxScrollLeft > 0) {
        const scrollDistance =
          (pixelsPerSecond * delta * directionRef.current) / 1000;
        const nextScrollLeft = scrollElement.scrollLeft + scrollDistance;

        if (nextScrollLeft >= maxScrollLeft) {
          scrollElement.scrollLeft = maxScrollLeft;
          directionRef.current = -1;
        } else if (nextScrollLeft <= 0) {
          scrollElement.scrollLeft = 0;
          directionRef.current = 1;
        } else {
          scrollElement.scrollLeft = nextScrollLeft;
        }
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    const handlePointerDown = () => {
      pauseForInteraction();
    };

    const handlePointerUp = () => {
      resumeAfterInteraction();
    };

    const handleWheel = () => {
      pauseForInteraction();
      resumeAfterInteraction();
    };

    const handleKeyDown = (event) => {
      const horizontalKeys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (horizontalKeys.includes(event.key)) {
        pauseForInteraction();
        resumeAfterInteraction();
      }
    };

    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current =
            entry.isIntersecting && entry.intersectionRatio > 0.15;
        },
        { threshold: [0, 0.15, 0.5, 1] }
      );
      observer.observe(scrollElement);
    } else {
      inViewRef.current = true;
    }

    scrollElement.addEventListener("pointerdown", handlePointerDown);
    scrollElement.addEventListener("wheel", handleWheel, { passive: true });
    scrollElement.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      clearPointerResumeTimeout();
      observer?.disconnect();
      scrollElement.removeEventListener("pointerdown", handlePointerDown);
      scrollElement.removeEventListener("wheel", handleWheel);
      scrollElement.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

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
        <Heading size="lg" color="var(--text-primary)">
          Experience Timeline
        </Heading>
        <Text maxW="640px" color="var(--text-secondary)">
          Scroll horizontally to explore each milestone in my career journey.
        </Text>
      </VStack>

      <Box position="relative" width="100%">
        {/* Fade edges */}
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          width="60px"
          background="linear-gradient(90deg, rgba(var(--bg-primary-rgb), 1) 0%, rgba(var(--bg-primary-rgb), 0) 100%)"
          pointerEvents="none"
          zIndex={2}
        />
        <Box
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          width="60px"
          background="linear-gradient(270deg, rgba(var(--bg-primary-rgb), 1) 0%, rgba(var(--bg-primary-rgb), 0) 100%)"
          pointerEvents="none"
          zIndex={2}
        />

        <Box
          ref={scrollRef}
          position="relative"
          width="100%"
          overflowX="auto"
          pb={4}
          className="timeline-scroll"
        >
          <Box position="relative" minW="max-content" className="timeline-track">
            {/* Timeline line */}
            <Box
              position="absolute"
              top="48px"
              left={0}
              right={0}
              height="2px"
              background="linear-gradient(90deg, transparent, var(--accent-border), var(--accent-border), transparent)"
            />

            <HStack spacing={8} align="flex-start" position="relative" px={4} py={2}>
              {experiences.map((experience, index) => (
                <MotionBox
                  key={experience.title}
                  className="timeline-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                  }}
                >
                  <VStack
                    align="flex-start"
                    spacing={3}
                    minW="280px"
                    maxW="280px"
                  >
                    <Badge
                      bg="var(--accent-wash)"
                      color="var(--accent-primary)"
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="600"
                      border="1px solid var(--accent-border)"
                    >
                      {experience.year}
                    </Badge>

                    {/* Timeline dot */}
                    <Box
                      width="12px"
                      height="12px"
                      borderRadius="full"
                      bg="var(--accent-gradient)"
                      boxShadow="0 0 20px var(--accent-glow)"
                      position="relative"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: "12px",
                        left: "5px",
                        width: "2px",
                        height: "20px",
                        background:
                          "linear-gradient(180deg, var(--accent-glow), transparent)",
                      }}
                    />

                    <Box
                      className="glass-card card-shine"
                      padding={5}
                      minH="200px"
                      display="flex"
                      flexDirection="column"
                      gap={3}
                      cursor="default"
                      onPointerEnter={() => {
                        cardPausedRef.current = true;
                      }}
                      onPointerLeave={() => {
                        cardPausedRef.current = false;
                      }}
                    >
                      <HStack spacing={3}>
                        <Box
                          width="40px"
                          height="40px"
                          borderRadius="lg"
                          bg="var(--accent-wash)"
                          border="1px solid var(--accent-border)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="700"
                          color="var(--accent-primary)"
                          fontSize="sm"
                        >
                          {experience.logo}
                        </Box>
                        <Heading
                          size="sm"
                          color="var(--text-primary)"
                          fontWeight="600"
                        >
                          {experience.title}
                        </Heading>
                      </HStack>
                      <Text
                        fontSize="sm"
                        color="var(--text-secondary)"
                        flex="1"
                        lineHeight="1.7"
                      >
                        {experience.description}
                      </Text>
                    </Box>
                  </VStack>
                </MotionBox>
              ))}
            </HStack>
          </Box>
        </Box>
      </Box>
    </FullScreenSection>
  );
};

export default ExperienceSection;
