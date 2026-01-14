import React from "react";
import {
  Box,
  Heading,
  HStack,
  Link,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const projects = [
  {
    title: "Personal WealthTracker",
    description:
      "Full-stack expense tracker with Spring Boot + React. Built for shared accounts, audit-ready reports, and clean architecture testing.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    url: "https://github.com/chenj926/Accounting_System",
  },
  {
    title: "Portfolio Website",
    description:
      "A calm, editorial portfolio layout with storytelling sections, timelines, and project cards.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    url: "https://github.com/chenj926/portfolio",
  },
  {
    title: "WeedOut Documentation",
    description:
      "Documentation platform with responsive UI, live updates, and polished content workflows for open-source contributors.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    url: "https://github.com/uoftweb-admin/weedout-project",
  },
  {
    title: "SketchToFace",
    description:
      "GAN pipeline for converting sketches into realistic face images to assist investigative workflows.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    url: "https://github.com/chenj926/Line2Live",
  },
];

const ProjectsSection = () => {
  return (
    <FullScreenSection
      id="projects-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 18 }}
      alignItems="stretch"
      spacing={8}
    >
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Projects</Heading>
        <Text maxW="640px" color="#5d564d">
          Featured builds with visuals, context, and a quick link to dive deeper.
        </Text>
      </VStack>
      <HStack spacing={6} flexWrap="wrap" align="stretch">
        {projects.map((project) => (
          <Box
            key={project.title}
            backgroundColor="#ffffff"
            borderRadius="22px"
            overflow="hidden"
            boxShadow="0 18px 28px rgba(61, 59, 54, 0.08)"
            flex="1"
            minW={{ base: "100%", md: "280px" }}
            maxW={{ base: "100%", md: "360px" }}
          >
            <Image src={project.image} alt={project.title} height="180px" width="100%" objectFit="cover" />
            <Box p={6}>
              <Heading size="sm" mb={2}>
                {project.title}
              </Heading>
              <Text fontSize="sm" color="#5d564d" mb={4}>
                {project.description}
              </Text>
              <Link href={project.url} isExternal color="#b25e4d" fontWeight="600">
                View project →
              </Link>
            </Box>
          </Box>
        ))}
      </HStack>
    </FullScreenSection>
  );
};

export default ProjectsSection;
