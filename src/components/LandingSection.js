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
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import FullScreenSection from "./FullScreenSection";
import profilePic from "../assets/images/profile pic.jpg";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const LandingSection = () => {
  return (
    <FullScreenSection
      id="home-section"
      backgroundColor="#0a0a0f"
      px={{ base: 6, md: 12 }}
      py={{ base: 24, md: 32 }}
      spacing={10}
      alignItems="stretch"
      position="relative"
      overflow="hidden"
    >
      {/* Background Grid */}
      <Box className="grid-bg" />

      {/* Glow Effects */}
      <Box
        className="glow-accent"
        top="-200px"
        right="-100px"
      />
      <Box
        className="glow-secondary"
        bottom="-100px"
        left="-50px"
      />

      <HStack
        spacing={{ base: 10, md: 16 }}
        align={{ base: "flex-start", md: "center" }}
        flexDirection={{ base: "column", md: "row" }}
        position="relative"
        zIndex={1}
      >
        <MotionVStack
          align="flex-start"
          spacing={6}
          flex="1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionText
            variants={itemVariants}
            fontSize="sm"
            textTransform="uppercase"
            letterSpacing="0.3em"
            color="#6366f1"
            fontWeight="600"
          >
            AI Researcher & Engineer
          </MotionText>

          <MotionHeading
            variants={itemVariants}
            size={{ base: "xl", md: "2xl" }}
            lineHeight="1.1"
            color="#f0f0f5"
          >
            Jialuo (Eric) Chen{" "}
            <Text as="span" color="#8b8b9a" fontWeight="400">
              陈佳洛
            </Text>
          </MotionHeading>

          <MotionText
            variants={itemVariants}
            fontSize={{ base: "md", md: "lg" }}
            maxW="540px"
            color="#8b8b9a"
            lineHeight="1.7"
          >
            Industrial Engineering student with a dual focus on{" "}
            <Text as="span" color="#f0f0f5" fontWeight="500">
              Machine Learning
            </Text>{" "}
            and{" "}
            <Text as="span" color="#f0f0f5" fontWeight="500">
              Software Architecture
            </Text>
            . I thrive at the intersection of complex algorithms and intuitive product design.
          </MotionText>

          <MotionBox
            variants={itemVariants}
            borderLeft="2px solid"
            borderColor="#6366f1"
            pl={4}
            py={2}
            maxW="540px"
          >
            <Text fontSize={{ base: "sm", md: "md" }} color="#8b8b9a" lineHeight="1.7">
              Currently engineering risk platforms at{" "}
              <Text as="span" color="#f0f0f5" fontWeight="500">JANA Corp</Text>, researching{" "}
              <Text as="span" color="#f0f0f5" fontWeight="500">Trustworthy AI</Text> at{" "}
              <Link href="https://www.utoronto.ca/" isExternal color="#6366f1" _hover={{ color: "#8b5cf6" }}>
                UofT
              </Link>{" "}
              and{" "}
              <Text as="span" color="#f0f0f5" fontWeight="500">Efficient AI</Text> at{" "}
              <Link href="https://www.sjtu.edu.cn/" isExternal color="#6366f1" _hover={{ color: "#8b5cf6" }}>
                SJTU
              </Link>
              . Open to{" "}
              <Text as="span" color="#f0f0f5" fontWeight="500">AI Engineering</Text> or{" "}
              <Text as="span" color="#f0f0f5" fontWeight="500">Applied Research</Text> roles.
            </Text>
          </MotionBox>

          <MotionBox variants={itemVariants}>
            <HStack spacing={4} flexWrap="wrap">
              {socials.map((social, index) => (
                <Link
                  key={social.label}
                  href={social.url}
                  isExternal
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  fontSize="sm"
                  color="#8b8b9a"
                  px={3}
                  py={2}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.08)"
                  bg="rgba(255, 255, 255, 0.02)"
                  _hover={{
                    color: "#f0f0f5",
                    borderColor: "rgba(99, 102, 241, 0.4)",
                    bg: "rgba(99, 102, 241, 0.1)",
                    textDecoration: "none",
                  }}
                  transition="all 0.3s ease"
                >
                  <FontAwesomeIcon icon={social.icon} />
                  {social.label}
                </Link>
              ))}
            </HStack>
          </MotionBox>

          <MotionBox variants={itemVariants}>
            <Button
              size="md"
              rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
              bg="linear-gradient(135deg, #6366f1, #8b5cf6)"
              color="white"
              fontWeight="600"
              px={6}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
              }}
              transition="all 0.3s ease"
              onClick={() =>
                document
                  .getElementById("connect-section")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              Let&apos;s connect
            </Button>
          </MotionBox>
        </MotionVStack>

        <MotionBox
          flex="0.8"
          display="flex"
          justifyContent={{ base: "center", md: "flex-end" }}
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <VStack
            className="glass-card card-shine"
            padding={{ base: 6, md: 8 }}
            align="center"
            textAlign="center"
            spacing={4}
            position="relative"
          >
            {/* Subtle glow behind avatar */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="200px"
              height="200px"
              background="radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)"
              filter="blur(30px)"
              zIndex={0}
            />
            <Avatar
              size="2xl"
              name="Jialuo (Eric) Chen"
              src={profilePic}
              boxSize={{ base: "160px", md: "200px" }}
              border="3px solid rgba(99, 102, 241, 0.3)"
              position="relative"
              zIndex={1}
            />
            <Text fontWeight="600" color="#f0f0f5" fontSize="lg">
              Software & AI/ML Engineer
            </Text>
            <Text fontSize="sm" color="#8b8b9a">
              Industrial Engineering · University of Toronto
            </Text>
            <HStack spacing={2} mt={2}>
              <Box
                w={2}
                h={2}
                borderRadius="full"
                bg="#10b981"
                className="pulse"
              />
              <Text fontSize="xs" color="#10b981">
                Open to opportunities
              </Text>
            </HStack>
          </VStack>
        </MotionBox>
      </HStack>
    </FullScreenSection>
  );
};

export default LandingSection;
