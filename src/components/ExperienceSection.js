import React from "react";
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

const ExperienceSection = () => {
  return (
    <FullScreenSection
      id="experience-section"
      backgroundColor="#0a0a0f"
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
          color="#6366f1"
          fontWeight="600"
        >
          Journey
        </Text>
        <Heading size="lg" color="#f0f0f5">
          Experience Timeline
        </Heading>
        <Text maxW="640px" color="#8b8b9a">
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
          background="linear-gradient(90deg, rgba(10,10,15,1) 0%, rgba(10,10,15,0) 100%)"
          pointerEvents="none"
          zIndex={2}
        />
        <Box
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          width="60px"
          background="linear-gradient(270deg, rgba(10,10,15,1) 0%, rgba(10,10,15,0) 100%)"
          pointerEvents="none"
          zIndex={2}
        />

        <Box
          position="relative"
          width="100%"
          overflowX="auto"
          pb={4}
          className="timeline-scroll"
        >
          {/* Timeline line */}
          <Box
            position="absolute"
            top="48px"
            left={0}
            right={0}
            height="2px"
            background="linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3), transparent)"
          />

          <HStack spacing={8} align="flex-start" position="relative" px={4} py={2}>
            {experiences.map((experience, index) => (
              <MotionBox
                key={experience.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <VStack
                  align="flex-start"
                  spacing={3}
                  minW="280px"
                  maxW="280px"
                >
                  <Badge
                    bg="rgba(99, 102, 241, 0.15)"
                    color="#6366f1"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="600"
                    border="1px solid rgba(99, 102, 241, 0.3)"
                  >
                    {experience.year}
                  </Badge>

                  {/* Timeline dot */}
                  <Box
                    width="12px"
                    height="12px"
                    borderRadius="full"
                    bg="linear-gradient(135deg, #6366f1, #8b5cf6)"
                    boxShadow="0 0 20px rgba(99, 102, 241, 0.5)"
                    position="relative"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: "12px",
                      left: "5px",
                      width: "2px",
                      height: "20px",
                      background: "linear-gradient(180deg, rgba(99, 102, 241, 0.5), transparent)",
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
                  >
                    <HStack spacing={3}>
                      <Box
                        width="40px"
                        height="40px"
                        borderRadius="lg"
                        bg="rgba(99, 102, 241, 0.15)"
                        border="1px solid rgba(99, 102, 241, 0.3)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="700"
                        color="#6366f1"
                        fontSize="sm"
                      >
                        {experience.logo}
                      </Box>
                      <Heading size="sm" color="#f0f0f5" fontWeight="600">
                        {experience.title}
                      </Heading>
                    </HStack>
                    <Text fontSize="sm" color="#8b8b9a" flex="1" lineHeight="1.7">
                      {experience.description}
                    </Text>
                  </Box>
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
