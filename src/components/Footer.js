import React from "react";
import { Box, Flex, Text, HStack, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <Box
      backgroundColor="#0a0a0f"
      borderTop="1px solid rgba(255, 255, 255, 0.06)"
    >
      <footer>
        <Flex
          margin="0 auto"
          px={{ base: 6, md: 12 }}
          py={8}
          color="#8b8b9a"
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
              color="#8b8b9a"
              _hover={{ color: "#6366f1" }}
              transition="color 0.3s ease"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
            <Link
              href="https://github.com/chenj926"
              isExternal
              color="#8b8b9a"
              _hover={{ color: "#6366f1" }}
              transition="color 0.3s ease"
            >
              <FontAwesomeIcon icon={faGithub} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/ericjialuochen/"
              isExternal
              color="#8b8b9a"
              _hover={{ color: "#6366f1" }}
              transition="color 0.3s ease"
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
