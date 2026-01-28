import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Box, HStack, Link } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Resume from "../assets/resume/Jialuo_Chen_Resume.pdf";
import { useTheme } from "../context/themeContext";

const MotionBox = motion(Box);
const MotionLink = motion(Link);

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
  { label: "News", anchor: "news" },
  { label: "Experience", anchor: "experience" },
  { label: "Projects", anchor: "projects" },
  { label: "Research", anchor: "research" },
  { label: "Skills", anchor: "skills" },
  { label: "Connect", anchor: "connect" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <MotionBox
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex="9999"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        backgroundColor={scrolled ? (isDarkMode ? "rgba(10, 10, 15, 0.8)" : "rgba(250, 248, 245, 0.85)") : "transparent"}
        backdropFilter={scrolled ? "blur(20px)" : "none"}
        borderBottom={scrolled ? `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(139, 90, 43, 0.1)"}` : "none"}
        transition="all 0.4s ease"
      >
        <Box maxWidth="1280px" margin="0 auto">
          <HStack px={{ base: 6, md: 16 }} py={4} justifyContent="space-between">
            <nav>
              <HStack spacing={4}>
                {socials.map((social, index) => (
                  <MotionLink
                    key={social.label}
                    href={social.url}
                    isExternal
                    aria-label={social.label}
                    color={isDarkMode ? "#8b8b9a" : "#5c574e"}
                    _hover={{ color: isDarkMode ? "#f0f0f5" : "#2d2a26" }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <FontAwesomeIcon icon={social.icon} size="lg" />
                  </MotionLink>
                ))}
              </HStack>
            </nav>
            <nav>
              <HStack spacing={{ base: 3, md: 6 }} fontSize="sm">
                {navLinks.map((link, index) => (
                  <MotionLink
                    key={link.label}
                    onClick={handleClick(link.anchor)}
                    cursor="pointer"
                    color={isDarkMode ? "#8b8b9a" : "#5c574e"}
                    fontWeight="500"
                    position="relative"
                    _hover={{ color: isDarkMode ? "#f0f0f5" : "#2d2a26", textDecoration: "none" }}
                    display={{ base: index > 3 ? "none" : "block", md: "block" }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                    sx={{
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        bottom: "-4px",
                        width: "0%",
                        height: "2px",
                        background: isDarkMode
                          ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                          : "linear-gradient(90deg, #8b6914, #a67c00)",
                        transition: "width 0.4s ease",
                      },
                      "&:hover::after": {
                        width: "100%",
                      },
                    }}
                  >
                    {link.label}
                  </MotionLink>
                ))}

                {/* Theme Toggle */}
                <MotionBox
                  as="button"
                  onClick={toggleTheme}
                  className="theme-toggle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle theme"
                >
                  <Box className="theme-toggle-thumb" />
                  <FontAwesomeIcon
                    icon={faMoon}
                    className="theme-toggle-icon"
                    style={{
                      color: isDarkMode ? "#6366f1" : "#8a847a",
                      opacity: isDarkMode ? 1 : 0.5,
                      zIndex: 1,
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faSun}
                    className="theme-toggle-icon"
                    style={{
                      color: isDarkMode ? "#8a847a" : "#a67c00",
                      opacity: isDarkMode ? 0.5 : 1,
                      zIndex: 1,
                    }}
                  />
                </MotionBox>

                <MotionLink
                  href={Resume}
                  isExternal
                  fontWeight="600"
                  color={isDarkMode ? "#f0f0f5" : "#2d2a26"}
                  px={4}
                  py={2}
                  borderRadius="full"
                  background={isDarkMode
                    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))"
                    : "linear-gradient(135deg, rgba(139, 105, 20, 0.15), rgba(166, 124, 0, 0.15))"
                  }
                  border={`1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(139, 105, 20, 0.25)"}`}
                  _hover={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))"
                      : "linear-gradient(135deg, rgba(139, 105, 20, 0.25), rgba(166, 124, 0, 0.25))",
                    textDecoration: "none",
                    transform: "translateY(-1px)",
                    boxShadow: isDarkMode
                      ? "0 0 20px rgba(99, 102, 241, 0.3)"
                      : "0 0 20px rgba(139, 105, 20, 0.2)",
                  }}
                  transition="all 0.4s ease"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  Resume
                </MotionLink>
              </HStack>
            </nav>
          </HStack>
        </Box>
      </Box>
    </MotionBox>
  );
};
export default Header;
