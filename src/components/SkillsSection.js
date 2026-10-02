import React from "react";
import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Wrap,
  WrapItem,
  SimpleGrid,
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
import { faReact, faPython } from "@fortawesome/free-brands-svg-icons";

const skills = [
  {
    category: "Engineering",
    description:
      "Full-stack development, software architecture, and data systems.",
    items: [
      { label: "React · TypeScript", icon: faReact },
      { label: "Python · FastAPI", icon: faPython },
      { label: "C# · .NET", icon: faCodeBranch },
      { label: "PostgreSQL · ChromaDB", icon: faDatabase },
      { label: "Git · Linux · Docker", icon: faCodeBranch },
      { label: "Software Architecture", icon: faDiagramProject },
    ],
  },
  {
    category: "Machine Learning",
    description: "Deep learning, NLP, computer vision, and generative AI.",
    items: [
      { label: "PyTorch", icon: faBrain },
      { label: "NLP · Transformers", icon: faDiagramProject },
      { label: "Computer Vision · GANs", icon: faChartLine },
      { label: "RAG · LLM Agents", icon: faCodeBranch },
      { label: "scikit-learn · OpenCV", icon: faBrain },
      { label: "Model Evaluation", icon: faChartLine },
    ],
  },
  {
    category: "Research & Methods",
    description: "Probabilistic modeling, planning, and empirical evaluation.",
    items: [
      { label: "Bayesian Optimization", icon: faChartLine },
      { label: "Gaussian Processes", icon: faDiagramProject },
      { label: "Reinforcement Learning", icon: faBrain },
      { label: "A* Search · MCTS", icon: faCodeBranch },
      { label: "Multi-Armed Bandits", icon: faChartLine },
      { label: "Ablation Studies", icon: faDatabase },
    ],
  },
];

const SkillsSection = () => {
  return (
    <FullScreenSection
      id="skills-section"
      backgroundColor="var(--bg-primary)"
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
          color="var(--accent-primary)"
          fontWeight="600"
        >
          Expertise
        </Text>
        <Heading size="lg" color="var(--text-primary)">
          Skills
        </Heading>
        <Text maxW="640px" color="var(--text-secondary)">
          Tools and methods drawn from my research and software engineering
          work.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {skills.map((skillGroup) => (
          <Box key={skillGroup.category}>
            <Box
              className="glass-card"
              padding={6}
              height="100%"
              display="flex"
              flexDirection="column"
              gap={4}
            >
              <Box>
                <Heading size="sm" color="var(--text-primary)" fontWeight="600">
                  {skillGroup.category}
                </Heading>
                <Text
                  fontSize="sm"
                  color="var(--text-secondary)"
                  mt={2}
                  lineHeight="1.7"
                >
                  {skillGroup.description}
                </Text>
              </Box>

              <Wrap spacing={2}>
                {skillGroup.items.map((skill) => (
                  <WrapItem key={skill.label}>
                    <HStack
                      className="skill-tag"
                      spacing={2}
                      padding="8px 14px"
                      borderRadius="lg"
                      bg="var(--accent-wash)"
                      border="1px solid var(--accent-wash)"
                      fontSize="sm"
                      fontWeight="500"
                      color="var(--text-primary)"
                      cursor="default"
                    >
                      <FontAwesomeIcon
                        icon={skill.icon}
                        style={{ color: "var(--accent-primary)" }}
                      />
                      <Text>{skill.label}</Text>
                    </HStack>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </FullScreenSection>
  );
};

export default SkillsSection;
