import React from "react";
import { Box, Heading, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const hobbies = [
  {
    title: "Tennis",
    description: "Playing since age 12, always chasing a cleaner serve.",
  },
  {
    title: "Soccer",
    description: "Weekend matches and tactical deep-dives.",
  },
  {
    title: "Art",
    description: "Sketching and experimenting with generative visuals.",
  },
  {
    title: "Music",
    description: "Guqin, guitar, and curated focus playlists.",
  },
  {
    title: "Workouts",
    description: "Strength training to stay grounded.",
  },
  {
    title: "Mobile Games",
    description: "Quick strategy sessions between projects.",
  },
];

const HobbiesSection = () => {
  return (
    <FullScreenSection
      id="hobbies-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 18 }}
      alignItems="stretch"
      spacing={8}
    >
      {/* 同project */}
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Hobbies</Heading>
        <Text maxW="640px" color="#5d564d">
          Interests that keep me curious, balanced, and creative.
        </Text>
      </VStack>
      <Wrap spacing={6} align="stretch">
        {hobbies.map((hobby) => (
          <WrapItem key={hobby.title} flex="1" minW={{ base: "100%", md: "240px" }}>
            <Box
              backgroundColor="#ffffff"
              borderRadius="20px"
              padding={6}
              boxShadow="0 16px 24px rgba(61, 59, 54, 0.08)"
              width="100%"
            >
              <Heading size="sm" mb={2}>
                {hobby.title}
              </Heading>
              <Text fontSize="sm" color="#5d564d">
                {hobby.description}
              </Text>
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </FullScreenSection>
  );
};

export default HobbiesSection;
