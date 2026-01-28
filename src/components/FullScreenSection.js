import * as React from "react";
import { VStack } from "@chakra-ui/react";

const FullScreenSection = ({ children, isDarkBackground = true, ...boxProps }) => {
  return (
    <VStack
      backgroundColor={boxProps.backgroundColor || "#0a0a0f"}
      color={isDarkBackground ? "#f0f0f5" : "#0a0a0f"}
      overflow="hidden"
      width="100%"
      position="relative"
    >
      <VStack maxWidth="1280px" width="100%" position="relative" zIndex={1} {...boxProps}>
        {children}
      </VStack>
    </VStack>
  );
};

export default FullScreenSection;
