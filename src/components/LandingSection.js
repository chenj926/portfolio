import React from "react";
import { Avatar, Heading, VStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import profilePic from "../images/profile pic.jpg";

const greeting = "Hello, I am Eric!";
const bio1 = "A frontend developer";
const bio2 = "specialised in React";

// Implement the UI for the LandingSection component according to the instructions.
// Use a combination of Avatar, Heading and VStack components.
const LandingSection = () => (
  <FullScreenSection
    justifyContent="center"
    alignItems="center"
    isDarkBackground
    backgroundColor="#2A4365"
  >
    <VStack spacing={4}>
      <Avatar size="x1" name="Jialuo (Eric) Chen" src={profilePic} boxSize="240px" />
      <Heading color="white" fontSize="sm">{greeting}</Heading>
      <Heading></Heading>
      <Heading color="white">{bio1}</Heading>
      <Heading color="white">{bio2}</Heading>
    
    </VStack>

  </FullScreenSection>
);

export default LandingSection;
