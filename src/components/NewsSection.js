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
    title: "Exploring humane AI products for student creators",
    source: "LinkedIn",
    date: "Feb 2025",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
  {
    title: "OpenReview acceptance: Sketch-to-face diffusion study",
    source: "OpenReview",
    date: "Jan 2025",
    url: "https://openreview.net/",
  },
  {
    title: "New ML workflow wins internal demo day",
    source: "Instagram",
    date: "Dec 2024",
    url: "https://www.instagram.com/ericchen7161/",
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
