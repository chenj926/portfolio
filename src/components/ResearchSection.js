import React from "react";
import { Box, Heading, Link, Text, VStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const publications = [
  {
    title: "Sketch-to-Face Diffusion for Investigative Support",
    venue: "OpenReview",
    year: "2025",
    url: "https://openreview.net/",
  },
  {
    title: "Human-centered Systems for Student Creators",
    venue: "Working paper",
    year: "2024",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
];

const ResearchSection = () => {
  return (
    <FullScreenSection
      id="research-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 18 }}
      alignItems="stretch"
      spacing={8}
    >
      {/* 同project */}
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Research & Publications</Heading>
        <Text maxW="640px" color="#5d564d">
          Selected papers, open review submissions, and research prototypes.
        </Text>
      </VStack>
      <VStack spacing={4} align="stretch">
        {publications.map((pub) => (
          <Box
            key={pub.title}
            backgroundColor="#ffffff"
            borderRadius="20px"
            padding={6}
            boxShadow="0 16px 24px rgba(61, 59, 54, 0.08)"
          >
            <Text fontSize="xs" textTransform="uppercase" color="#7b736a">
              {pub.venue} · {pub.year}
            </Text>
            <Heading size="sm" mt={2} mb={3}>
              {pub.title}
            </Heading>
            <Link href={pub.url} isExternal color="#b25e4d" fontWeight="600">
              View publication →
            </Link>
          </Box>
        ))}
      </VStack>
    </FullScreenSection>
  );
};

export default ResearchSection;
