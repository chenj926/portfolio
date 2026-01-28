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
import { ThemeProvider } from "./context/themeContext";
import Alert from "./components/Alert";

function App() {
  return (
    <ChakraProvider>
      <ThemeProvider>
        <AlertProvider>
          <main>
            <Header />
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
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default App;
