import { useLayoutEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import NewsSection from "./components/NewsSection";
import ExperienceSection from "./components/ExperienceSection.js";
import ProjectsSection from "./components/ProjectsSection";
import ResearchSection from "./components/ResearchSection";
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

function App() {
  const portfolioEntry = usePortfolioRoute();
  const [theme, setTheme] = useState(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    const initialTheme = storedTheme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = initialTheme;
    return initialTheme;
  });

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useLayoutEffect(() => {
    if (portfolioEntry || !/^#[a-z-]+-section$/i.test(window.location.hash)) {
      return;
    }

    document
      .getElementById(window.location.hash.slice(1))
      ?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [portfolioEntry]);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add("theme-switching");

    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      root.dataset.theme = nextTheme;
      return nextTheme;
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => root.classList.remove("theme-switching"));
    });
  };

  return (
    <ChakraProvider>
      <AlertProvider>
        <main className="app-shell" data-theme={theme}>
          {portfolioEntry ? (
            <PortfolioDetailPage entry={portfolioEntry} />
          ) : (
            <>
              <Header theme={theme} onThemeToggle={toggleTheme} />
              <LandingSection />
              {/* <StatusSection /> */}
              <NewsSection />
              <ExperienceSection />
              <ProjectsSection />
              <ResearchSection />
              <HobbiesSection />
              <ContentSection />
              <SkillsSection />
              <ContactMeSection />
              <Footer />
              <Alert />
            </>
          )}
        </main>
      </AlertProvider>
    </ChakraProvider>
  );
}

export default App;
