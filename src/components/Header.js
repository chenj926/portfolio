import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,  
  faInstagram ,
  faStackOverflow,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { Box, HStack } from "@chakra-ui/react";
import Resume from "../assets/resume/Jialuo_Chen_Resume.pdf";

const socials = [
  {
    icon: faEnvelope,
    url: "mailto: jialuo.chen@utoronto.ca",
  },
  {
    icon: faGithub,
    url: "https://github.com/chenj926",
  },
  {
    icon: faLinkedin,
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
  {
    icon: faInstagram,
    url: "https://www.instagram.com/ericchen7161/",
  },
  // {
  //   icon: faStackOverflow,
  //   url: "https://stackoverflow.com",
  // },
];

const Header = () => {
  
  const handleMouseEnter = (event) => {
        event.target.style.textDecoration = "underline";
        event.target.style.cursor = "pointer"; // Set the cursor to pointer
  };
  
  const handleMouseLeave = (event) => {
    event.target.style.textDecoration = "none";
  };

  const handleClick = (anchor) => () => {
    const id = `${anchor}-section`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // const handleRsumeClick = () => {
  //   window.open("src/assets/resume/Jialuo_Chen_Resume.pdf", "_blank", "noopener noreferrer");
  // };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      translateY={0}
      transitionProperty="transform"
      transitionDuration=".3s"
      transitionTimingFunction="ease-in-out"
      backgroundColor="#303030"
      zIndex="9999"
    >
      <Box color="#DBD8CF" maxWidth="1280px" margin="0 auto">
        <HStack
          px={16}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <nav>
            <HStack spacing={4}>
            {socials.map((social, name) => (
              <a
                key={name}
                icon={social.icon}
                href={social.url}
                target="_blank" // Opens in a new tab
                rel="noopener noreferrer" // Security best practice
                color="#DBD8CF"
              >
              <FontAwesomeIcon icon={social.icon} size="2x" color="#DBD8CF" />
              </a>
            ))}
            </HStack>
          </nav>
          <nav>
            <HStack spacing={4}>
              {
              <>
                <a 
                  onMouseEnter={handleMouseEnter} 
                  onMouseLeave={handleMouseLeave} 
                  onClick={handleClick("projects")}
                >
                  Projects
                </a>
                <a 
                  onMouseEnter={handleMouseEnter} 
                  onMouseLeave={handleMouseLeave} 
                  href={Resume} // Path to your PDF
                  target="_blank" // Opens in a new tab
                  rel="noopener noreferrer" // Security best practice
                >
                  Resume
                </a>
                <a 
                  onMouseEnter={handleMouseEnter} 
                  onMouseLeave={handleMouseLeave} 
                  onClick={handleClick("contactme")}
                >
                  Contact me
                </a>
              </>
              }
            </HStack>
          </nav>
        </HStack>
      </Box>
    </Box>
  );
};
export default Header;
