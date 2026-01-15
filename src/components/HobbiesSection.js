import React from "react";
import { Box, Heading, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const hobbies = [
  {
    title: "Tennis",
    description: "Playing since age 12, always chasing a cleaner serve.",
    media:
      "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Soccer",
    description: "Weekend matches and tactical deep-dives.",
    media:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Art",
    description: "Sketching and experimenting with generative visuals.",
    media:
      "https://images.unsplash.com/photo-1452800185063-6db5e12b8e2e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Music",
    description: "Guqin, guitar, and curated focus playlists.",
    media:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Workouts",
    description: "Strength training to stay grounded.",
    media:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Mobile Games",
    description: "Quick strategy sessions between projects.",
    media:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=800&q=80",
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
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {hobbies.map((hobby) => (
          <Box
            key={hobby.title}
            backgroundColor="#ffffff"
            borderRadius="20px"
            padding={6}
            boxShadow="0 16px 24px rgba(61, 59, 54, 0.08)"
            minH="280px"
            display="flex"
            flexDirection="column"
            gap={4}
          >
            <Image
              src={hobby.media}
              alt={hobby.title}
              borderRadius="16px"
              height="140px"
              objectFit="cover"
              width="100%"
            />
            <Box>
              <Heading size="sm" mb={2}>
                {hobby.title}
              </Heading>
              <Text fontSize="sm" color="#5d564d">
                {hobby.description}
              </Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </FullScreenSection>
  );
};

export default HobbiesSection;
