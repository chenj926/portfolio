import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
  Tag,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import FullScreenSection from "./FullScreenSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faGlobe,
  faLink,
  faChevronDown,
  faChevronUp,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useTheme } from "../context/themeContext";

const MotionBox = motion(Box);

const linkIcons = {
  github: faGithub,
  paper: faFileLines,
  website: faGlobe,
  default: faLink,
};

const publications = [
  {
    title: "(Coming Soon) Listwise Direct Preference Optimization with Multi-Dimensional Preference Mixing",
    venue: "ACL 2026",
    year: "Jan 2026",
    description:
      "A framework for blending preference signals to improve ranking quality across multiple alignment objectives.",
    tags: ["LLM Alignment", "Preference Learning"],
    links: [
      { label: "Paper", url: "https://arxiv.org/", type: "paper" },
      { label: "Github", url: "https://arxiv.org/", type: "github" },
    ],
  },
];

const ResearchSection = () => {
  const [showAll, setShowAll] = useState(false);
  const { isDarkMode } = useTheme();
  const visiblePublications = useMemo(
    () => (showAll ? publications : publications.slice(0, 6)),
    [showAll]
  );

  return (
    <FullScreenSection
      id="research-section"
      backgroundColor={isDarkMode ? "#0a0a0f" : "#faf8f5"}
      px={{ base: 6, md: 12 }}
      py={{ base: 12, md: 20 }}
      alignItems="stretch"
      spacing={8}
    >
      <VStack align="flex-start" spacing={3}>
        <Text
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="0.2em"
          color={isDarkMode ? "#6366f1" : "#8b6914"}
          fontWeight="600"
        >
          Research
        </Text>
        <Heading size="lg" color={isDarkMode ? "#f0f0f5" : "#2d2a26"}>
          Publications
        </Heading>
        <Text maxW="640px" color={isDarkMode ? "#8b8b9a" : "#5c574e"}>
          Selected papers, open review submissions, and research prototypes.
        </Text>
      </VStack>

      <VStack spacing={6} align="stretch">
        {visiblePublications.map((pub, index) => (
          <MotionBox
            key={pub.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Box
              className="glass-card"
              padding={{ base: 6, md: 7 }}
              display="flex"
              flexDirection="column"
            >
              <Text
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.1em"
                color={isDarkMode ? "#6366f1" : "#8b6914"}
                fontFamily="mono"
              >
                {pub.venue} · {pub.year}
              </Text>
              <Heading size="sm" mt={3} mb={3} color={isDarkMode ? "#f0f0f5" : "#2d2a26"} fontWeight="600">
                {pub.title}
              </Heading>
              <Text fontSize="sm" color={isDarkMode ? "#8b8b9a" : "#5c574e"} mb={4} lineHeight="1.7">
                {pub.description}
              </Text>

              <Wrap spacing={2} mb={4}>
                {pub.tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag
                      size="sm"
                      bg={isDarkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(139, 105, 20, 0.1)"}
                      color={isDarkMode ? "#6366f1" : "#8b6914"}
                      border={`1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(139, 105, 20, 0.2)"}`}
                      borderRadius="full"
                      fontWeight="500"
                      transition="all 0.4s ease"
                      _hover={{
                        bg: isDarkMode ? "rgba(99, 102, 241, 0.25)" : "rgba(139, 105, 20, 0.2)",
                        borderColor: isDarkMode ? "#6366f1" : "#8b6914",
                        boxShadow: isDarkMode
                          ? "0 0 15px rgba(99, 102, 241, 0.3)"
                          : "0 0 15px rgba(139, 105, 20, 0.2)",
                      }}
                    >
                      {tag}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>

              <HStack spacing={3} flexWrap="wrap">
                {pub.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.url}
                    isExternal
                    color={isDarkMode ? "#8b8b9a" : "#5c574e"}
                    fontWeight="500"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    fontSize="sm"
                    padding="8px 14px"
                    borderRadius="lg"
                    border={`1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(139, 90, 43, 0.12)"}`}
                    bg={isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.5)"}
                    _hover={{
                      textDecoration: "none",
                      color: isDarkMode ? "#f0f0f5" : "#2d2a26",
                      borderColor: isDarkMode ? "rgba(99, 102, 241, 0.4)" : "rgba(139, 105, 20, 0.4)",
                      bg: isDarkMode ? "rgba(99, 102, 241, 0.1)" : "rgba(139, 105, 20, 0.1)",
                      boxShadow: isDarkMode
                        ? "0 0 15px rgba(99, 102, 241, 0.2)"
                        : "0 0 15px rgba(139, 105, 20, 0.15)",
                    }}
                    transition="all 0.4s ease"
                  >
                    <FontAwesomeIcon icon={linkIcons[link.type] || linkIcons.default} />
                    {link.label}
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
                  </Link>
                ))}
              </HStack>
            </Box>
          </MotionBox>
        ))}
      </VStack>

      {publications.length > 6 && (
        <Button
          alignSelf="center"
          variant="ghost"
          size="sm"
          color={isDarkMode ? "#8b8b9a" : "#5c574e"}
          rightIcon={<FontAwesomeIcon icon={showAll ? faChevronUp : faChevronDown} />}
          onClick={() => setShowAll((prev) => !prev)}
          _hover={{
            color: isDarkMode ? "#f0f0f5" : "#2d2a26",
            bg: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(139, 90, 43, 0.08)",
          }}
        >
          {showAll ? "Show less" : "Show more"}
        </Button>
      )}
    </FullScreenSection>
  );
};

export default ResearchSection;
