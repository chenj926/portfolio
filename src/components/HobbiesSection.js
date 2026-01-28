import React from "react";
import { Box, Heading, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import FullScreenSection from "./FullScreenSection";
import { useTheme } from "../context/themeContext";

const MotionBox = motion(Box);

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
  const { isDarkMode } = useTheme();

  return (
    <FullScreenSection
      id="hobbies-section"
      backgroundColor={isDarkMode ? "#0a0a0f" : "#faf8f5"}
      px={{ base: 6, md: 12 }}
      py={{ base: 12, md: 20 }}
      alignItems="stretch"
      spacing={8}
    >
      <VStack align="flex-start" spacing={3}>
        <Text
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="0.2em"
          color={isDarkMode ? "#6366f1" : "#8b6914"}
          fontWeight="600"
        >
          Beyond Code
        </Text>
        <Heading size="lg" color={isDarkMode ? "#f0f0f5" : "#2d2a26"}>
          Hobbies
        </Heading>
        <Text maxW="640px" color={isDarkMode ? "#8b8b9a" : "#5c574e"}>
          Interests that keep me curious, balanced, and creative.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {hobbies.map((hobby, index) => (
          <MotionBox
            key={hobby.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
          >
            <Box
              className="glass-card card-shine"
              padding={5}
              display="flex"
              flexDirection="column"
              gap={4}
              height="100%"
              role="group"
            >
              <Box position="relative" overflow="hidden" borderRadius="lg">
                <Image
                  src={hobby.media}
                  alt={hobby.title}
                  height="140px"
                  objectFit="cover"
                  width="100%"
                  transition="transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                  _groupHover={{ transform: "scale(1.08)" }}
                />
                <Box
                  position="absolute"
                  inset={0}
                  bg={isDarkMode
                    ? "linear-gradient(180deg, transparent 60%, rgba(10, 10, 15, 0.8) 100%)"
                    : "linear-gradient(180deg, transparent 60%, rgba(250, 248, 245, 0.8) 100%)"
                  }
                />
              </Box>
              <Box>
                <Heading size="sm" mb={2} color={isDarkMode ? "#f0f0f5" : "#2d2a26"} fontWeight="600">
                  {hobby.title}
                </Heading>
                <Text fontSize="sm" color={isDarkMode ? "#8b8b9a" : "#5c574e"} lineHeight="1.7">
                  {hobby.description}
                </Text>
              </Box>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </FullScreenSection>
  );
};

export default HobbiesSection;
