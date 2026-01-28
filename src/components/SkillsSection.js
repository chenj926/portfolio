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
import { motion } from "framer-motion";
import FullScreenSection from "./FullScreenSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faChartLine,
  faCodeBranch,
  faDatabase,
  faGears,
  faLightbulb,
  faUsers,
  faRocket,
  faComments,
  faHandshake,
  faPuzzlePiece,
  faCrown,
  faNetworkWired,
  faFlask,
  faMicrochip,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import { faReact, faNodeJs, faPython, faJava, faJs, faLinux } from "@fortawesome/free-brands-svg-icons";
import { useTheme } from "../context/themeContext";

const MotionBox = motion(Box);

const skills = [
  {
    category: "Software Engineering",
    description: "Full-stack development, scalable systems, and clean architecture.",
    items: [
      { label: "Python", icon: faPython },
      { label: "JavaScript/TypeScript", icon: faJs },
      { label: "Java", icon: faJava },
      { label: "C/C#", icon: faGears },
      { label: "React", icon: faReact },
      { label: "Node.js", icon: faNodeJs },
      { label: "Spring Boot", icon: faServer },
      { label: "PostgreSQL", icon: faDatabase },
      { label: "Git", icon: faCodeBranch },
      { label: "Linux/Shell", icon: faLinux },
      { label: "Flask", icon: faFlask },
      { label: "OOP/Clean Architecture", icon: faPuzzlePiece },
    ],
  },
  {
    category: "Machine Learning",
    description: "Deep learning, NLP, and production ML pipelines.",
    items: [
      { label: "PyTorch", icon: faBrain },
      { label: "Transformers/LLMs", icon: faMicrochip },
      { label: "RAG Pipelines", icon: faNetworkWired },
      { label: "Agent Architectures", icon: faRocket },
      { label: "Vector DBs (Milvus, ChromaDB)", icon: faDatabase },
      { label: "OpenAI/Claude APIs", icon: faComments },
      { label: "Prompt Engineering", icon: faLightbulb },
      { label: "Bayesian Optimization", icon: faChartLine },
      { label: "Scikit-learn", icon: faGears },
      { label: "CUDA", icon: faMicrochip },
      { label: "Predictive Modeling", icon: faChartLine },
      { label: "LangChain", icon: faNetworkWired },
    ],
  },
  {
    category: "Product",
    description: "User research, product strategy, and cross-functional collaboration.",
    items: [
      { label: "Agile/Scrum", icon: faRocket },
      { label: "Jira", icon: faPuzzlePiece },
      { label: "User Research", icon: faUsers },
      { label: "A/B Testing", icon: faFlask },
      { label: "Data Analysis", icon: faChartLine },
      { label: "Stakeholder Communication", icon: faComments },
      { label: "Product Strategy", icon: faLightbulb },
      { label: "Market Analysis", icon: faChartLine },
    ],
  },
  {
    category: "Characteristics",
    description: "Soft skills that drive collaboration and innovation.",
    items: [
      { label: "Problem-Solving", icon: faPuzzlePiece },
      { label: "Communication", icon: faComments },
      { label: "Collaboration", icon: faHandshake },
      { label: "Leadership", icon: faCrown },
      { label: "Teamwork", icon: faUsers },
      { label: "Adaptability", icon: faGears },
      { label: "Critical Thinking", icon: faLightbulb },
      { label: "Initiative", icon: faRocket },
    ],
  },
];

const SkillsSection = () => {
  const { isDarkMode } = useTheme();

  return (
    <FullScreenSection
      id="skills-section"
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
          Expertise
        </Text>
        <Heading size="lg" color={isDarkMode ? "#f0f0f5" : "#2d2a26"}>
          Skills
        </Heading>
        <Text maxW="640px" color={isDarkMode ? "#8b8b9a" : "#5c574e"}>
          A comprehensive snapshot of technical abilities and personal strengths.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {skills.map((skillGroup, index) => (
          <MotionBox
            key={skillGroup.category}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Box
              className="glass-card card-shine"
              padding={6}
              height="100%"
              display="flex"
              flexDirection="column"
              gap={4}
            >
              <Box>
                <Heading size="sm" color={isDarkMode ? "#f0f0f5" : "#2d2a26"} fontWeight="600">
                  {skillGroup.category}
                </Heading>
                <Text fontSize="sm" color={isDarkMode ? "#8b8b9a" : "#5c574e"} mt={2} lineHeight="1.7">
                  {skillGroup.description}
                </Text>
              </Box>

              <Wrap spacing={2}>
                {skillGroup.items.map((skill) => (
                  <WrapItem key={skill.label}>
                    <HStack
                      className="skill-tag"
                      spacing={2}
                      padding="8px 12px"
                      borderRadius="lg"
                      bg={isDarkMode ? "rgba(99, 102, 241, 0.1)" : "rgba(139, 105, 20, 0.08)"}
                      border={`1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(139, 105, 20, 0.15)"}`}
                      fontSize="sm"
                      fontWeight="500"
                      color={isDarkMode ? "#f0f0f5" : "#2d2a26"}
                      cursor="default"
                    >
                      <FontAwesomeIcon
                        icon={skill.icon}
                        style={{ color: isDarkMode ? "#6366f1" : "#8b6914" }}
                      />
                      <Text>{skill.label}</Text>
                    </HStack>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </FullScreenSection>
  );
};

export default SkillsSection;
