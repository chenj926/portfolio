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
  faDiagramProject,
} from "@fortawesome/free-solid-svg-icons";
import { faReact, faNodeJs, faPython } from "@fortawesome/free-brands-svg-icons";

const MotionBox = motion(Box);

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
          Expertise
        </Text>
        <Heading size="lg" color="#f0f0f5">
          Skills
        </Heading>
        <Text maxW="640px" color="#8b8b9a">
          A snapshot of the tools and focus areas I enjoy using most.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {skills.map((skillGroup, index) => (
          <MotionBox
            key={skillGroup.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Box
              className="glass-card"
              padding={6}
              height="100%"
              display="flex"
              flexDirection="column"
              gap={4}
            >
              <Box>
                <Heading size="sm" color="#f0f0f5" fontWeight="600">
                  {skillGroup.category}
                </Heading>
                <Text fontSize="sm" color="#8b8b9a" mt={2} lineHeight="1.7">
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
                      bg="rgba(99, 102, 241, 0.1)"
                      border="1px solid rgba(99, 102, 241, 0.2)"
                      fontSize="sm"
                      fontWeight="500"
                      color="#f0f0f5"
                      cursor="default"
                    >
                      <FontAwesomeIcon icon={skill.icon} style={{ color: "#6366f1" }} />
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
