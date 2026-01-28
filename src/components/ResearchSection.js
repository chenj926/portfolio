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
  const visiblePublications = useMemo(
    () => (showAll ? publications : publications.slice(0, 6)),
    [showAll]
  );

  return (
    <FullScreenSection
      id="research-section"
      backgroundColor="#0a0a0f"
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
          color="#6366f1"
          fontWeight="600"
        >
          Research
        </Text>
        <Heading size="lg" color="#f0f0f5">
          Publications
        </Heading>
        <Text maxW="640px" color="#8b8b9a">
          Selected papers, open review submissions, and research prototypes.
        </Text>
      </VStack>

      <VStack spacing={6} align="stretch">
        {visiblePublications.map((pub, index) => (
          <MotionBox
            key={pub.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
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
                color="#6366f1"
                fontFamily="mono"
              >
                {pub.venue} · {pub.year}
              </Text>
              <Heading size="sm" mt={3} mb={3} color="#f0f0f5" fontWeight="600">
                {pub.title}
              </Heading>
              <Text fontSize="sm" color="#8b8b9a" mb={4} lineHeight="1.7">
                {pub.description}
              </Text>

              <Wrap spacing={2} mb={4}>
                {pub.tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag
                      size="sm"
                      bg="rgba(99, 102, 241, 0.15)"
                      color="#6366f1"
                      border="1px solid rgba(99, 102, 241, 0.3)"
                      borderRadius="full"
                      fontWeight="500"
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
                    color="#8b8b9a"
                    fontWeight="500"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    fontSize="sm"
                    padding="8px 14px"
                    borderRadius="lg"
                    border="1px solid rgba(255, 255, 255, 0.08)"
                    bg="rgba(255, 255, 255, 0.02)"
                    _hover={{
                      textDecoration: "none",
                      color: "#f0f0f5",
                      borderColor: "rgba(99, 102, 241, 0.4)",
                      bg: "rgba(99, 102, 241, 0.1)",
                    }}
                    transition="all 0.3s ease"
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
          color="#8b8b9a"
          rightIcon={<FontAwesomeIcon icon={showAll ? faChevronUp : faChevronDown} />}
          onClick={() => setShowAll((prev) => !prev)}
          _hover={{
            color: "#f0f0f5",
            bg: "rgba(255, 255, 255, 0.05)",
          }}
        >
          {showAll ? "Show less" : "Show more"}
        </Button>
      )}
    </FullScreenSection>
  );
};

export default ResearchSection;
