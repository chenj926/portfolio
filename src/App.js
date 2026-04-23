import { useEffect, useState } from "react";
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
import Footer from "./components/Footer";
import { AlertProvider } from "./context/alertContext";
import Alert from "./components/Alert";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(() => {
    return window.localStorage.getItem("portfolio-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ChakraProvider>
      <AlertProvider>
        <main className="app-shell" data-theme={theme}>
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
        </main>
      </AlertProvider>
    </ChakraProvider>
  );
}

export default App;
