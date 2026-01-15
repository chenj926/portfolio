import React from "react";
import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faChartLine,
  faCodeBranch,
  faDatabase,
  faDiagramProject,
} from "@fortawesome/free-solid-svg-icons";
import { faReact, faNodeJs, faPython } from "@fortawesome/free-brands-svg-icons";

const skills = [
  {
    category: "Engineering",
    description: "Production-grade apps, scalable services, and UI foundations.",
    items: [
      { label: "React", icon: faReact },
      { label: "Node.js", icon: faNodeJs },
      { label: "Data Systems", icon: faDatabase },
      { label: "Version Control", icon: faCodeBranch },
    ],
  },
  {
    category: "Machine Learning",
    description: "Model training, evaluation, and robust deployment workflows.",
    items: [
      { label: "Python", icon: faPython },
      { label: "Applied ML", icon: faBrain },
      { label: "Model Ops", icon: faDiagramProject },
      { label: "Analytics", icon: faChartLine },
    ],
  },
  {
    category: "Product",
    description: "User research, product strategy, and growth experimentation.",
    items: [
      { label: "Design Systems", icon: faDiagramProject },
      { label: "Research", icon: faBrain },
      { label: "Experiments", icon: faChartLine },
      { label: "Stakeholder Comms", icon: faCodeBranch },
    ],
  },
];

const SkillsSection = () => {
  return (
    <FullScreenSection
      id="skills-section"
      backgroundColor="#f5f1e8"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 18 }}
      alignItems="stretch"
      spacing={8}
    >
      {/* 同2. */}
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Skills</Heading>
        <Text maxW="640px" color="#5d564d">
          A snapshot of the tools and focus areas I enjoy using most.
        </Text>
      </VStack>
      <HStack spacing={6} align="stretch" flexWrap="wrap">
        {skills.map((skillGroup) => (
          <Box
            key={skillGroup.category}
            backgroundColor="#ffffff"
            borderRadius="22px"
            padding={6}
            boxShadow="0 16px 24px rgba(61, 59, 54, 0.08)"
            flex="1"
            minW={{ base: "100%", md: "260px" }}
            display="flex"
            flexDirection="column"
            gap={4}
          >
            <Box>
              <Heading size="sm">{skillGroup.category}</Heading>
              <Text fontSize="sm" color="#5d564d" mt={2}>
                {skillGroup.description}
              </Text>
            </Box>
            <Wrap spacing={3}>
              {skillGroup.items.map((skill) => (
                <WrapItem key={skill.label}>
                  <HStack
                    spacing={2}
                    padding="6px 12px"
                    borderRadius="full"
                    backgroundColor="#f3ece2"
                    fontSize="sm"
                    fontWeight="600"
                    color="#3d3b36"
                  >
                    <FontAwesomeIcon icon={skill.icon} />
                    <Text>{skill.label}</Text>
                  </HStack>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        ))}
      </HStack>
    </FullScreenSection>
  );
};

export default SkillsSection;
