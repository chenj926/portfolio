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
} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faGlobe,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

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
      // { label: "Website", url: "https://github.com/chenj926/NeuroCommute", type: "website" },
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
      // { label: "LinkedIn", url: "https://www.linkedin.com/in/ericjialuochen/", type: "linkedin" },
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
    links: [
      // { label: "Paper", url: "https://arxiv.org/", type: "paper" },
    ],
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
      // { label: "Paper", url: "https://arxiv.org/", type: "paper" },
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
  const visibleProjects = useMemo(
    () => (showAll ? projects : projects.slice(0, 6)),
    [showAll]
  );

  return (
    <FullScreenSection
      id="projects-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 18 }}
      alignItems="stretch"
      spacing={8}
    >
      {/* 要点击有特效, 有show all 这个option 如果大于三个 */}
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Projects & Research</Heading>
        <Text maxW="640px" color="#5d564d">
          Featured builds with visuals, context, and a quick link to dive deeper.
        </Text>
      </VStack>
      <HStack spacing={6} flexWrap="wrap" align="stretch">
        {visibleProjects.map((project) => (
          <Box
            key={project.title}
            backgroundColor="#ffffff"
            borderRadius="22px"
            overflow="hidden"
            boxShadow="0 18px 28px rgba(61, 59, 54, 0.08)"
            flex="1"
            minW={{ base: "100%", md: "280px" }}
            maxW={{ base: "100%", md: "360px" }}
            display="flex"
            flexDirection="column"
          >
            <Image
              src={project.image}
              alt={project.title}
              height="180px"
              width="100%"
              objectFit="cover"
            />
            <Box p={6} display="flex" flexDirection="column" flex="1">
              <Heading size="sm" mb={2}>
                {project.title}
              </Heading>
              <Text fontSize="sm" color="#5d564d" mb={4} flex="1">
                {project.description}
              </Text>
              <Wrap spacing={2} mb={4}>
                {project.tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag size="sm" variant="subtle" colorScheme="orange">
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
                    color="#3d3b36"
                    fontWeight="600"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    fontSize="sm"
                    padding="6px 12px"
                    borderRadius="full"
                    border="1px solid #d7cdbf"
                    _hover={{ textDecoration: "none", backgroundColor: "#f3ece2" }}
                  >
                    <FontAwesomeIcon icon={linkIcons[link.type] || linkIcons.default} />
                    {link.label}
                  </Link>
                ))}
              </HStack>
            </Box>
          </Box>
        ))}
      </HStack>
      {projects.length > 6 && (
        <Button
          alignSelf="center"
          variant="outline"
          borderColor="#3d3b36"
          size="sm"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show less" : "Show more"}
        </Button>
      )}
    </FullScreenSection>
  );
};

export default ProjectsSection;
