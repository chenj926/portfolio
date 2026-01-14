import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Box, HStack, Link } from "@chakra-ui/react";
import Resume from "../assets/resume/Jialuo_Chen_Resume.pdf";

const socials = [
  {
    icon: faEnvelope,
    url: "mailto: jialuo.chen@utoronto.ca",
    label: "Email",
  },
  {
    icon: faGithub,
    url: "https://github.com/chenj926",
    label: "GitHub",
  },
  {
    icon: faLinkedin,
    url: "https://www.linkedin.com/in/ericjialuochen/",
    label: "LinkedIn",
  },
  {
    icon: faInstagram,
    url: "https://www.instagram.com/ericchen7161/",
    label: "Instagram",
  },
];

const navLinks = [
  { label: "About", anchor: "home" },
  { label: "Status", anchor: "status" },
  { label: "News", anchor: "news" },
  { label: "Experience", anchor: "experience" },
  { label: "Projects", anchor: "projects" },
  { label: "Research", anchor: "research" },
  { label: "Skills", anchor: "skills" },
  { label: "Connect", anchor: "connect" },
];

const Header = () => {
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
      backgroundColor="#f5f1e8"
      borderBottom="1px solid #e2ddd2"
      zIndex="9999"
    >
      <Box color="#3d3b36" maxWidth="1280px" margin="0 auto">
        <HStack px={{ base: 6, md: 16 }} py={4} justifyContent="space-between">
          <nav>
            <HStack spacing={4}>
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.url}
                  isExternal
                  aria-label={social.label}
                  color="#3d3b36"
                >
                  <FontAwesomeIcon icon={social.icon} size="lg" />
                </Link>
              ))}
            </HStack>
          </nav>
          <nav>
            <HStack spacing={4} fontSize="sm">
              {navLinks.map((link) => (
                <Link key={link.label} onClick={handleClick(link.anchor)}>
                  {link.label}
                </Link>
              ))}
              <Link href={Resume} isExternal fontWeight="600">
                Resume
              </Link>
            </HStack>
          </nav>
        </HStack>
      </Box>
    </Box>
  );
};
export default Header;
