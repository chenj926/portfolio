import React from "react";
import { Box, Heading, HStack, Tag, Text, VStack, Wrap } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const skills = {
  "Engineering": ["React", "TypeScript", "Spring Boot", "Node.js", "SQL"],
  "Machine Learning": ["PyTorch", "Diffusion Models", "GANs", "ML Ops"],
  "Product": ["Design Systems", "User Research", "A/B Testing", "Analytics"],
};

const SkillsSection = () => {
  return (
    <FullScreenSection
      id="skills-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 18 }}
      alignItems="stretch"
      spacing={8}
    >
      {/* 同2. */}
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Skills</Heading>
        <Text maxW="640px" color="#5d564d">
          A snapshot of the tools and focus areas I enjoy using most.
        </Text>
      </VStack>
      <HStack spacing={6} align="stretch" flexWrap="wrap">
        {Object.entries(skills).map(([category, items]) => (
          <Box
            key={category}
            backgroundColor="#ffffff"
            borderRadius="20px"
            padding={6}
            boxShadow="0 16px 24px rgba(61, 59, 54, 0.08)"
            flex="1"
            minW={{ base: "100%", md: "240px" }}
          >
            <Heading size="sm" mb={3}>
              {category}
            </Heading>
            <Wrap spacing={2}>
              {items.map((skill) => (
                <Tag key={skill} borderRadius="full" variant="subtle" colorScheme="orange">
                  {skill}
                </Tag>
              ))}
            </Wrap>
          </Box>
        ))}
      </HStack>
    </FullScreenSection>
  );
};

export default SkillsSection;
