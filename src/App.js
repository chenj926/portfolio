import { useLayoutEffect, useState } from "react";
import { ChakraProvider, extendTheme, useColorMode } from "@chakra-ui/react";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import NewsSection from "./components/NewsSection";
import ExperienceSection from "./components/ExperienceSection.js";
import EducationSection from "./components/EducationSection";
import ProjectsSection from "./components/ProjectsSection";
import ResearchSection from "./components/ResearchSection";
import PublicationsSection from "./components/PublicationsSection";
import HobbiesSection from "./components/HobbiesSection";
import ContentSection from "./components/ContentSection";
import SkillsSection from "./components/SkillsSection";
import ContactMeSection from "./components/ContactMeSection";
import PortfolioDetailPage, {
  usePortfolioRoute,
} from "./components/PortfolioDetailPage";
import Footer from "./components/Footer";
import { AlertProvider } from "./context/alertContext";
import Alert from "./components/Alert";
import "./App.css";

// Chakra owns the document theme; this adapter keeps the existing preference key.
const themeStorage = {
  type: "localStorage",
  get() {
    try {
      return window.localStorage.getItem("portfolio-theme") === "light"
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  },
  set(theme) {
    try {
      window.localStorage.setItem("portfolio-theme", theme);
    } catch {
      // A denied storage permission must not disable the theme control.
    }
  },
};

function Portfolio() {
  const portfolioEntry = usePortfolioRoute();
  const { colorMode: theme, toggleColorMode } = useColorMode();

  useLayoutEffect(() => {
    if (portfolioEntry || !/^#[a-z-]+-section$/i.test(window.location.hash)) {
      return;
    }

    document
      .getElementById(window.location.hash.slice(1))
      ?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [portfolioEntry]);

  return (
    <AlertProvider>
      <div className="app-shell" data-theme={theme}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header theme={theme} onThemeToggle={toggleColorMode} />
        <main id="main-content" tabIndex={-1}>
          {portfolioEntry ? (
            <PortfolioDetailPage entry={portfolioEntry} />
          ) : (
            <>
              <LandingSection />
              <NewsSection />
              <ExperienceSection />
              <EducationSection />
              <ResearchSection />
              <PublicationsSection />
              <ProjectsSection />
              <HobbiesSection />
              <ContentSection />
              <SkillsSection />
              <ContactMeSection />
            </>
          )}
        </main>
        <Footer />
        <Alert />
      </div>
    </AlertProvider>
  );
}

function App() {
  const [interfaceTheme] = useState(() =>
    extendTheme({
      config: {
        initialColorMode: themeStorage.get(),
        useSystemColorMode: false,
      },
      fonts: { body: "var(--font-body)", heading: "var(--font-body)" },
      styles: {
        global: { body: { bg: "var(--canvas)", color: "var(--ink)" } },
      },
    }),
  );
  return (
    <ChakraProvider theme={interfaceTheme} colorModeManager={themeStorage}>
      <Portfolio />
    </ChakraProvider>
  );
}

export default App;
