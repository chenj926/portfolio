import * as React from "react";
import { VStack } from "@chakra-ui/react";

const FullScreenSection = ({
  children,
  isDarkBackground = true,
  ...boxProps
}) => {
  const { backgroundColor, id, ...sectionProps } = boxProps;

  return (
    <VStack
      as="section"
      id={id}
      data-section-bg={backgroundColor ? "custom" : "theme"}
      backgroundColor={backgroundColor || "transparent"}
      color={isDarkBackground ? "var(--text-primary)" : "var(--ink)"}
      width="100%"
      position="relative"
      overflow="visible"
    >
      <VStack
        maxWidth="var(--layout-max)"
        width="100%"
        position="relative"
        zIndex={1}
        {...sectionProps}
      >
        {children}
      </VStack>
    </VStack>
  );
};

export default FullScreenSection;
