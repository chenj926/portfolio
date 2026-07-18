import NeuroCommuteImage from "../assets/images/NeuroCommute.png";
import ADHDImage from "../assets/images/ADHD.png";

export const projects = [
  {
    kind: "work",
    slug: "neurocommute-agent",
    title: "NeuroCommute Agent",
    description:
      "Agentic AI route planner using OpenAI & Qwen LLMs to critique A* pathfinding, optimizing for complex user constraints.",
    image: NeuroCommuteImage,
    tags: ["Agentic AI", "Routing", "LLM"],
    details: [
      { label: "Format", value: "Agentic AI route planner" },
      { label: "Pathfinding", value: "A*" },
      { label: "Model stack", value: "OpenAI and Qwen LLMs" },
    ],
    highlights: [
      "Uses A* pathfinding as the route-search foundation.",
      "Uses OpenAI and Qwen LLMs to critique routes against complex user constraints.",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/chenj926/NeuroCommute",
        type: "github",
      },
    ],
  },
  {
    kind: "work",
    slug: "adhd-scholarship-copilot",
    title: "ADHD Scholarship Copilot",
    description:
      "RAG-powered Chrome extension decomposing applications into micro-tasks using Claude AI and ChromaDB context retention.",
    image: ADHDImage,
    tags: ["RAG", "Chrome", "Education"],
    details: [
      { label: "Format", value: "Chrome extension" },
      { label: "AI approach", value: "RAG with Claude AI" },
      { label: "Context", value: "ChromaDB retention" },
    ],
    highlights: [
      "Decomposes scholarship applications into micro-tasks.",
      "Uses ChromaDB to retain context for the RAG workflow.",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/chenj926/adhd-scholarship-copilot",
        type: "github",
      },
    ],
  },
  {
    kind: "work",
    slug: "personal-wealthtracker",
    title: "Personal WealthTracker",
    description:
      "Full-stack financial system (Spring Boot + React) with joint account logic, clean architecture, and 93% JUnit test coverage.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    tags: ["FinTech", "Spring Boot", "React"],
    details: [
      { label: "Format", value: "Full-stack financial system" },
      { label: "Stack", value: "Spring Boot and React" },
      { label: "Test coverage", value: "93% JUnit" },
    ],
    highlights: [
      "Implements joint account logic.",
      "Uses clean architecture with JUnit coverage reported at 93%.",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/chenj926/Accounting_System",
        type: "github",
      },
    ],
  },
  {
    kind: "work",
    slug: "multimodal-risk-predictor",
    title: "Multimodal Risk Predictor",
    description:
      "Insurance risk ensemble merging tabular data with PDF/Image embeddings (CLIP & MiniLM) to achieve top 1% model performance.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    tags: ["Multimodal", "Insurance", "Embeddings"],
    details: [
      { label: "Domain", value: "Insurance risk" },
      { label: "Inputs", value: "Tabular, PDF, and image data" },
      { label: "Embeddings", value: "CLIP and MiniLM" },
    ],
    highlights: [
      "Combines tabular features with PDF and image embeddings in an ensemble.",
      "Reports top 1% model performance.",
    ],
    links: [],
  },
  {
    kind: "work",
    slug: "sketch-to-face-gan",
    title: "SketchToFace GAN",
    description:
      "Generative Adversarial Network with U-Net architecture converting sketches to realistic faces for forensic investigations.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    tags: ["GAN", "Computer Vision", "Forensics"],
    details: [
      { label: "Model", value: "Generative Adversarial Network" },
      { label: "Architecture", value: "U-Net" },
      { label: "Use case", value: "Forensic investigations" },
    ],
    highlights: [
      "Converts sketches into realistic faces.",
      "Uses a U-Net architecture in a GAN-based computer-vision workflow.",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/chenj926/Line2Live",
        type: "github",
      },
    ],
  },
  {
    kind: "work",
    slug: "pg-business-strategy",
    title: "P&G Business Strategy",
    description:
      "1st Place Winner: AI-driven market expansion strategy optimizing a $78M budget using demographic segmentation.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    tags: ["Strategy", "Analytics", "Case Comp"],
    details: [
      { label: "Result", value: "1st place" },
      { label: "Scope", value: "$78M budget" },
      { label: "Method", value: "Demographic segmentation" },
    ],
    highlights: [
      "Develops an AI-driven market expansion strategy.",
      "Optimizes a $78M budget using demographic segmentation.",
    ],
    links: [
      {
        label: "Website",
        url: "https://www.canva.com/design/DAG03M90MS0/jjAx7TqXPSb97h2F3ZTiqQ/edit",
        type: "website",
      },
    ],
  },
];

export const publications = [
  {
    kind: "publication",
    slug: "hmitl-manager-governed-llm-iteration",
    title:
      "(Accepted) HMITL Manager-Governed LLM Iteration with Guardrails and Rollback for Reproducible Healthcare Machine Learning Pipelines",
    venue: "IEEE ICHI 2026",
    year: "June 2026",
    status: "Accepted",
    description:
      "We introduce Human-Manager-in-the-Loop (HMITL), a collaboration protocol that assigns the human the role of workflow manager. The manager maintains a task brief, enforces data-integrity guardrails, runs deterministic evaluation, and rolls back regressions.",
    tags: ["Agent Harness", "Human-AI Collaboration"],
    details: [
      { label: "Status", value: "Accepted" },
      { label: "Venue", value: "IEEE ICHI 2026" },
      { label: "Date", value: "June 2026" },
      { label: "Protocol", value: "Human-Manager-in-the-Loop" },
    ],
    highlights: [
      "Assigns the human the role of workflow manager.",
      "The manager maintains a task brief and enforces data-integrity guardrails.",
      "Deterministic evaluation and rollback are used to handle regressions.",
    ],
    links: [
      { label: "Paper", url: "https://arxiv.org/", type: "paper" },
      {
        label: "GitHub",
        url: "https://github.com/chenj926/ICHI_AgentDS_clai",
        type: "github",
      },
    ],
  },
];

export const portfolioEntries = [...projects, ...publications];

export const getPortfolioHref = (entry) => `#/${entry.kind}/${entry.slug}`;

export const resolvePortfolioHash = (hash) => {
  if (typeof hash !== "string") {
    return null;
  }

  const match = hash.trim().match(/^#\/(work|publication)\/([^/?#]+)\/?$/);
  if (!match) {
    return null;
  }

  let slug;
  try {
    slug = decodeURIComponent(match[2]);
  } catch {
    return null;
  }

  return (
    portfolioEntries.find(
      (entry) => entry.kind === match[1] && entry.slug === slug,
    ) || null
  );
};
