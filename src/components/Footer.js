import React from "react";
import { Box, Flex, Text, HStack, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { profile, socialLinks } from "../data/profile";

const footerLinks = socialLinks.filter(({ label }) =>
  ["Email", "GitHub", "LinkedIn"].includes(label),
);

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
            {profile.name} · © {new Date().getFullYear()}
          </Text>
          <HStack spacing={6}>
            {footerLinks.map(({ label, url, icon }) => (
              <Link
                key={label}
                href={url}
                aria-label={label}
                isExternal={url.startsWith("http")}
                color="var(--text-secondary)"
                _hover={{ color: "var(--accent-primary)" }}
              >
                <FontAwesomeIcon icon={icon} aria-hidden="true" />
              </Link>
            ))}
          </HStack>
        </Flex>
      </footer>
    </Box>
  );
};

export default Footer;
