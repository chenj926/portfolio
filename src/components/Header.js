import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faEnvelope,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import {
  faGithub,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Box, HStack, Link } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Resume from "../assets/resume/Jialuo_Chen_Resume.pdf";
import LiquidGlass from "./LiquidGlass";
import "./HomeGlass.css";

const MotionBox = motion(Box);
const MotionLink = motion(Link);

const documents = [
  { label: "Resume", url: Resume },
  { label: "CV", url: Resume },
];

const socials = [
  {
    icon: faEnvelope,
    url: "mailto:jialuo.chen@utoronto.ca",
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

const Header = ({ theme = "dark", onThemeToggle }) => {
  const [scrolled, setScrolled] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const docsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (docsRef.current && !docsRef.current.contains(event.target)) {
        setDocsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDocsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
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
      className={`home-header ${scrolled ? "is-scrolled" : ""}`}
      initial={{ y: -96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <LiquidGlass
        as={Box}
        className="home-nav-shell"
        displacementScale={38}
        blurAmount={0.14}
        saturation={180}
        aberrationIntensity={1.25}
        elasticity={0.12}
        cornerRadius={32}
      >
        <Box as="nav" aria-label="Social links" className="home-social-nav">
          <HStack className="home-social-stack" spacing={0}>
            {socials.map((social, index) => (
              <LiquidGlass
                as={MotionLink}
                key={social.label}
                href={social.url}
                isExternal
                aria-label={social.label}
                className="home-glass-icon"
                displacementScale={54}
                blurAmount={0.1}
                saturation={188}
                aberrationIntensity={1.5}
                elasticity={0.26}
                cornerRadius={16}
                padding="0"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
              >
                <FontAwesomeIcon icon={social.icon} />
              </LiquidGlass>
            ))}
          </HStack>
        </Box>

        <Box as="nav" aria-label="Primary navigation" className="home-main-nav">
          <HStack className="home-nav-links" spacing={0}>
            {navLinks.map((link, index) => (
              <MotionLink
                key={link.label}
                onClick={handleClick(link.anchor)}
                className="home-nav-link"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05, duration: 0.3 }}
              >
                {link.label}
              </MotionLink>
            ))}
          </HStack>
        </Box>

        <Box className="home-actions">
          <LiquidGlass
            as="button"
            type="button"
            className="home-theme-toggle"
            displacementScale={54}
            blurAmount={0.1}
            saturation={188}
            aberrationIntensity={1.5}
            elasticity={0.26}
            cornerRadius={16}
            padding="0"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={onThemeToggle}
          >
            <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
          </LiquidGlass>

          <Box className="home-docs-control" ref={docsRef}>
            <Box className="home-docs-frame">
              <Box
                as="button"
                type="button"
                className="home-docs-button"
                aria-haspopup="menu"
                aria-expanded={docsOpen}
                onClick={() => setDocsOpen((open) => !open)}
              >
                <span>Resume/CV</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`home-docs-chevron ${docsOpen ? "is-open" : ""}`}
                />
              </Box>
            </Box>

            {docsOpen && (
              <LiquidGlass
                as={MotionBox}
                className="home-docs-menu"
                displacementScale={44}
                blurAmount={0.16}
                saturation={176}
                aberrationIntensity={1.2}
                elasticity={0.14}
                cornerRadius={22}
                role="menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {documents.map((documentLink) => (
                  <Link
                    key={documentLink.label}
                    href={documentLink.url}
                    isExternal
                    role="menuitem"
                    className="home-docs-item"
                    onClick={() => setDocsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faFileLines} />
                    <span>{documentLink.label}</span>
                  </Link>
                ))}
              </LiquidGlass>
            )}
          </Box>
        </Box>
      </LiquidGlass>
    </MotionBox>
  );
};

export default Header;
