import React from "react";
import { Box, Heading, Link, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import FullScreenSection from "./FullScreenSection";

const MotionBox = motion(Box);

const channels = [
  {
    title: "小红书 (RedNote)",
    description: "Lifestyle notes, study routines, and visual storytelling.",
    url: "https://www.xiaohongshu.com/user/profile/60b414de0000000001007140",
  },
  {
    title: "Reddit",
    description: "Sharing study experiments and engaging in creator communities.",
    url: "https://www.reddit.com/user/Every-Movie7060/",
  },
];

const ContentSection = () => {
  return (
    <FullScreenSection
      id="content-section"
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
          Social
        </Text>
        <Heading size="lg" color="#f0f0f5">
          Content & Community
        </Heading>
        <Text maxW="640px" color="#8b8b9a">
          Places where I share ideas, experiments, and knowledge content.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {channels.map((channel, index) => (
          <MotionBox
            key={channel.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Box
              className="glass-card"
              padding={6}
              width="100%"
              height="100%"
            >
              <Heading size="sm" mb={2} color="#f0f0f5" fontWeight="600">
                {channel.title}
              </Heading>
              <Text fontSize="sm" color="#8b8b9a" mb={4} lineHeight="1.7">
                {channel.description}
              </Text>
              <Link
                href={channel.url}
                isExternal
                color="#6366f1"
                fontWeight="500"
                fontSize="sm"
                display="inline-flex"
                alignItems="center"
                gap={2}
                _hover={{ color: "#8b5cf6", textDecoration: "none" }}
              >
                Visit channel
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
              </Link>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </FullScreenSection>
  );
};

export default ContentSection;
