import React from "react";
import {
  Box,
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
  return (
    <FullScreenSection
      id="news-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 16 }}
      alignItems="stretch"
      spacing={8}
    >
      {/* lastest news 一条条的 */}
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Latest News</Heading>
        <Text maxW="640px" color="#5d564d">
          Highlights from recent work, reviews, and social updates.
        </Text>
      </VStack>
      <HStack spacing={6} flexWrap="wrap" align="stretch">
        {news.map((item) => (
          <Box
            key={item.title}
            backgroundColor="#ffffff"
            borderRadius="20px"
            padding={6}
            flex="1"
            minW={{ base: "100%", md: "260px" }}
            boxShadow="0 18px 26px rgba(61, 59, 54, 0.08)"
          >
            <Text fontSize="xs" textTransform="uppercase" color="#7b736a">
              {item.source} · {item.date}
            </Text>
            <Heading size="sm" mt={2} mb={3}>
              {item.title}
            </Heading>
            <Link href={item.url} isExternal color="#b25e4d" fontWeight="600">
              Read update →
            </Link>
          </Box>
        ))}
      </HStack>
    </FullScreenSection>
  );
};

export default NewsSection;
