import React from "react";
import { Box, Text, VStack, Flex, Divider } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection"; 
import Card from "./Card"; 

const experiences = [
  {
    year: "September, 2022",
    title: "University Of Toronto",
    description:
      "I'm pursuing a Bachelor of Applied Science and Industrial Engineering, with specialization in AI, minor in CS.",
  },
  {
    year: "May, 2023",
    title: "Hangzhou",
    description: "11",
  },
  {
    year: "May, 2024",
    title: "Centivizer",
    description: "22",
  },
];

const ExperienceSection = () => {
  return (
    <FullScreenSection
      isDarkBackground
      backgroundColor="#303030"
      py={16}
      px={8}
    >
      <Flex
        direction="column"
        justify="center"
        align="center"
        minHeight="100vh" // Ensures the content takes full screen height
        width="100%"
      >
        <Text 
          fontSize="4xl" 
          fontWeight="bold" 
          mb={12} 
          color="#DBD8CF" 
          textAlign="center"
        >
          Experiences
        </Text>
        <VStack spacing={16} width="100%">
          {experiences
            .slice() // Creates a shallow copy of the array
            .reverse() // Reverses the order from current to past
            .map((experience, index) => (
              <Flex
                key={index}
                direction="row"
                align="relative"
                width="100%"
              >
                {/* Date Column */}
                <Box width="120px" textAlign="right" pr={4}>
                  <Text color="#DBD8CF">{experience.year}</Text>
                </Box>

                {/* Timeline Column */}
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  mx={4}
                  position="relative"
                >
                  <Box
                    width="12px"
                    height="12px"
                    borderRadius="full"
                    backgroundColor="#4B6B8A"  
                  />
                  {index < experiences.length && ( // Fix timeline end
                    <Divider
                      orientation="vertical"
                      borderColor="#4B6B8A"  
                      borderWidth="2px"
                      height="300px"  
                      mt={4}
                    />
                  )}
                </Flex>

                {/* Card Column */}
                <Box flex="1" display="flex" justifyContent="center">
                  <Card
                    title={experience.title}
                    description={experience.description}
                    url="#"
                    bgClr="#4B6B8A"
                  />
                </Box>
              </Flex>
            ))}
        </VStack>
      </Flex>
    </FullScreenSection>
  );
};

export default ExperienceSection;
