import { faEnvelope, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import Resume from "../assets/resume/Jialuo_Chen_Resume.pdf";
import CV from "../assets/resume/Jialuo_Chen_CV.pdf";

export const profile = {
  name: "Jialuo (Eric) Chen",
  chineseName: "陈佳洛",
  eyebrow: "AI Researcher & Engineer",
  introduction:
    "Industrial Engineering student at the University of Toronto with a dual focus on AI/ML research and software architecture. My work spans deep learning, LLM reasoning, computer vision, Bayesian optimization, and reinforcement learning.",
  currentWork:
    "Researching embodied conversational AI and RGB-D object re-identification at UofT, and linear attention and hidden-state steering for mathematical reasoning at SJTU.",
  role: "Software & AI/ML Engineer",
  education: {
    discipline: "Industrial Engineering",
    university: "University of Toronto",
  },
  email: "jialuo.chen@mail.utoronto.ca",
  // Owner-edited configuration. Visitors see the selected status but cannot change it.
  currentStatus: "opportunities",
};

export const socialLinks = [
  {
    icon: faEnvelope,
    label: "Email",
    url: `mailto:${profile.email}`,
  },
  {
    icon: faGithub,
    label: "GitHub",
    url: "https://github.com/chenj926",
  },
  {
    icon: faLinkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
  {
    icon: faInstagram,
    label: "Instagram",
    url: "https://www.instagram.com/ericchen7161/",
  },
  {
    icon: faGraduationCap,
    label: "Google Scholar",
    url: "https://scholar.google.ca/citations?user=E_qNOCcAAAAJ&hl=en",
  },
];

export const documents = [
  { label: "Resume", url: Resume },
  { label: "CV", url: CV },
];

export const statusOptions = {
  opportunities: {
    label: "Open to opportunities",
    spriteColumn: 0,
  },
  collaborate: {
    label: "Open to collaborate",
    spriteColumn: 1,
  },
  communicate: {
    label: "Open to communicate",
    spriteColumn: 2,
  },
  vacation: {
    label: "Currently on vacation",
    spriteColumn: 3,
  },
};
