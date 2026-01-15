import React from "react";
import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Badge,
  Image,
} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import branches from "../assets/decorations/branches.svg";

const experiences = [
  {
    year: "2022",
    title: "University of Toronto",
    description:
      "B.A.Sc. Industrial Engineering with minors in CS, AI, and Engineering Business. Focus on data systems, ML, and product design.",
  },
  {
    year: "2023",
    title: "Cellinemory",
    description:
      "Revamped Shopify storefront, implemented custom domain migration, and tuned diffusion workflows for visual merchandising.",
  },
  {
    year: "2024",
    title: "Centivizer",
    description:
      "Improved research game onboarding, packaged data pipelines into JSON, and enhanced UI navigation for higher completion rates.",
  },
  {
    year: "2025",
    title: "JB Research Group",
    description:
      "Exploring human-computer interaction research and ML-supported learning experiences for student creators.",
  },
  {
    year: "2025",
    title: "Jana Corporation",
    description:
      "Developing production-level probabilistic risk models (Python) and full-stack analysis tools (C#/React) for utility infrastructure.",
  },
  {
    year: "2026",
    title: "SJTU & UofT Research",
    description:
      "Researching linear attention mechanisms in Transformers (SJTU) and Bayesian Optimization under Uncertainty (UofT).",
  },
];

const ExperienceSection = () => {
  return (
    <FullScreenSection
      id="experience-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 18 }}
      alignItems="stretch"
      spacing={8}
      position="relative"
    >
      <Image
        src={branches}
        alt="Decorative branches"
        position="absolute"
        right={{ base: -6, md: 4 }}
        bottom={{ base: -4, md: 0 }}
        width={{ base: "200px", md: "320px" }}
        opacity={0.55}
        pointerEvents="none"
      />
      {/* 要能动, 要加图片 */}
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Experience Timeline</Heading>
        <Text maxW="640px" color="#5d564d">
          Scroll horizontally along the career tree to explore each role as a fruit on the
          branch.
        </Text>
      </VStack>
      <Box position="relative" width="100%" overflowX="auto" pb={4}>
        <Box
          position="absolute"
          top="56px"
          left={0}
          right={0}
          height="2px"
          backgroundColor="#b7b0a6"
        />
        <HStack spacing={10} align="flex-start" position="relative" px={2}>
          {experiences.map((experience) => (
            <VStack key={experience.title} align="flex-start" spacing={3} minW="240px">
              <Badge colorScheme="orange" variant="subtle" borderRadius="full" px={3} py={1}>
                {experience.year}
              </Badge>
              <Box
                width="16px"
                height="16px"
                borderRadius="full"
                backgroundColor="#d47b6a"
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "16px",
                  left: "7px",
                  width: "2px",
                  height: "24px",
                  backgroundColor: "#b7b0a6",
                }}
              />
              <Box
                backgroundColor="#ffffff"
                borderRadius="18px"
                padding={5}
                boxShadow="0 16px 24px rgba(61, 59, 54, 0.08)"
              >
                <Heading size="sm" mb={2}>
                  {experience.title}
                </Heading>
                <Text fontSize="sm" color="#5d564d">
                  {experience.description}
                </Text>
              </Box>
            </VStack>
          ))}
        </HStack>
      </Box>
    </FullScreenSection>
  );
};

export default ExperienceSection;
