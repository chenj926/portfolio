// Projects: what was built, how it works and its numbers, from the CV (2026), each repository's README and
// the previous site's data. A project with no public link says so by having none. One entry is one page:
// /projects/<slug>/ is built from it; the list's order is the order on the site (the home shows the first
// six). How to add one: docs/ADDING-CONTENT.md.
import type { DiagramId } from "@/components/Diagrams";
import type { Pic } from "@/lib/site";
import type { Link, Point } from "./research";

export type ProjectTag = "AI and ML" | "Software" | "Competition";

export interface Fact {
  label: string;
  value: string;
}

/** One picture per step (the steps then play as pinned chapters), or the diagram's boxes to light. */
export type StepVisual = { pic: Pic } | { focus: string[] };

export interface Project {
  slug: string;
  name: string;
  h1: string; // the page's headline, 55 characters at most
  line: string; // one sentence for the card
  summary: string; // the page's lead, two sentences at most
  statement: string; // the paragraph that lights up word by word (12 to 40 words); it restates facts below
  card: { k: string; v: string }; // the headline figure on the hero's card
  when: string;
  year: string;
  tags: ProjectTag[];
  facts: Fact[]; // four
  why?: { heading: string; body: string };
  stepsHeading: string;
  steps: Point[];
  stepVisuals?: StepVisual[]; // as many as steps
  stepsShape?: "wide" | "square" | "plate"; // the frame the step pictures share
  stepsScreens?: 2; // the steps take two screens (the checks say when)
  result?: string;
  stack: { label: string; icon?: string }[];
  links: Link[]; // the first is the hero's main button
  cover?: Pic; // 4:3, for cards
  hero?: Pic; // the page's main picture
  gallery?: Pic[];
  diagram?: DiagramId;
}

