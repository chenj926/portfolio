import React from "react";
import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import FullScreenSection from "./FullScreenSection";
import { useTheme } from "../context/themeContext";

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
    title: "Jana Corporation",
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

// Group experiences by year
const groupedExperiences = experiences.reduce((acc, exp) => {
  if (!acc[exp.year]) {
    acc[exp.year] = [];
  }
  acc[exp.year].push(exp);
  return acc;
}, {});

const years = Object.keys(groupedExperiences).sort();

const ExperienceSection = () => {
  const { isDarkMode } = useTheme();

  return (
    <FullScreenSection
      id="experience-section"
      backgroundColor={isDarkMode ? "#0a0a0f" : "#faf8f5"}
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
          color={isDarkMode ? "#6366f1" : "#8b6914"}
          fontWeight="600"
        >
          Journey
        </Text>
        <Heading size="lg" color={isDarkMode ? "#f0f0f5" : "#2d2a26"}>
          Experience Timeline
        </Heading>
        <Text maxW="640px" color={isDarkMode ? "#8b8b9a" : "#5c574e"}>
          A flowing river of milestones marking my professional journey.
        </Text>
      </VStack>

      <Box position="relative" width="100%">
        {/* Fade edges */}
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          width="80px"
          background={isDarkMode
            ? "linear-gradient(90deg, rgba(10,10,15,1) 0%, rgba(10,10,15,0) 100%)"
            : "linear-gradient(90deg, rgba(250,248,245,1) 0%, rgba(250,248,245,0) 100%)"
          }
          pointerEvents="none"
          zIndex={3}
        />
        <Box
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          width="80px"
          background={isDarkMode
            ? "linear-gradient(270deg, rgba(10,10,15,1) 0%, rgba(10,10,15,0) 100%)"
            : "linear-gradient(270deg, rgba(250,248,245,1) 0%, rgba(250,248,245,0) 100%)"
          }
          pointerEvents="none"
          zIndex={3}
        />

        <Box
          position="relative"
          width="100%"
          overflowX="auto"
          pb={6}
          className="timeline-scroll"
        >
          {/* River SVG Background */}
          <Box
            position="absolute"
            top="60px"
            left={0}
            right={0}
            height="100px"
            pointerEvents="none"
            zIndex={0}
            overflow="visible"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1800 100"
              preserveAspectRatio="none"
              style={{ minWidth: "1800px" }}
            >
              <defs>
                <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isDarkMode ? "#6366f1" : "#8b6914"} stopOpacity="0.1" />
                  <stop offset="20%" stopColor={isDarkMode ? "#6366f1" : "#8b6914"} stopOpacity="0.6" />
                  <stop offset="50%" stopColor={isDarkMode ? "#8b5cf6" : "#a67c00"} stopOpacity="0.8" />
                  <stop offset="80%" stopColor={isDarkMode ? "#a855f7" : "#c49102"} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={isDarkMode ? "#a855f7" : "#c49102"} stopOpacity="0.1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* River glow background */}
              <path
                d="M 0 50 Q 150 30, 300 50 T 600 50 T 900 50 T 1200 50 T 1500 50 T 1800 50"
                fill="none"
                stroke="url(#riverGradient)"
                strokeWidth="40"
                opacity="0.15"
                filter="url(#glow)"
              />

              {/* Main river path */}
              <path
                d="M 0 50 Q 150 30, 300 50 T 600 50 T 900 50 T 1200 50 T 1500 50 T 1800 50"
                fill="none"
                stroke="url(#riverGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#glow)"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 20 10 20;10 20 0 20;0 20 10 20"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Animated particles */}
              <circle r="4" fill={isDarkMode ? "#6366f1" : "#8b6914"} opacity="0.8">
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  path="M 0 50 Q 150 30, 300 50 T 600 50 T 900 50 T 1200 50 T 1500 50 T 1800 50"
                />
              </circle>
              <circle r="3" fill={isDarkMode ? "#8b5cf6" : "#a67c00"} opacity="0.6">
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  begin="-2.5s"
                  path="M 0 50 Q 150 30, 300 50 T 600 50 T 900 50 T 1200 50 T 1500 50 T 1800 50"
                />
              </circle>
              <circle r="2" fill={isDarkMode ? "#a855f7" : "#c49102"} opacity="0.5">
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  begin="-5s"
                  path="M 0 50 Q 150 30, 300 50 T 600 50 T 900 50 T 1200 50 T 1500 50 T 1800 50"
                />
              </circle>
            </svg>
          </Box>

          <HStack spacing={0} align="flex-start" position="relative" px={8} py={2}>
            {years.map((year, yearIndex) => (
              <MotionBox
                key={year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: yearIndex * 0.15, ease: [0.4, 0, 0.2, 1] }}
                className="year-marker"
                minW="320px"
              >
                {/* Year Badge */}
                <Box className="year-badge">
                  {year}
                </Box>

                {/* Year Dot with pulse */}
                <Box className="year-dot" />

                {/* Connector line */}
                <Box className="year-connector" />

                {/* Experience Cards for this year */}
                <VStack spacing={4} mt={4} align="stretch" width="100%" px={2}>
                  {groupedExperiences[year].map((experience, expIndex) => (
                    <MotionBox
                      key={experience.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: yearIndex * 0.15 + expIndex * 0.1, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <Box
                        className="experience-card card-shine"
                        padding={5}
                        minH="180px"
                        display="flex"
                        flexDirection="column"
                        gap={3}
                      >
                        <HStack spacing={3}>
                          <Box
                            width="44px"
                            height="44px"
                            borderRadius="lg"
                            bg={isDarkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(139, 105, 20, 0.1)"}
                            border={`1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(139, 105, 20, 0.2)"}`}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontWeight="700"
                            color={isDarkMode ? "#6366f1" : "#8b6914"}
                            fontSize="sm"
                            transition="all 0.4s ease"
                            _groupHover={{
                              bg: isDarkMode ? "rgba(99, 102, 241, 0.25)" : "rgba(139, 105, 20, 0.2)",
                              boxShadow: isDarkMode
                                ? "0 0 15px rgba(99, 102, 241, 0.3)"
                                : "0 0 15px rgba(139, 105, 20, 0.2)",
                            }}
                          >
                            {experience.logo}
                          </Box>
                          <Heading size="sm" color={isDarkMode ? "#f0f0f5" : "#2d2a26"} fontWeight="600">
                            {experience.title}
                          </Heading>
                        </HStack>
                        <Text fontSize="sm" color={isDarkMode ? "#8b8b9a" : "#5c574e"} flex="1" lineHeight="1.7">
                          {experience.description}
                        </Text>
                      </Box>
                    </MotionBox>
                  ))}
                </VStack>
              </MotionBox>
            ))}
          </HStack>
        </Box>
      </Box>
    </FullScreenSection>
  );
};

export default ExperienceSection;
