import React from "react";
import {
  Badge,
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import wave from "../assets/decorations/wave.svg";
import profilePic from "../assets/images/profile pic.jpg";

const statusCards = [
  {
    title: "Available for select projects",
    description: "Currently open to focused collaborations with clear impact and timelines.",
    tags: ["AI Engineering", "Applied Research", "Product"],
  },
  {
    title: "Research partnerships",
    description: "Welcoming co-authored work in trustworthy or efficient ML systems.",
    tags: ["Trustworthy AI", "Transformers", "Bayesian Optimization"],
  },
];

const StatusCard = ({ title, description, tags }) => (
  <Box
    backgroundColor="#ffffff"
    borderRadius="22px"
    padding={{ base: 5, md: 6 }}
    boxShadow="0 20px 30px rgba(61, 59, 54, 0.08)"
    height="100%"
  >
    <Text fontSize="xs" textTransform="uppercase" color="#7b736a" mb={2}>
      Status
    </Text>
    <Heading size="sm" mb={2}>
      {title}
    </Heading>
    <Text fontSize="sm" color="#5d564d" mb={4}>
      {description}
    </Text>
    <HStack spacing={2} flexWrap="wrap">
      {tags.map((tag) => (
        <Badge
          key={tag}
          colorScheme="orange"
          variant="subtle"
          px={3}
          py={1}
          borderRadius="full"
          textTransform="none"
        >
          {tag}
        </Badge>
      ))}
    </HStack>
  </Box>
);

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
      <VStack align="flex-start" spacing={6} width="100%">
        <Heading size="lg">About & Status</Heading>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} width="100%">
          <Box
            backgroundColor="#ffffff"
            borderRadius="26px"
            padding={{ base: 6, md: 8 }}
            boxShadow="0 20px 30px rgba(61, 59, 54, 0.08)"
          >
            <VStack align="center" spacing={4} textAlign="center">
              <Image
                src={profilePic}
                alt="Portrait of Jialuo (Eric) Chen"
                borderRadius="24px"
                objectFit="cover"
                width={{ base: "180px", md: "220px" }}
                height={{ base: "180px", md: "220px" }}
              />
              <Heading size="md">About Me</Heading>
              <Text color="#5d564d" fontSize="sm">
                I blend machine learning research with production-ready software systems,
                focusing on trustworthy AI, scalable data platforms, and human-centered
                products.
              </Text>
              <HStack spacing={2} flexWrap="wrap" justify="center">
                {["Toronto", "ML Systems", "Product Builder"].map((item) => (
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
            </VStack>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {statusCards.map((status) => (
              <StatusCard key={status.title} {...status} />
            ))}
          </SimpleGrid>
        </SimpleGrid>
      </VStack>
    </FullScreenSection>
  );
};

export default StatusSection;