export const projects: Project[] = [
  {
    slug: "xr-capstone",
    name: "XR capstone",
    h1: "XR capstone, machine inspections on a Meta Quest 3",
    line: "An inspector scans a site once; on later visits the headset labels the machines in view and an LLM summarizes the notes for each.",
    summary:
      "My MIE490 capstone with an industry partner: an inspector scans the site once with a Meta Quest 3, and on later visits the headset relocalizes, labels the machines in view, and an LLM summarizes the spoken notes for each machine. I am the technical lead of a team of four, supervised by Prof. Scott Sanner, and wrote the mapping and relocalization pipeline.",
    statement:
      "An inspector scans the site once. On every later visit the headset finds its place in the labeled 3D map, names the machines in view, and an LLM turns the spoken notes into a summary for each machine.",
    card: { k: "My role", v: "Technical lead, team of four" },
    when: "September 2026 to now",
    year: "2026",
    tags: ["AI and ML", "Software"],
    facts: [
      { label: "Headset", value: "Meta Quest 3" },
      { label: "Team", value: "Four, as technical lead" },
      { label: "Supervisor", value: "Prof. Scott Sanner" },
      { label: "Benchmark", value: "6 segmenters, 2 namers, 6 datasets" },
    ],
    stepsHeading: "How an inspection runs",
    steps: [
      { title: "Scan the site with the Meta Quest 3", body: "The inspector walks the site once while the headset records camera, depth, pose and audio for the workstation." },
      { title: "Build a labeled 3D map", body: "TSDF fusion within 2 m, with far rays clearing free space and GPU-sized slabs, builds the mesh, and 2D masks are lifted into named 3D regions. A benchmark of six segmenters and two open-vocabulary namers on six public 3D datasets found the naming to be the bottleneck." },
      { title: "Relocalize with two AprilTags", body: "A rigid alignment from two AprilTags, accepted within 1 cm, places each later visit in the map, so the machines in view are labeled." },
      { title: "Summarize the spoken notes", body: "An LLM summarizes the notes spoken during the visit for each machine; a teammate prototyped it and I integrated it." },
    ],
    stack: [
      { label: "Meta Quest 3", icon: "meta" },
      { label: "Kotlin", icon: "kotlin" },
      { label: "C++", icon: "cpp" },
      { label: "Python", icon: "python" },
      { label: "PostgreSQL", icon: "postgresql" },
    ],
    links: [{ label: "Watch the demo", href: "https://youtu.be/gpxLOQb4-ZY" }],
    cover: { name: "xr-capstone-43", widths: [600, 720], w: 720, h: 540, alt: "The headset view in the capstone's demo: labels for a desk and a cutting machine float above a workbench, each linked to its object by a line." },
    hero: { name: "xr-capstone", widths: [480, 720], w: 720, h: 720, alt: "The headset view in the capstone's demo: labels for a desk and a cutting machine float above a workbench, each linked to its object by a line." },
    diagram: "audit",
  },
  {
    slug: "neurocommute",
    name: "NeuroCommute",
    h1: "NeuroCommute, a route planner for Toronto transit",
    line: "Plans Toronto trips from preferences written in plain English, across 6,500+ locations.",
    summary:
      "NeuroCommute plans transit, walking and cycling trips across the Toronto region from preferences written in plain English, such as less walking or safer streets, and keeps them as you refine the search.",
    statement:
      "In a survey of 92 people, 79% had turned down a route a map app suggested in the previous two weeks. Walking, safety and transfers were the usual reasons, and they became the planner's preference controls.",
    card: { k: "Locations and connections", v: "6,500+ and 45,000+" },
    when: "December 2025 to April 2026",
    year: "2026",
    tags: ["AI and ML", "Software"],
    facts: [
      { label: "Locations", value: "6,500+" },
      { label: "Connections", value: "45,000+" },
      { label: "Survey", value: "92 people" },
      { label: "Data", value: "TTC, GO, UP Express, OpenStreetMap" },
    ],
    why: {
      heading: "Why a planner that listens",
      body: "In a survey of 92 people, 79% had turned down a route a map app suggested in the previous two weeks. Walking, safety and transfers were the usual reasons, and they became the planner's preference controls.",
    },
    stepsHeading: "How a trip is planned",
    steps: [
      { title: "Ask in plain English", body: "Type what matters on this trip: less walking, safer streets, fewer transfers." },
      { title: "Search the network", body: "Transfer-aware A* runs over the TTC, GO, UP Express and OpenStreetMap graph, tracking transfers and fare windows." },
      { title: "Critique and rank again", body: "An LLM on OpenAI, DeepSeek or a local Qwen model turns your feedback into new routing weights; routes are ranked again by time, fare and transfers, and earlier preferences carry over." },
    ],
    stepVisuals: [
      { pic: { name: "neurocommute-start", widths: [800, 1040], w: 1040, h: 484, alt: "The planner before a trip: empty source, destination and preference fields beside a map of Toronto." } },
      { pic: { name: "neurocommute-demo", widths: [800, 1280], w: 1280, h: 596, alt: "A request for the fastest route and the plan it returns: 55 minutes with three transfers, drawn across the Toronto map." } },
      { pic: { name: "neurocommute-explain", widths: [800, 1280], w: 1280, h: 596, alt: "A route ranked again, about 53 minutes with one transfer, with the planner's explanation of its steps and why it was chosen." } },
    ],
    stepsShape: "wide",
    stack: [
      { label: "Python", icon: "python" },
      { label: "FastAPI", icon: "fastapi" },
      { label: "OpenAI", icon: "openai" },
      { label: "Qwen", icon: "qwen" },
      { label: "OpenStreetMap", icon: "openstreetmap" },
      { label: "A* search" },
    ],
    links: [
      { label: "Watch the demo", href: "https://youtu.be/t_QWe_1ukOA" },
      { label: "See the code", href: "https://github.com/chenj926/NeuroCommute", icon: "github" },
    ],
    cover: { name: "neurocommute-demo-43", widths: [600, 795], w: 795, h: 596, alt: "The NeuroCommute demo: a request for the fastest route and its plan, 55 minutes with three transfers, beside the route on a map of Toronto." },
    hero: { name: "neurocommute-demo", widths: [800, 1280], w: 1280, h: 596, alt: "The NeuroCommute demo: a request for the fastest route and its plan, 55 minutes with three transfers, drawn across a map of Toronto." },
  },
  {
    slug: "adhd-copilot",
    name: "ADHD Scholarship Copilot",
    h1: "ADHD Scholarship Copilot, a Chrome extension",
    line: "Turns a dense scholarship page into four first steps for students with ADHD.",
    summary:
      "A Chrome extension and FastAPI backend that turn a dense scholarship page into four concrete first steps, so a student with ADHD can start without planning the whole application. Built at the UofT AI and Claude hackathon.",
    statement:
      "A scholarship page is long and dense. The extension turns it into four first steps, finds the deadlines and requirements that matter, and dims the rest of the screen while the form is filled.",
    card: { k: "Built at", v: "UofT AI and Claude hackathon" },
    when: "November 2025",
    year: "2025",
    tags: ["AI and ML", "Software"],
    facts: [
      { label: "Built at", value: "UofT AI and Claude hackathon" },
      { label: "Model", value: "Claude Sonnet 4.5" },
      { label: "Retrieval", value: "ChromaDB" },
      { label: "Form", value: "Chrome extension" },
    ],
    stepsHeading: "What it does on a page",
    steps: [
      { title: "Four first steps", body: "Claude turns the page into a short plan: read, check, focus, give feedback." },
      { title: "The requirements, pulled out", body: "Retrieval over ChromaDB finds the deadlines, reference requirements and AI policy in the page." },
      { title: "Focus Shield", body: "A spotlight follows the cursor and dims the rest of the screen while you fill the form." },
      { title: "Profile and autofill", body: "A profile kept in the browser fills common fields and warns about degree or citizenship mismatches." },
    ],
    stepsScreens: 2,
    stack: [
      { label: "TypeScript", icon: "typescript" },
      { label: "Chrome", icon: "chrome" },
      { label: "Python", icon: "python" },
      { label: "FastAPI", icon: "fastapi" },
      { label: "Claude", icon: "claude" },
      { label: "LangChain", icon: "langchain" },
    ],
    links: [{ label: "See the code", href: "https://github.com/chenj926/adhd-scholarship-copilot", icon: "github" }],
    cover: { name: "adhd-copilot-43", widths: [800, 1200], w: 1254, h: 941, alt: "The ADHD Scholarship Copilot poster: a student at a desk beside the extension's task panel." },
    hero: { name: "adhd-copilot", widths: [800, 1600], w: 1672, h: 941, alt: "The ADHD Scholarship Copilot poster: a student at a desk beside the extension's task panel and focus tools." },
  },
  {
    slug: "linetolive",
    name: "LineToLive",
    h1: "LineToLive, sketch-to-face synthesis in three stages",
    line: "A three-stage conditional GAN that turns a pencil sketch into a colour face.",
    summary:
      "A conditional GAN in PyTorch that turns a pencil sketch of a face into a colour photograph in three supervised stages: structure first, then colour, then refinement.",
    statement:
      "Against a single-generator Pix2Pix baseline on held-out sketches, the staged model drew sharper facial contours and fewer artifacts at the edge of the face.",
    card: { k: "Training pairs", v: "2,520 sketches and photos" },
    when: "June to August 2024",
    year: "2024",
    tags: ["AI and ML"],
    facts: [
      { label: "Training pairs", value: "2,520 sketches and photos" },
      { label: "Generators", value: "U-Net, three stages" },
      { label: "Discriminator", value: "PatchGAN" },
      { label: "Loss", value: "L1 and adversarial" },
    ],
    stepsHeading: "Three stages, three jobs",
    steps: [
      { title: "Grayscale reconstruction", body: "The first generator draws the face's structure in gray, supervised on its own." },
      { title: "Colourisation", body: "The second adds skin, hair and clothing colour to that structure." },
      { title: "Refinement", body: "The third refines colour and local detail." },
    ],
    stepVisuals: [
      { pic: { name: "l2l-step1", widths: [524], w: 524, h: 523, alt: "Two pencil sketches of faces and the first generator's grayscale faces beside them." } },
      { pic: { name: "l2l-step2", widths: [524], w: 524, h: 523, alt: "The grayscale faces and the second generator's colour faces beside them." } },
      { pic: { name: "l2l-step3", widths: [524], w: 524, h: 523, alt: "The colour faces and the third generator's refined faces beside them." } },
    ],
    stepsShape: "square",
    result:
      "Against a single-generator Pix2Pix baseline on held-out sketches, the staged model drew sharper facial contours and fewer artifacts at the edge of the face.",
    stack: [
      { label: "Python", icon: "python" },
      { label: "PyTorch", icon: "pytorch" },
    ],
    links: [{ label: "See the code", href: "https://github.com/chenj926/Line2Live", icon: "github" }],
    cover: { name: "linetolive-43", widths: [800, 1040], w: 1045, h: 784, alt: "Three sketches of faces beside the model's grayscale, colour and refined outputs." },
    hero: { name: "linetolive-stages", widths: [800, 1048], w: 1048, h: 784, alt: "Three rows, each a pencil sketch of a face followed by the model's grayscale, colour and refined outputs." },
  },
  {
    slug: "risk-predictor",
    name: "Multimodal Risk Predictor",
    h1: "Multimodal Risk Predictor for insurance risk",
    line: "Joins tables, PDFs and images in one insurance-risk model, in the top 1%.",
    summary:
      "An insurance-risk ensemble that joins tabular features with embeddings of PDF documents and images, from MiniLM and CLIP, and reached top 1% model performance.",
    statement:
      "Tables, PDF documents and images each keep their own form until the end: MiniLM and CLIP embed the documents and images, and one ensemble scores the risk, in the top 1%.",
    card: { k: "Model performance", v: "Top 1%" },
    when: "",
    year: "",
    tags: ["AI and ML", "Competition"],
    facts: [
      { label: "Domain", value: "Insurance risk" },
      { label: "Inputs", value: "Tables, PDFs and images" },
      { label: "Embeddings", value: "MiniLM, CLIP" },
      { label: "Standing", value: "Top 1%" },
    ],
    stepsHeading: "How the inputs meet",
    steps: [
      { title: "Tables", body: "Tabular features enter the model as they are." },
      { title: "Documents", body: "PDF text becomes MiniLM embeddings." },
      { title: "Images", body: "Images become CLIP embeddings." },
      { title: "One ensemble", body: "An ensemble scores risk from the three views together." },
    ],
    stepVisuals: [{ focus: ["Tables"] }, { focus: ["PDF text"] }, { focus: ["Images"] }, { focus: ["Ensemble", "Risk"] }],
    stepsShape: "plate",
    stepsScreens: 2,
    stack: [{ label: "CLIP" }, { label: "MiniLM" }],
    links: [],
    diagram: "multimodal",
  },
  {
    slug: "pg-case",
    name: "P&G business case",
    h1: "First place at the P&G engineering business case",
    line: "First place: an AI-driven market expansion plan for a $78M budget.",
    summary:
      "An AI-driven market expansion strategy that allocated a $78M budget by demographic segment. First place at the P&G Engineering Business Case Competition, October 2025.",
    statement:
      "A $78M market expansion budget, divided by demographic segment with an AI-driven plan and presented to the judges as one deck: first place in October 2025.",
    card: { k: "P&G Engineering Business Case", v: "1st place, $78M budget" },
    when: "October 2025",
    year: "2025",
    tags: ["Competition"],
    facts: [
      { label: "Result", value: "1st place" },
      { label: "Budget", value: "$78M" },
      { label: "Method", value: "Demographic segmentation" },
      { label: "Competition", value: "P&G Engineering Business Case" },
    ],
    stepsHeading: "How the case was built",
    steps: [
      { title: "Segment the market", body: "Demographic segmentation divided the market the expansion would enter." },
      { title: "Optimise the budget", body: "An AI-driven plan set how the $78M budget was spent across the segments." },
      { title: "Present it", body: "The strategy went to the judges as one deck, linked on this page." },
    ],
    stack: [],
    links: [{ label: "See the deck", href: "https://www.canva.com/design/DAG03M90MS0/jjAx7TqXPSb97h2F3ZTiqQ/edit" }],
    diagram: "case",
  },
  {
    slug: "wealthtracker",
    name: "Personal WealthTracker",
    h1: "Personal WealthTracker for shared accounts",
    line: "Personal and joint accounts on Clean Architecture, with 93% JUnit coverage.",
    summary:
      "A full-stack finance app for personal and joint accounts, built on Clean Architecture and SOLID, with 93% JUnit test coverage.",
    statement:
      "Personal and joint accounts in one app: two or more people record cash flow into one synchronised account, on a Clean Architecture codebase with 93% JUnit test coverage.",
    card: { k: "Test coverage", v: "93% JUnit" },
    when: "",
    year: "",
    tags: ["Software"],
    facts: [
      { label: "Architecture", value: "Clean Architecture, SOLID" },
      { label: "Test coverage", value: "93% JUnit" },
      { label: "Accounts", value: "Personal and joint" },
      { label: "Stack", value: "Spring Boot, React" },
    ],
    stepsHeading: "What it does",
    steps: [
      { title: "Joint accounts", body: "Two or more users record cash flow in one shared, synchronised account." },
      { title: "One-time and periodic transactions", body: "Each inflow and outflow is recorded with its own note, once or on a schedule." },
      { title: "A spoken financial report", body: "The report reads itself aloud when it opens." },
    ],
    stack: [
      { label: "Java", icon: "java" },
      { label: "Spring", icon: "spring" },
      { label: "React", icon: "react" },
    ],
    links: [{ label: "See the code", href: "https://github.com/chenj926/Accounting_System", icon: "github" }],
    diagram: "clean-architecture",
  },
];

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
