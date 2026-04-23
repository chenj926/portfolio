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
    title: "(Accepted) HMITL Manager-Governed LLM Iteration with Guardrails and Rollback for Reproducible Healthcare Machine Learning Pipelines",
    venue: "IEEE ICHI 2026",
    year: "June 2026",
    description:
      "We introduce Human-Manager-in-the-Loop (HMITL), a collaboration protocol that assigns the human the role of " +
      "workflow manager. The manager maintains a task brief, enforces data-integrity guardrails, runs deterministic " +
      "evaluation, and rolls back regressions.",
    tags: ["Agent Harness", "Human-AI Collaboration"],
    links: [
      { label: "Paper", url: "https://arxiv.org/", type: "paper" },
      { label: "Github", url: "https://github.com/chenj926/ICHI_AgentDS_clai", type: "github" },
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
      backgroundColor="var(--bg-primary)"
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
          color="var(--accent-primary)"
          fontWeight="600"
        >
          Research
        </Text>
        <Heading size="lg" color="var(--text-primary)">
          Publications
        </Heading>
        <Text maxW="640px" color="var(--text-secondary)">
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
                color="var(--accent-primary)"
                fontFamily="mono"
              >
                {pub.venue} · {pub.year}
              </Text>
              <Heading size="sm" mt={3} mb={3} color="var(--text-primary)" fontWeight="600">
                {pub.title}
              </Heading>
              <Text fontSize="sm" color="var(--text-secondary)" mb={4} lineHeight="1.7">
                {pub.description}
              </Text>

              <Wrap spacing={2} mb={4}>
                {pub.tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag
                      size="sm"
                      bg="var(--accent-wash)"
                      color="var(--accent-primary)"
                      border="1px solid var(--accent-border)"
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
                    color="var(--text-secondary)"
                    fontWeight="500"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    fontSize="sm"
                    padding="8px 14px"
                    borderRadius="lg"
                    border="1px solid var(--glass-border)"
                    bg="var(--glass-bg)"
                    _hover={{
                      textDecoration: "none",
                      color: "var(--text-primary)",
                      borderColor: "var(--accent-border-strong)",
                      bg: "var(--accent-wash)",
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
          color="var(--text-secondary)"
          rightIcon={<FontAwesomeIcon icon={showAll ? faChevronUp : faChevronDown} />}
          onClick={() => setShowAll((prev) => !prev)}
          _hover={{
            color: "var(--text-primary)",
            bg: "var(--glass-hover)",
          }}
        >
          {showAll ? "Show less" : "Show more"}
        </Button>
      )}
    </FullScreenSection>
  );
};

export default ResearchSection;
