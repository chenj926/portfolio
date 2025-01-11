import React from "react";
import { Box, Text, VStack, Flex, Divider } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection"; 
import Card from "./Card"; 

const experiences = [
  {
    year: "September, 2022",
    title: "University of Toronto",
    description:
      "Pursuing a Bachelor of Applied Science in Industrial Engineering with minors in Computer Science, Artificial Intelligence, and Engineering Business. Relevant courses include Data Structures, Database Systems, and Machine Learning.",
  },
  {
    year: "May, 2023",
    title: "Cellinemory Brand Management Co., LTD",
    description:
      "Revamped the company's Shopify site with a custom domain and visual redesign, enhancing global e-commerce readiness. Optimized Stable Diffusion hyperparameters for product visualization, improving image quality by 8%.",
  },
  {
    year: "May, 2024",
    title: "Centivizer",
    description:
      "Enhanced the usability of a research game by refining user login functionality, packaging data into JSON objects for backend storage, and improving interface navigation, increasing user ratings by 15%.",
  },
  {
    year: "January, 2025",
    title: "JB Research Group",
    description: "44",
  }
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
                    url="https://www.linkedin.com/in/ericjialuochen/"
                    target="_blank" // Opens in a new tab
                    rel="noopener noreferrer" // Security best practice
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
