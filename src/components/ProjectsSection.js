import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Image,
  Text,
  VStack,
  Tag,
  Wrap,
  WrapItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import FullScreenSection from "./FullScreenSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faGlobe,
  faLink,
  faChevronDown,
  faChevronUp,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useTheme } from "../context/themeContext";

const MotionBox = motion(Box);

const linkIcons = {
  github: faGithub,
  linkedin: faLinkedin,
  paper: faFileLines,
  website: faGlobe,
  default: faLink,
};

const projects = [
  {
    title: "NeuroCommute Agent",
    description:
      "Agentic AI route planner using OpenAI & Qwen LLMs to critique A* pathfinding, optimizing for complex user constraints.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    tags: ["Agentic AI", "Routing", "LLM"],
    links: [
      { label: "GitHub", url: "https://github.com/chenj926/NeuroCommute", type: "github" },
    ],
  },
  {
    title: "ADHD Scholarship Copilot",
    description:
      "RAG-powered Chrome extension decomposing applications into micro-tasks using Claude AI and ChromaDB context retention.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    tags: ["RAG", "Chrome", "Education"],
    links: [
      { label: "GitHub", url: "https://github.com/chenj926/adhd-scholarship-copilot", type: "github" },
    ],
  },
  {
    title: "Personal WealthTracker",
    description:
      "Full-stack financial system (Spring Boot + React) with joint account logic, clean architecture, and 93% JUnit test coverage.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    tags: ["FinTech", "Spring Boot", "React"],
    links: [
      { label: "GitHub", url: "https://github.com/chenj926/Accounting_System", type: "github" },
    ],
  },
  {
    title: "Multimodal Risk Predictor",
    description:
      "Insurance risk ensemble merging tabular data with PDF/Image embeddings (CLIP & MiniLM) to achieve top 1% model performance.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    tags: ["Multimodal", "Insurance", "Embeddings"],
    links: [],
  },
  {
    title: "SketchToFace GAN",
    description:
      "Generative Adversarial Network with U-Net architecture converting sketches to realistic faces for forensic investigations.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    tags: ["GAN", "Computer Vision", "Forensics"],
    links: [
      { label: "GitHub", url: "https://github.com/chenj926/Line2Live", type: "github" },
    ],
  },
  {
    title: "P&G Business Strategy",
    description:
      "1st Place Winner: AI-driven market expansion strategy optimizing a $78M budget using demographic segmentation.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    tags: ["Strategy", "Analytics", "Case Comp"],
    links: [
      { label: "Website", url: "https://www.canva.com/design/DAG03M90MS0/jjAx7TqXPSb97h2F3ZTiqQ/edit", type: "website" },
    ],
  },
];

const ProjectsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const { isDarkMode } = useTheme();
  const visibleProjects = useMemo(
    () => (showAll ? projects : projects.slice(0, 6)),
    [showAll]
  );

  return (
    <FullScreenSection
      id="projects-section"
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
          Portfolio
        </Text>
        <Heading size="lg" color={isDarkMode ? "#f0f0f5" : "#2d2a26"}>
          Projects & Research
        </Heading>
        <Text maxW="640px" color={isDarkMode ? "#8b8b9a" : "#5c574e"}>
          Featured builds with visuals, context, and quick links to dive deeper.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {visibleProjects.map((project, index) => (
          <MotionBox
            key={project.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
          >
            <Box
              className="glass-card card-shine"
              overflow="hidden"
              display="flex"
              flexDirection="column"
              height="100%"
              role="group"
            >
              {/* Image area */}
              <Box position="relative" overflow="hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  height="180px"
                  width="100%"
                  objectFit="cover"
                  transition="transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                  _groupHover={{ transform: "scale(1.08)" }}
                />
                <Box
                  position="absolute"
                  inset={0}
                  bg={isDarkMode
                    ? "linear-gradient(180deg, transparent 40%, rgba(10, 10, 15, 0.95) 100%)"
                    : "linear-gradient(180deg, transparent 40%, rgba(250, 248, 245, 0.95) 100%)"
                  }
                />
              </Box>

              {/* Content area with frosted glass effect */}
              <Box
                className="project-content-frosted"
                p={5}
                display="flex"
                flexDirection="column"
                flex="1"
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: isDarkMode
                    ? "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(139, 105, 20, 0.2), transparent)",
                }}
              >
                <Heading size="sm" mb={2} color={isDarkMode ? "#f0f0f5" : "#2d2a26"} fontWeight="600">
                  {project.title}
                </Heading>
                <Text fontSize="sm" color={isDarkMode ? "#8b8b9a" : "#5c574e"} mb={4} flex="1" lineHeight="1.7">
                  {project.description}
                </Text>

                <Wrap spacing={2} mb={4}>
                  {project.tags.map((tag) => (
                    <WrapItem key={tag}>
                      <Tag
                        size="sm"
                        bg={isDarkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(139, 105, 20, 0.1)"}
                        color={isDarkMode ? "#6366f1" : "#8b6914"}
                        border={`1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(139, 105, 20, 0.2)"}`}
                        borderRadius="full"
                        fontWeight="500"
                        transition="all 0.4s ease"
                        _hover={{
                          bg: isDarkMode ? "rgba(99, 102, 241, 0.25)" : "rgba(139, 105, 20, 0.2)",
                          borderColor: isDarkMode ? "#6366f1" : "#8b6914",
                          boxShadow: isDarkMode
                            ? "0 0 15px rgba(99, 102, 241, 0.3)"
                            : "0 0 15px rgba(139, 105, 20, 0.2)",
                        }}
                      >
                        {tag}
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>

                <HStack spacing={3} flexWrap="wrap">
                  {project.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.url}
                      isExternal
                      color={isDarkMode ? "#8b8b9a" : "#5c574e"}
                      fontWeight="500"
                      display="inline-flex"
                      alignItems="center"
                      gap={2}
                      fontSize="sm"
                      padding="8px 14px"
                      borderRadius="lg"
                      border={`1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(139, 90, 43, 0.12)"}`}
                      bg={isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.5)"}
                      _hover={{
                        textDecoration: "none",
                        color: isDarkMode ? "#f0f0f5" : "#2d2a26",
                        borderColor: isDarkMode ? "rgba(99, 102, 241, 0.4)" : "rgba(139, 105, 20, 0.4)",
                        bg: isDarkMode ? "rgba(99, 102, 241, 0.1)" : "rgba(139, 105, 20, 0.1)",
                        boxShadow: isDarkMode
                          ? "0 0 15px rgba(99, 102, 241, 0.2)"
                          : "0 0 15px rgba(139, 105, 20, 0.15)",
                      }}
                      transition="all 0.4s ease"
                    >
                      <FontAwesomeIcon icon={linkIcons[link.type] || linkIcons.default} />
                      {link.label}
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
                    </Link>
                  ))}
                </HStack>
              </Box>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>

      {projects.length > 6 && (
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
          {showAll ? "Show less" : "Show more"}
        </Button>
      )}
    </FullScreenSection>
  );
};

export default ProjectsSection;
