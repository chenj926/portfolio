import React from "react";
import { Box, Flex, Text, HStack, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <Box
      backgroundColor="var(--bg-primary)"
      borderTop="1px solid var(--border-subtle)"
    >
      <footer>
        <Flex
          margin="0 auto"
          px={{ base: 6, md: 12 }}
          py={8}
          color="var(--text-secondary)"
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
              color="var(--text-secondary)"
              _hover={{ color: "var(--accent-primary)" }}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
            <Link
              href="https://github.com/chenj926"
              isExternal
              color="var(--text-secondary)"
              _hover={{ color: "var(--accent-primary)" }}
            >
              <FontAwesomeIcon icon={faGithub} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/ericjialuochen/"
              isExternal
              color="var(--text-secondary)"
              _hover={{ color: "var(--accent-primary)" }}
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
