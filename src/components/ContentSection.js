import React from "react";
import { Box, Heading, Link, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const channels = [
  {
    title: "小红书",
    description: "Lifestyle notes, study routines, and visual storytelling.",
    url: "https://www.xiaohongshu.com/",
  },
  {
    title: "Reddit",
    description: "Sharing ML experiments and engaging in creator communities.",
    url: "https://www.reddit.com/",
  },
  {
    title: "YouTube / Bilibili",
    description: "Future paid content on product strategy and applied ML.",
    url: "https://www.youtube.com/",
  },
  {
    title: "TikTok (future)",
    description: "Short-form insights on research and career planning.",
    url: "https://www.tiktok.com/",
  },
];

const ContentSection = () => {
  return (
    <FullScreenSection
      id="content-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 18 }}
      alignItems="stretch"
      spacing={8}
    >
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Content & Community</Heading>
        <Text maxW="640px" color="#5d564d">
          Places where I share ideas, experiments, and future paid knowledge content.
        </Text>
      </VStack>
      <Wrap spacing={6} align="stretch">
        {channels.map((channel) => (
          <WrapItem key={channel.title} flex="1" minW={{ base: "100%", md: "240px" }}>
            <Box
              backgroundColor="#ffffff"
              borderRadius="20px"
              padding={6}
              boxShadow="0 16px 24px rgba(61, 59, 54, 0.08)"
              width="100%"
            >
              <Heading size="sm" mb={2}>
                {channel.title}
              </Heading>
              <Text fontSize="sm" color="#5d564d" mb={3}>
                {channel.description}
              </Text>
              <Link href={channel.url} isExternal color="#b25e4d" fontWeight="600">
                Visit channel →
              </Link>
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </FullScreenSection>
  );
};

export default ContentSection;
