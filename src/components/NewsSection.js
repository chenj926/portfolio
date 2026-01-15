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
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 16 }}
      alignItems="stretch"
      spacing={8}
    >
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Latest News</Heading>
        <Text maxW="640px" color="#5d564d">
          Highlights from recent work, reviews, and social updates.
        </Text>
      </VStack>
      <VStack align="stretch" spacing={4}>
        {visibleNews.map((item) => (
          <Box
            key={item.title}
            backgroundColor="#ffffff"
            borderRadius="18px"
            padding={{ base: 4, md: 5 }}
            boxShadow="0 12px 18px rgba(61, 59, 54, 0.08)"
          >
            <HStack
              spacing={{ base: 3, md: 6 }}
              align={{ base: "flex-start", md: "center" }}
              flexDirection={{ base: "column", md: "row" }}
            >
              <Text
                fontSize="xs"
                textTransform="uppercase"
                color="#7b736a"
                minW={{ md: "140px" }}
              >
                {item.date}
              </Text>
              <Box flex="1">
                <Heading size="sm">{item.title}</Heading>
                <Text fontSize="sm" color="#6f675d">
                  {item.source}
                </Text>
              </Box>
              <Link href={item.url} isExternal color="#b25e4d" fontWeight="600">
                Read update →
              </Link>
            </HStack>
          </Box>
        ))}
        {news.length > 5 && (
          <Button
            alignSelf="center"
            variant="outline"
            borderColor="#3d3b36"
            size="sm"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show less" : "Show all"}
          </Button>
        )}
      </VStack>
    </FullScreenSection>
  );
};

export default NewsSection;
