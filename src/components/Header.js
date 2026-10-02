import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faFileLines,
  faMoon,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { documents } from "../data/profile";
import SocialLinks from "./SocialLinks";
import Material from "./Material";
import "./HomeGlass.css";

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
  const [docsOpen, setDocsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const docsRef = useRef(null);
  const navigationRef = useRef(null);
  const docsButtonRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const menuItemsRef = useRef([]);

  useEffect(() => {
    const updateSurface = () => setScrolled(window.scrollY > 80);
    updateSurface();
    window.addEventListener("scroll", updateSurface, { passive: true });
    return () => window.removeEventListener("scroll", updateSurface);
  }, []);

  useEffect(() => {
    if (docsOpen) {
      menuItemsRef.current[0]?.focus();
    }
  }, [docsOpen]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (docsRef.current && !docsRef.current.contains(event.target)) {
        setDocsOpen(false);
      }
      if (!navigationRef.current?.contains(event.target)) {
        setMobileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (docsOpen) {
        setDocsOpen(false);
        docsButtonRef.current?.focus();
      }

      if (mobileOpen) {
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [docsOpen, mobileOpen]);

  const toggleDocuments = () => {
    const nextOpen = !docsOpen;
    if (nextOpen) setMobileOpen(false);
    setDocsOpen(nextOpen);
  };

  const handleDocumentsButtonKeyDown = (event) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    if (docsOpen) {
      menuItemsRef.current[0]?.focus();
      return;
    }
    setMobileOpen(false);
    setDocsOpen(true);
  };

  const handleMenuItemKeyDown = (event, currentIndex) => {
    const count = documents.length;
    let nextIndex;

    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % count;
    else if (event.key === "ArrowUp")
      nextIndex = (currentIndex - 1 + count) % count;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = count - 1;
    else return;

    event.preventDefault();
    menuItemsRef.current[nextIndex]?.focus();
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="home-header">
      <Material
        className="home-nav-shell"
        ref={navigationRef}
        data-scrolled={scrolled}
      >
        <SocialLinks />

        <nav aria-label="Primary navigation" className="home-main-nav">
          <div className="home-nav-links">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`#${link.anchor}-section`}
                onClick={closeMobileMenu}
                className="home-nav-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="home-actions">
          <Material
            as="button"
            type="button"
            className="home-theme-toggle pressable"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={onThemeToggle}
          >
            <FontAwesomeIcon
              icon={theme === "dark" ? faSun : faMoon}
              aria-hidden="true"
            />
          </Material>

          <div
            className="home-docs-control"
            ref={docsRef}
            onBlur={(event) => {
              if (!docsRef.current?.contains(event.relatedTarget)) {
                setDocsOpen(false);
              }
            }}
          >
            <div className="home-docs-frame">
              <Material
                as="button"
                ref={docsButtonRef}
                type="button"
                className="home-docs-button pressable"
                aria-haspopup="menu"
                aria-controls={docsOpen ? "home-docs-menu" : undefined}
                aria-expanded={docsOpen}
                onClick={toggleDocuments}
                onKeyDown={handleDocumentsButtonKeyDown}
              >
                <span>Resume/CV</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  aria-hidden="true"
                  className={`home-docs-chevron ${docsOpen ? "is-open" : ""}`}
                />
              </Material>
            </div>

            {docsOpen && (
              <Material
                id="home-docs-menu"
                className="home-docs-menu"
                role="menu"
                aria-label="Download documents"
              >
                {documents.map((documentLink, index) => (
                  <a
                    ref={(node) => {
                      menuItemsRef.current[index] = node;
                    }}
                    key={documentLink.label}
                    href={documentLink.url}
                    target="_blank"
                    rel="noreferrer"
                    role="menuitem"
                    className="home-docs-item pressable"
                    onClick={() => {
                      setDocsOpen(false);
                      docsButtonRef.current?.focus();
                    }}
                    onKeyDown={(event) => handleMenuItemKeyDown(event, index)}
                  >
                    <FontAwesomeIcon icon={faFileLines} aria-hidden="true" />
                    <span>{documentLink.label}</span>
                  </a>
                ))}
              </Material>
            )}
          </div>

          <Material
            as="button"
            ref={mobileButtonRef}
            type="button"
            className="home-mobile-toggle pressable"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-controls={mobileOpen ? "home-mobile-menu" : undefined}
            aria-expanded={mobileOpen}
            onClick={() => {
              const nextOpen = !mobileOpen;
              if (nextOpen) setDocsOpen(false);
              setMobileOpen(nextOpen);
            }}
          >
            <FontAwesomeIcon
              icon={mobileOpen ? faXmark : faBars}
              aria-hidden="true"
            />
          </Material>
        </div>

        {mobileOpen && (
          <Material
            as="nav"
            id="home-mobile-menu"
            aria-label="Mobile navigation"
            className="home-mobile-menu"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`#${link.anchor}-section`}
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
          </Material>
        )}
      </Material>
    </header>
  );
};

export default Header;
