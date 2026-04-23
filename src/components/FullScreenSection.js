import * as React from "react";
import { VStack } from "@chakra-ui/react";

const FullScreenSection = ({
  children,
  isDarkBackground = true,
  ...boxProps
}) => {
  const { backgroundColor, ...sectionProps } = boxProps;

  return (
    <VStack
      data-section-bg={backgroundColor ? "custom" : "theme"}
      backgroundColor="var(--bg-primary)"
      color={isDarkBackground ? "var(--text-primary)" : "var(--bg-primary)"}
      overflow="hidden"
      width="100%"
      position="relative"
    >
      <VStack maxWidth="1280px" width="100%" position="relative" zIndex={1} {...sectionProps}>
        {children}
      </VStack>
    </VStack>
  );
};

export default FullScreenSection;
