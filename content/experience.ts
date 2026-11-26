// Research positions, industry roles, education and dated news, from the CV (2026) and the previous site's
// news. Lists run newest first; the home and the Experience section show them in this order.
// How to add an entry: docs/ADDING-CONTENT.md.
import type { MarkId } from "./marks";

/** A research position: the role, where, with whom, and the research pages it led to. */
export interface Position {
  role: string;
  institution: string;
  mark: MarkId;
  advisor: string;
  group: string; // the lab or group's own name, shown small
  when: string;
  topic: string;
  research?: string; // the slug of its research page (content/research.ts), if it has one
}

export const positions: Position[] = [
  {
    role: "AI Research Assistant",
    institution: "University of Toronto",
    mark: "uoft",
    advisor: "Prof. Scott Sanner",
    group: "Data-Driven Decision Making Lab",
    when: "May 2026 to now",
    topic: "XR World Models, an egocentric world model",
    research: "xr-world-models",
  },
  {
    role: "Deep Learning Research Assistant",
    institution: "Shanghai Jiao Tong University",
    mark: "sjtu",
    advisor: "Prof. Shuai Li",
    group: "Li Shuai Research Lab",
    when: "January 2026 to now, remote",
    topic: "Selective memory for linear attention",
    research: "surgical-deltanet",
  },
  {
    role: "Machine Learning Research Assistant",
    institution: "University of Toronto",
    mark: "uoft",
    advisor: "Prof. Justin Beland",
    group: "JB Research Group",
    when: "January 2025 to May 2026",
    topic: "Bayesian optimization under uncertainty",
    research: "ra-bouu",
  },
];

export interface Job {
  org: string;
  role: string; // the title, or "" where the CV gives none
  when: string;
  where: string;
  mark?: MarkId; // without one, the entry shows the organization's initial
  topic: string; // what the work was about, in a line
  points: string[];
}

export const jobs: Job[] = [
  {
    org: "JANA Corporation",
    role: "Junior Software Developer",
    when: "May 2025 to May 2026",
    where: "Aurora, Ontario",
    mark: "jana",
    topic: "Reliability models and risk software for pipelines",
    points: [
      "Built a Python reliability model for large-load metering systems: Bayesian model averaging over failure-rate estimates, with 12 threats aggregated through fault trees.",
      "Delivered React and TypeScript confirmation flows for Lighthouse TIMP, a pipeline risk platform, so compute-heavy simulations start only after the user confirms.",
      "Fixed C# and .NET filtering with LINQ so exported datasets match the selected pipeline segments, checked by 20+ regression tests.",
    ],
  },
  {
    org: "Centivizer",
    role: "",
    when: "2024",
    where: "",
    topic: "Onboarding and data pipelines for research games",
    points: ["Improved onboarding for research games, packaged data pipelines as JSON and refined the navigation."],
  },
  {
    org: "Cellinemory",
    role: "",
    when: "2023",
    where: "",
    topic: "A Shopify storefront and diffusion product images",
    points: ["Rebuilt the Shopify storefront, moved its custom domain and tuned diffusion workflows for product images."],
  },
];

export interface Education {
  school: string;
  mark: MarkId;
  degree: string; // "BASc in Industrial Engineering"
  focus: string; // what the degree is weighted towards, in a line
  when: string;
  short: string; // the years, for tight places: "2022 to 2027"
  minors?: string[];
  thesis?: string;
  honours?: string;
  courses?: { code: string; name: string }[];
}

// newest first: the hero shows the first entry, the Experience section all of them
export const education: Education[] = [
  {
    school: "University of Toronto",
    mark: "uoft",
    degree: "BASc in Industrial Engineering",
    focus: "Focus in AI and ML, with PEY Co-op",
    when: "September 2022 to June 2027",
    short: "2022 to 2027",
    minors: ["Computer Science", "Artificial Intelligence in Engineering", "Engineering Business"],
    thesis: "Role-Aware Bayesian Optimization under Uncertainty (MIE498Y1), advised by Prof. Justin Beland",
    honours: "Dean's Honours List four times",
    courses: [
      { code: "MIE370, MIE424", name: "Machine Learning" },
      { code: "APS360", name: "Deep Learning" },
      { code: "MIE369", name: "Artificial Intelligence" },
      { code: "MIE567", name: "Reinforcement Learning" },
      { code: "MIE524", name: "Data Mining" },
      { code: "MIE451", name: "Decision Support Systems" },
      { code: "MIE245", name: "Data Structures and Algorithms" },
      { code: "MIE353", name: "Databases" },
      { code: "CSC207, MIE350", name: "Software Design" },
    ],
  },
];

export interface Update {
  when: string;
  what: string;
  href?: string; // a page on this site ("/research/hmitl/") or an outside link
}

// newest first; the home shows the first four
export const updates: Update[] = [
  { when: "September 2026", what: "Began the MIE490 capstone as technical lead", href: "/projects/xr-capstone/" },
  { when: "2026", what: "HMITL is published at IEEE ICHI 2026", href: "/research/hmitl/" },
  { when: "May 2026", what: "Began XR research with Prof. Scott Sanner at UofT", href: "/research/xr-world-models/" },
  { when: "Winter 2026", what: "Dean’s Honours List, a fourth time" },
  { when: "January 2026", what: "Began linear-attention research with Prof. Shuai Li at SJTU, remotely", href: "/research/surgical-deltanet/" },
  { when: "December 2025", what: "AgentDS hackathon: 2nd in Commerce, 4th overall" },
  { when: "November 2025", what: "Built ADHD Scholarship Copilot at a UofT hackathon", href: "/projects/adhd-copilot/" },
  { when: "October 2025", what: "1st place, P&G Engineering Business Case", href: "/projects/pg-case/" },
  { when: "May 2025", what: "Joined JANA as a junior software developer" },
  { when: "January 2025", what: "Began Bayesian optimization research with Prof. Justin Beland", href: "/research/ra-bouu/" },
];
