import React, { useEffect } from "react";
import { Avatar, Heading, VStack, Text, Box } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import profilePic from "../assets/images/profile pic.jpg";

const greeting = "Hello, I am Eric!";
const bio = "\t A third-year Industrial Engineering student \
              at the University of Toronto. Specialised in Software \
              Engineering and Machine Learning Engineering. \n Seeking \
              2025 PEY Co-op opportunities in Software Engineering and \
              Machine Learning Engineering.";

const LandingSection = () => {

  const [displayedText, setDisplayedText] = React.useState("");
  const fullText = "Let's make this better together !!!"; // Text to be displayed

  useEffect(() => {
    let index = 0;
    const typingInterval = 100; // Typing speed (ms per character)
    const gapDelay = 1000; // Delay between repeats (in ms)

    const intervalId = setInterval(() => { 
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index)); // Display the next character
        index++;
      } else {
        setTimeout(() => {
          index = 0; // Reset the index after the gap
        }, gapDelay);
      }
      
    }, typingInterval); // Adjust speed (ms per character) as needed

    return () => clearInterval(intervalId);
  }, []);

  return(
  <FullScreenSection
    justifyContent="center"
    alignItems="center"
    isDarkBackground
    backgroundColor="#4B6B8A"
  >
    <VStack spacing={6}>
      {/* Typing animation text */}
      <Heading
          color="#DBD8CF"
          fontSize={["md", "lg", "xl"]}
          textAlign="center"
          height="30px" // Ensure consistent height
      >
        {displayedText}
        <span
          style={{
            borderRight: "2px solid white",
            display: "inline-block",
            animation: "blink-caret 0.5s step-end infinite",
          }}
        />
      </Heading>

      {/* profile pic */}
      <Avatar 
        size="2x1" 
        name="Jialuo (Eric) Chen" 
        src={profilePic} 
        boxSize={["120px", "180px", "240px"]}
      />

      {/* Greeting */}
      <Heading color="#DBD8CF" fontSize={["lg", "xl", "2xl"]}>
        {greeting}
      </Heading>

      {/* Text with Box */}
      <Box
        border="1px solid #DBD8CF"
        // borderRadius="md"
        rounded={["md", "lg", "xl"]}
        padding={4}
        backgroundColor="rgba(255, 255, 255, 0.1)"
        width={["90%", "75%", "60%"]}
        textAlign="left"
        boxShadow="0px 4px 15px rgba(0, 0, 0, 0.3)"
        fontFamily="Times New Roman, serif"
      >
        <Text color="#DBD8CF" fontSize={["sm", "md", "lg"]} whiteSpace="pre-line">{bio}</Text>
      </Box>
    </VStack>

  </FullScreenSection>
  );
 };

export default LandingSection;
