import React from "react";
import {
  Badge,
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import wave from "../assets/decorations/wave.svg";

const availability = [
  "Full-time",
  "Part-time",
  "Contract",
  "Volunteer",
  "Research",
  "Project",
];

const StatusSection = () => {
  return (
    <FullScreenSection
      id="status-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 16 }}
      alignItems="stretch"
      spacing={8}
      position="relative"
    >
      <Image
        src={wave}
        alt="Decorative wave"
        position="absolute"
        bottom={{ base: 6, md: 4 }}
        left={{ base: -4, md: 8 }}
        width={{ base: "240px", md: "420px" }}
        opacity={0.5}
        pointerEvents="none"
      />
      {/* status做的像2.那个一样 简约, 然后每一个status做一个组件*/}
      <VStack align="flex-start" spacing={4} width="100%">
        <Heading size="lg">Status</Heading>
        <Text maxW="640px" color="#5d564d">
          Here is a quick snapshot of how I can collaborate right now. If none are
          highlighted, I&apos;m likely at full capacity.
        </Text>
        <Box
          backgroundColor="#ffffff"
          borderRadius="24px"
          padding={{ base: 6, md: 8 }}
          boxShadow="0 20px 30px rgba(61, 59, 54, 0.08)"
        >
          <HStack spacing={4} flexWrap="wrap">
            {availability.map((item) => (
              <Badge
                key={item}
                colorScheme="orange"
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
                textTransform="none"
              >
                {item}
              </Badge>
            ))}
          </HStack>
          <Text mt={4} fontWeight="600">
            Currently: Open to select collaborations in software, ML, and applied research.
          </Text>
        </Box>
      </VStack>
    </FullScreenSection>
  );
};

export default StatusSection;
