import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading, Button } from "@chakra-ui/react";
// import Card from "./Card";
// import { useState } from "react";
// import { useEffect } from "react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Carousel from "./Carousel";


const projects = [
  {
    title: "Personal ExpenseTracker",
    description:
      "full-stack web application to help users track their expenses and income, and provide insights on their spending habits",
    // getImageSrc: () => require("../images/photo1.jpg"),
    url: "https://github.com/chenj926/Accounting_System",
  },
  {
    title: "Porfolio Website",
    description:
      "A personal website to showcase my projects, skills, and experiences to potential employers and collaborators",
    // getImageSrc: () => require("../images/photo2.jpg"),
    url: "https://github.com/chenj926/portfolio",
  },
  {
    title: "WeedOut Website",
    description:
      "todo",
    // getImageSrc: () => require("../images/photo3.jpg"),
    url: "https://github.com/uoftweb-admin/weedout-project",
  },
  {
    title: "sketchToFace",
    description:
      "todo",
    // getImageSrc: () => require("../images/photo4.jpg"),
    url: "https://github.com/chenj926/Line2Live",
  },
];

const hobbies = [
  {
    title: "Tenis",
    description: "Play tennis since I was 12 years old. I love the sport.",
    url: "https://example.com/tennis",
  },
  {
    title: "Soccer",
    description: "Huge soccer fan. I love watching and playing soccer.",
    url: "https://example.com/soccer",
  },
  {
    title: "Art",
    description: "Art is a great way to express myself and relax.",
    url: "https://example.com/art",
  },
];

const ProjectsSection = () => {

  return (
    <FullScreenSection
      backgroundColor="#DBD8CF"
      isDarkBackground
      p={8}
      // alignItems="flex-start"
      alignItems="center" // Centers the entire section horizontally
      justifyContent="center" // Centers the entire section vertically
      spacing={8}
    >
      {/* --- Top Section: My Projects --- */}
      <Box width="100%" textAlign="center" >
        <Heading as="h1" mb={6} color="#303030">
          My Projects
        </Heading>
        <Carousel items={projects}/>
      </Box>

      {/* --- Bottom Section: My Hobbies --- */}
      <Box mb={16} width="100%" textAlign="center">
        <Heading as="h1" mb={6} color="#303030">
          My Hobbies
        </Heading>
        <Carousel items={hobbies} />
      </Box>

      
      
    </FullScreenSection>
  );
};

export default ProjectsSection;
