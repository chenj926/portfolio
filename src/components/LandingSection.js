import React from "react";
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import FullScreenSection from "./FullScreenSection";
import profilePic from "../assets/images/profile pic.jpg";
import cloudLine from "../assets/decorations/cloud-line.svg";

const socials = [
  {
    icon: faEnvelope,
    label: "Email",
    url: "mailto:jialuo.chen@utoronto.ca",
  },
  {
    icon: faGithub,
    label: "GitHub",
    url: "https://github.com/chenj926",
  },
  {
    icon: faLinkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
  {
    icon: faInstagram,
    label: "Instagram",
    url: "https://www.instagram.com/ericchen7161/",
  },
];

const LandingSection = () => {
  return (
    <FullScreenSection
      id="home-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 20, md: 28 }}
      spacing={10}
      alignItems="stretch"
      position="relative"
    >
      <Image
        src={cloudLine}
        alt="Decorative clouds"
        position="absolute"
        top={{ base: 6, md: 4 }}
        right={{ base: -4, md: 8 }}
        width={{ base: "280px", md: "480px" }}
        opacity={0.6}
        pointerEvents="none"
      />
      <HStack
        spacing={{ base: 10, md: 16 }}
        align={{ base: "flex-start", md: "center" }}
        flexDirection={{ base: "column", md: "row" }}
      >
        <VStack align="flex-start" spacing={6} flex="1">
          <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.2em">
            Portfolio
          </Text>
          <Heading size={{ base: "xl", md: "2xl" }} lineHeight="1.1">
            Jialuo (Eric) Chen
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} maxW="520px">
            Industrial Engineering student focused on software engineering and machine learning.
            I love translating complex ideas into thoughtful products and elegant research
            prototypes.
          </Text>
          <Box
            borderLeft="3px solid #a59a8b"
            pl={4}
            color="#5d564d"
            maxW="520px"
          >
            <Text fontSize={{ base: "sm", md: "md" }}>
              Currently exploring applied ML, product engineering, and human-centered systems.
              Based in Toronto, open to collaborative research and product building.
            </Text>
          </Box>
          <HStack spacing={4} flexWrap="wrap">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.url}
                isExternal
                display="inline-flex"
                alignItems="center"
                gap={2}
                fontSize="sm"
                color="#3d3b36"
              >
                <FontAwesomeIcon icon={social.icon} />
                {social.label}
              </Link>
            ))}
          </HStack>
          <Button
            size="sm"
            variant="outline"
            borderColor="#3d3b36"
            onClick={() =>
              document
                .getElementById("connect-section")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            Let&apos;s connect
          </Button>
        </VStack>
        <Box
          flex="0.8"
          display="flex"
          justifyContent={{ base: "flex-start", md: "flex-end" }}
        >
          <Box
            backgroundColor="#ede6dc"
            borderRadius="32px"
            padding={{ base: 6, md: 10 }}
            boxShadow="0 24px 40px rgba(61, 59, 54, 0.1)"
          >
            <Avatar
              size="2xl"
              name="Jialuo (Eric) Chen"
              src={profilePic}
              boxSize={{ base: "180px", md: "240px" }}
            />
            <Text mt={4} fontWeight="600">
              Software & ML Engineer
            </Text>
            <Text fontSize="sm" color="#6f675d">
              Industrial Engineering · University of Toronto
            </Text>
          </Box>
        </Box>
      </HStack>
    </FullScreenSection>
  );
};

export default LandingSection;
