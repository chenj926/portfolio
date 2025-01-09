import React from "react";
import { Box, Text, VStack, Flex, Divider } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection"; // Assuming the FullScreenSection is saved as a component
import Card from "./Card"; // Assuming Card.js is in the same directory

const experiences = [
  {
    year: "September, 2022",
    title: "University Of Toronto",
    description:
      "I'm pursuing an Bachelor of Applied Science and Industrial Engneering, with specialise in AI, minor in CS.",
  },
  {
    year: "May, 2023",
    title: "Hangzhou",
    description:
      "11",
  },
  {
    year: "May, 2024",
    title: "Centivizer",
    description:
      "22",
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
      <Text 
        fontSize="4xl" 
        fontWeight="bold" 
        mb={12} 
        color="#DBD8CF" 
        textAlign="center"
      >
        Experiences
      </Text>
      <VStack spacing={16} position="relative" width="100%">
        {experiences.map((experience, index) => (
          <Flex
            key={index}
            direction="row"
            align="center"
            width="100%"
          >
            {/* Date Column */}
            <Box width="120px" textAlign="right" pr={4} >
              <Text color="#DBD8CF">{experience.date}</Text>
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
                backgroundColor="#303030"
              />
              {index < experiences.length - 1 && (
                <Divider
                  orientation="vertical"
                  borderColor="#303030"
                  borderWidth="2px"
                  height="100px"
                  mt={4}

                />
              )}
            </Flex>

            {/* Card Column */}
            <Box flex="1">
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
    </FullScreenSection>
  );
};

export default ExperienceSection;
