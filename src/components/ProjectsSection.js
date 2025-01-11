import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading } from "@chakra-ui/react";
// import Card from "./Card";
// import { useState } from "react";
// import { useEffect } from "react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Carousel from "./Carousel";


const projects = [
  {
    title: "Personal WealthTracker",
    description:
      "Co-led the design and development of a full-stack web application for tracking user expenses and income. Built using React.js, Spring Boot, and Clean Architecture principles, it includes features like transaction management and joint accounts, with 93% unit test coverage.",
    url: "https://github.com/chenj926/Accounting_System",
  },
  {
    title: "Portfolio Website",
    description:
      "Created a personal portfolio website using React.js and Chakra UI. Features an interactive design, animated text, and CI/CD automation for seamless updates and error checks.",
    url: "https://github.com/chenj926/portfolio",
  },
  {
    title: "WeedOut Website",
    description:
      "Contributed to the WeedOut open-source library by developing a documentation platform with React.js and Flask. Implemented responsive UI and backend logic for real-time documentation updates.",
    url: "https://github.com/uoftweb-admin/weedout-project",
  },
  {
    title: "SketchToFace",
    description:
      "Developed a GAN-based model for sketch-to-face generation, designed to assist in criminal investigations by converting hand-drawn sketches into realistic face images.",
    url: "https://github.com/chenj926/Line2Live",
  },
  {
    title: "Course Management System",
    description:
      "Designed and implemented a Java-based course management system using SQL, Hibernate, and Docker. Integrated complex SQL queries for data analysis and established seamless connectivity between the Java application and the database.",
    url: "https://github.com/chenj926/Accounting_System", // Replace with the appropriate URL if different
  },
  {
    title: "Traveling Salesman Optimization",
    description:
      "Implemented optimized greedy algorithms such as Nearest Neighbor and Node Insertion to solve the Traveling Salesman Problem efficiently. Achieved a 20% reduction in computation time for large datasets of over 1,000 nodes.",
    url: "https://github.com/chenj926/Travelling_Salesman",
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
  {
    title: "Music",
    description: "Guqin (chinese culture music instrument), Guitar",
    url: "https://example.com/art",
  },
  {
    title: "Work-out",
    description: "Hit the gym.",
    url: "https://example.com/art",
  },
  {
    title: "Video Game",
    description: "Mobile games.",
    url: "https://example.com/art",
  },
];

const ProjectsSection = () => {

  return (
    <FullScreenSection
      id="projects-section"
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
