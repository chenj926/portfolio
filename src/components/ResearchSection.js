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
import FullScreenSection from "./FullScreenSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faGlobe,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

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
  // {
  //   title: "Uncertainty-Aware Bayesian Optimization for Trustworthy AI Systems",
  //   venue: "Under Review",
  //   year: "2025",
  //   description:
  //     "Explores calibrated Bayesian optimization loops for risk-sensitive decision making.",
  //   tags: ["Bayesian Opt", "Trustworthy AI"],
  //   links: [
  //     { label: "Paper", url: "https://arxiv.org/", type: "paper" },
  //     { label: "GitHub", url: "https://github.com/chenj926", type: "github" },
  //   ],
  // },
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
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 18 }}
      alignItems="stretch"
      spacing={8}
    >
      {/* 同project */}
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Publications</Heading>
        <Text maxW="640px" color="#5d564d">
          Selected papers, open review submissions, and research prototypes.
        </Text>
      </VStack>
      <VStack spacing={6} align="stretch">
        {visiblePublications.map((pub) => (
          <Box
            key={pub.title}
            backgroundColor="#ffffff"
            borderRadius="22px"
            padding={{ base: 6, md: 7 }}
            boxShadow="0 18px 28px rgba(61, 59, 54, 0.08)"
            display="flex"
            flexDirection="column"
            minH="240px"
          >
            <Text fontSize="xs" textTransform="uppercase" color="#7b736a">
              {pub.venue} · {pub.year}
            </Text>
            <Heading size="sm" mt={2} mb={3}>
              {pub.title}
            </Heading>
            <Text fontSize="sm" color="#5d564d" mb={4} flex="1">
              {pub.description}
            </Text>
            <Wrap spacing={2} mb={4}>
              {pub.tags.map((tag) => (
                <WrapItem key={tag}>
                  <Tag size="sm" variant="subtle" colorScheme="orange">
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
                  color="#3d3b36"
                  fontWeight="600"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  fontSize="sm"
                  padding="6px 12px"
                  borderRadius="full"
                  border="1px solid #d7cdbf"
                  _hover={{ textDecoration: "none", backgroundColor: "#f3ece2" }}
                >
                  <FontAwesomeIcon icon={linkIcons[link.type] || linkIcons.default} />
                  {link.label}
                </Link>
              ))}
            </HStack>
          </Box>
        ))}
      </VStack>
      {publications.length > 6 && (
        <Button
          alignSelf="center"
          variant="outline"
          borderColor="#3d3b36"
          size="sm"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show less" : "Show more"}
        </Button>
      )}
    </FullScreenSection>
  );
};

export default ResearchSection;
