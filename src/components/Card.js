import { Heading, HStack, Box, Text, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Card = ({ title, description, url, bgClr="#303030", txtClr="#DBD8CF" }) => {

  const handleMouseEnter = (event) => {
    event.target.style.textDecoration = "underline";
    event.target.style.cursor = "pointer"; // Set the cursor to pointer
  };

  const handleMouseLeave = (event) => {
  event.target.style.textDecoration = "none";
  };

  return (
    <VStack
      borderWidth="1px"
      // borderRidus="lg"
      overflow="hidden"
      bg={bgClr}
      boxShadow="lg"
      spacing={4}
      p={6}
      align="flex-start"
      rounded="xl"
      height="300px" // Fixed height 
      width="400px" // Fixed width
    >

      {/* Title */}
      <Box height="15%" width="100%" display="flex" alignItems="center">
        <Heading size="md" color={txtClr}>{title}</Heading>
        {/* <Text color="#DBD8CF" fontFamily="Times New Roman, serif" >{description}</Text> */}
      </Box>

      {/* Description */}
      <Box height="75%" width="100%" overflow="hidden">
        <Text
          color={txtClr}
          fontFamily="Times New Roman, serif"
        >
          {description}
        </Text>
      </Box>
      
      {/* Link */}
      <Box 
        height="10%"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Text color={txtClr} fontWeight="bold" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <a
            href={url}
            target="_blank" // Opens in a new tab
            rel="noopener noreferrer" // Security best practice
          >
            See More <FontAwesomeIcon icon={faArrowRight} size="1x"/>
          </a>
               
        </Text>
      </Box>
    </VStack>
  

  )
};

export default Card;
