import { Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Card = ({ title, description, imageSrc }) => {
  return (
    <VStack
      borderWidth="1px"
      // borderRidus="lg"
      overflow="hidden"
      bg="white"
      boxShadow="lg"
      spacing={4}
      p={4}
      align="flex-start"
    >
      <Image 
        src= {imageSrc} 
        alt={title} 
        // borderRidus="md"
        objectFit="cover"
        width="100%"
        height="auto"
      />
      <VStack align="flex-start" spacing={2}>
        <Heading size="md" color="teal.500">{title}</Heading>
        <Text color="teal.500">{description}</Text>
      </VStack>
      
      <HStack spacing={2} align="center">
        <Text color="teal.500" fontWeight="bold">
              See More <FontAwesomeIcon icon={faArrowRight} size="1x"/>
        </Text>
      </HStack>
    </VStack>
  

  )
};

export default Card;
