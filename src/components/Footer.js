import React from "react";
import { Box, Flex, Text, HStack, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useTheme } from "../context/themeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <Box
      backgroundColor={isDarkMode ? "#0a0a0f" : "#faf8f5"}
      borderTop={`1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(139, 90, 43, 0.1)"}`}
    >
      <footer>
        <Flex
          margin="0 auto"
          px={{ base: 6, md: 12 }}
          py={8}
          color={isDarkMode ? "#8b8b9a" : "#5c574e"}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: "column", md: "row" }}
          gap={4}
          maxWidth="1280px"
        >
          <Text fontSize="sm">
            Jialuo (Eric) Chen · © {new Date().getFullYear()}
          </Text>
          <HStack spacing={6}>
            <Link
              href="mailto:jialuo.chen@utoronto.ca"
              isExternal
              color={isDarkMode ? "#8b8b9a" : "#5c574e"}
              _hover={{ color: isDarkMode ? "#6366f1" : "#8b6914" }}
              transition="color 0.4s ease"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
            <Link
              href="https://github.com/chenj926"
              isExternal
              color={isDarkMode ? "#8b8b9a" : "#5c574e"}
              _hover={{ color: isDarkMode ? "#6366f1" : "#8b6914" }}
              transition="color 0.4s ease"
            >
              <FontAwesomeIcon icon={faGithub} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/ericjialuochen/"
              isExternal
              color={isDarkMode ? "#8b8b9a" : "#5c574e"}
              _hover={{ color: isDarkMode ? "#6366f1" : "#8b6914" }}
              transition="color 0.4s ease"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
          </HStack>
        </Flex>
      </footer>
    </Box>
  );
};

export default Footer;
