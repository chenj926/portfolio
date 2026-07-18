import React, { useEffect, useRef, useState } from "react";
import { Box, HStack, Link } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faEnvelope,
  faMoon,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import Resume from "../assets/resume/Jialuo_Chen_Resume.pdf";
import CV from "../assets/resume/Eric_CV.pdf";
import "./HomeGlass.css";

const MotionBox = motion(Box);

const documents = [
  { label: "Resume", url: Resume },
  { label: "CV", url: CV },
];

const socials = [
  { icon: faEnvelope, url: "mailto:jialuo.chen@utoronto.ca", label: "Email" },
  { icon: faGithub, url: "https://github.com/chenj926", label: "GitHub" },
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

const scrollToSection = (anchor, requestedBehavior = "smooth") => {
  const scroll = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.getElementById(`${anchor}-section`)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : requestedBehavior,
      block: "start",
    });
  };

  if (window.location.hash.startsWith("#/")) {
    window.location.hash = "";
    window.setTimeout(scroll, 0);
    return;
  }

  scroll();
};

const Header = ({ theme = "dark", onThemeToggle }) => {
  const [docsOpen, setDocsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [keyboardDocsAction, setKeyboardDocsAction] = useState(false);
  const docsRef = useRef(null);
  const docsButtonRef = useRef(null);
  const firstDocumentRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (docsRef.current && !docsRef.current.contains(event.target)) {
        setKeyboardDocsAction(false);
        setDocsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (docsOpen) {
          setKeyboardDocsAction(true);
          setDocsOpen(false);
          docsButtonRef.current?.focus();
        }
        setMobileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [docsOpen]);

  const handleNavClick = (anchor) => (event) => {
    event.preventDefault();
    setMobileOpen(false);
    scrollToSection(anchor, event.detail === 0 ? "auto" : "smooth");
  };

  const toggleDocuments = (event) => {
    const fromKeyboard = event.detail === 0;
    setKeyboardDocsAction(fromKeyboard);
    setDocsOpen((open) => !open);
  };

  const handleDocumentsKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setKeyboardDocsAction(true);
      setDocsOpen(true);
      window.setTimeout(() => firstDocumentRef.current?.focus(), 0);
    }
  };

  const menuMotionless = shouldReduceMotion || keyboardDocsAction;

  const handleDocumentSelect = (event) => {
    setKeyboardDocsAction(event.detail === 0);
    setDocsOpen(false);
  };

  return (
    <Box
      as="header"
      className="home-header"
    >
      <Box className="home-nav-shell liquid-glass">
        <Box as="nav" aria-label="Social links" className="home-social-nav">
          <HStack className="home-social-stack" spacing={0}>
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.url}
                isExternal={social.url.startsWith("http")}
                aria-label={social.label}
                title={social.label}
                className="home-glass-icon pressable"
              >
                <FontAwesomeIcon icon={social.icon} />
              </Link>
            ))}
          </HStack>
        </Box>

        <Box as="nav" aria-label="Primary navigation" className="home-main-nav">
          <HStack className="home-nav-links" spacing={0}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={`#${link.anchor}-section`}
                onClick={handleNavClick(link.anchor)}
                className="home-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </HStack>
        </Box>

        <Box className="home-actions">
          <Box
            as="button"
            type="button"
            className="home-theme-toggle liquid-glass pressable"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={onThemeToggle}
          >
            <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
          </Box>

          <Box className="home-docs-control" ref={docsRef}>
            <Box className="home-docs-frame">
              <Box
                ref={docsButtonRef}
                as="button"
                type="button"
                className="home-docs-button pressable"
                aria-haspopup="menu"
                aria-expanded={docsOpen}
                onClick={toggleDocuments}
                onKeyDown={handleDocumentsKeyDown}
              >
                <span>Resume/CV</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`home-docs-chevron ${docsOpen ? "is-open" : ""} ${
                    menuMotionless ? "is-motionless" : ""
                  }`}
                />
              </Box>
            </Box>

            <MotionBox
              className="home-docs-menu liquid-glass"
              role="menu"
              aria-hidden={!docsOpen}
              initial={false}
              animate={
                docsOpen
                  ? {
                      opacity: 1,
                      transform: "translate3d(0,0,0) scale(1)",
                    }
                  : {
                      opacity: 0,
                      transform: "translate3d(0,-3px,0) scale(.98)",
                    }
              }
              transition={{
                duration: menuMotionless ? 0 : 0.18,
                ease: [0.23, 1, 0.32, 1],
              }}
              style={{ pointerEvents: docsOpen ? "auto" : "none" }}
            >
              {documents.map((documentLink, index) => (
                <Link
                  ref={index === 0 ? firstDocumentRef : undefined}
                  key={documentLink.label}
                  href={documentLink.url}
                  isExternal
                  role="menuitem"
                  tabIndex={docsOpen ? 0 : -1}
                  className="home-docs-item pressable"
                  onClick={handleDocumentSelect}
                >
                  <FontAwesomeIcon icon={faFileLines} />
                  <span>{documentLink.label}</span>
                </Link>
              ))}
            </MotionBox>
          </Box>

          <Box
            as="button"
            type="button"
            className="home-mobile-toggle pressable"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
          </Box>
        </Box>

        {mobileOpen && (
          <Box className="home-mobile-menu" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={`#${link.anchor}-section`}
                onClick={handleNavClick(link.anchor)}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
