import React from "react";
import {
  Box,
  Heading,
  HStack,
  Link,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const projects = [
  {
    title: "NeuroCommute Agent",
    description:
      "Agentic AI route planner using OpenAI & Qwen LLMs to critique A* pathfinding, optimizing for complex user constraints.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    url: "https://github.com/chenj926/NeuroCommute",
  },
  {
    title: "ADHD Scholarship Copilot",
    description:
      "RAG-powered Chrome extension decomposing applications into micro-tasks using Claude AI and ChromaDB context retention.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    url: "https://github.com/chenj926/adhd-scholarship-copilot",
  },
  {
    title: "Personal WealthTracker",
    description:
      "Full-stack financial system (Spring Boot + React) with joint account logic, clean architecture, and 93% JUnit test coverage.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    url: "https://github.com/chenj926/Accounting_System",
  },
  {
    title: "Multimodal Risk Predictor",
    description:
      "Insurance risk ensemble merging tabular data with PDF/Image embeddings (CLIP & MiniLM) to achieve top 1% model performance.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    url: "#", // Add repo link if available
  },
  {
    title: "SketchToFace GAN",
    description:
      "Generative Adversarial Network with U-Net architecture converting sketches to realistic faces for forensic investigations.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    url: "https://github.com/chenj926/Line2Live",
  },
  {
    title: "P&G Business Strategy",
    description:
      "1st Place Winner: AI-driven market expansion strategy optimizing a $78M budget using demographic segmentation.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    url: "https://www.canva.com/design/DAG03M90MS0/jjAx7TqXPSb97h2F3ZTiqQ/edit",
  },
];

const ProjectsSection = () => {
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
        {projects.map((project) => (
          <Box
            key={project.title}
            backgroundColor="#ffffff"
            borderRadius="22px"
            overflow="hidden"
            boxShadow="0 18px 28px rgba(61, 59, 54, 0.08)"
            flex="1"
            minW={{ base: "100%", md: "280px" }}
            maxW={{ base: "100%", md: "360px" }}
          >
            <Image src={project.image} alt={project.title} height="180px" width="100%" objectFit="cover" />
            <Box p={6}>
              <Heading size="sm" mb={2}>
                {project.title}
              </Heading>
              <Text fontSize="sm" color="#5d564d" mb={4}>
                {project.description}
              </Text>
              <Link href={project.url} isExternal color="#b25e4d" fontWeight="600">
                View project →
              </Link>
            </Box>
          </Box>
        ))}
      </HStack>
    </FullScreenSection>
  );
};

export default ProjectsSection;
