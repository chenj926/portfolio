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
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import FullScreenSection from "./FullScreenSection";
import { useTheme } from "../context/themeContext";

const MotionBox = motion(Box);

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
  const { isDarkMode } = useTheme();
  const visibleNews = useMemo(
    () => (showAll ? news : news.slice(0, 5)),
    [showAll]
  );

  return (
    <FullScreenSection
      id="news-section"
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
          Updates
        </Text>
        <Heading size="lg" color={isDarkMode ? "#f0f0f5" : "#2d2a26"}>
          Latest News
        </Heading>
        <Text maxW="640px" color={isDarkMode ? "#8b8b9a" : "#5c574e"}>
          Highlights from recent work, reviews, and updates.
        </Text>
      </VStack>

      <VStack align="stretch" spacing={3}>
        {visibleNews.map((item, index) => (
          <MotionBox
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
          >
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
                  color={isDarkMode ? "#5a5a6e" : "#8a847a"}
                  minW={{ md: "100px" }}
                  fontFamily="mono"
                >
                  {item.date}
                </Text>
                <Box flex="1">
                  <Heading size="sm" color={isDarkMode ? "#f0f0f5" : "#2d2a26"} fontWeight="500">
                    {item.title}
                  </Heading>
                  <Text fontSize="sm" color={isDarkMode ? "#8b8b9a" : "#5c574e"} mt={1}>
                    {item.source}
                  </Text>
                </Box>
                <Link
                  href={item.url}
                  isExternal
                  color={isDarkMode ? "#6366f1" : "#8b6914"}
                  fontWeight="500"
                  fontSize="sm"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  _hover={{ color: isDarkMode ? "#8b5cf6" : "#a67c00", textDecoration: "none" }}
                >
                  View
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </Link>
              </HStack>
            </Box>
          </MotionBox>
        ))}
      </VStack>

      {news.length > 5 && (
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
          {showAll ? "Show less" : "Show all"}
        </Button>
      )}
    </FullScreenSection>
  );
};

export default NewsSection;
