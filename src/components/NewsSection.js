import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import FullScreenSection from "./FullScreenSection";

const news = [
  {
    title: "Joined Efficient AI & Transformer Research Group",
    source: "SJTU",
    date: "Jan 2026",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
  {
    title: "Recieved 2nd place in Commerce Domain and 4th overall at AgentDs",
    source: "AgentDs Hackathon",
    date: "Dec 2025",
    url: "https://agentds.org/",
  },
  {
    title: "Participated in Claude AI Hackathon and Built ADHD Copliot App",
    source: "UofT AI x Claude AI",
    date: "Nov 2025",
    url: "https://github.com/chenj926/adhd-scholarship-copilot",
  },
  {
    title: "1st Place: P&G Engineering Business Case Competition",
    source: "P&G",
    date: "Oct 2025",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
  {
    title: "Joined JANA Corp as Software Engineer Intern",
    source: "JANA Corporation",
    date: "May 2025",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
  {
    title: "Joined JB Research Group for Trustworthy AI Research",
    source: "UofT",
    date: "Jan 2025",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
];

const NewsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleNews = useMemo(
    () => (showAll ? news : news.slice(0, 5)),
    [showAll]
  );

  return (
    <FullScreenSection
      id="news-section"
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
          Updates
        </Text>
        <Heading size="lg" color="var(--text-primary)">
          Latest News
        </Heading>
        <Text maxW="640px" color="var(--text-secondary)">
          Highlights from recent work, reviews, and updates.
        </Text>
      </VStack>

      <VStack align="stretch" spacing={3}>
        {visibleNews.map((item) => (
          <Box key={item.title}>
            <Box
              className="glass-card"
              padding={{ base: 4, md: 5 }}
            >
              <HStack
                spacing={{ base: 3, md: 6 }}
                align={{ base: "flex-start", md: "center" }}
                flexDirection={{ base: "column", md: "row" }}
              >
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                  color="var(--text-muted)"
                  minW={{ md: "100px" }}
                  fontFamily="mono"
                >
                  {item.date}
                </Text>
                <Box flex="1">
                  <Heading size="sm" color="var(--text-primary)" fontWeight="500">
                    {item.title}
                  </Heading>
                  <Text fontSize="sm" color="var(--text-secondary)" mt={1}>
                    {item.source}
                  </Text>
                </Box>
                <Link
                  href={item.url}
                  isExternal
                  color="var(--accent-primary)"
                  fontWeight="500"
                  fontSize="sm"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  _hover={{ color: "var(--accent-secondary)", textDecoration: "none" }}
                >
                  View
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </Link>
              </HStack>
            </Box>
          </Box>
        ))}
      </VStack>

      {news.length > 5 && (
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
          {showAll ? "Show less" : "Show all"}
        </Button>
      )}
    </FullScreenSection>
  );
};

export default NewsSection;
