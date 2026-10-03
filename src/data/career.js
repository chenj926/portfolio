// Current dates and research summaries follow Jialuo_Chen_CV.pdf (2026).
// Earlier industry entries and archived news retain the original site's history.
export const industryExperience = [
  {
    organization: "JANA Corporation",
    role: "Junior Software Developer",
    period: "May 2025 – May 2026",
    location: "Aurora, ON",
    summary: "Reliability modelling and software for pipeline risk analysis.",
    contributions: [
      "Built a Python metering-reliability model with Bayesian model averaging and fault trees covering 12 threats.",
      "Delivered React / TypeScript confirmation flows for Lighthouse TIMP, coordinating asynchronous state before compute-intensive simulations.",
      "Corrected C# / .NET data filtering and export consistency, verified with 20+ regression tests.",
    ],
    skills: ["Python", "React · TypeScript", "C# · .NET"],
  },
  {
    organization: "Centivizer",
    period: "2024",
    summary:
      "Improved research-game onboarding, packaged data pipelines into JSON, and refined navigation for higher completion rates.",
    skills: ["Data pipelines", "UI development"],
  },
  {
    organization: "Cellinemory",
    period: "2023",
    summary:
      "Revamped the Shopify storefront, migrated its custom domain, and tuned diffusion workflows for visual merchandising.",
    skills: ["Shopify", "Diffusion models"],
  },
];

export const researchExperience = [
  {
    id: "sanner-lab",
    institution: "University of Toronto",
    lab: "Data-Driven Decision Making Lab",
    role: "Artificial Intelligence Research Assistant",
    period: "May 2026 – Present",
    advisor: "Prof. Scott Sanner",
    focus: "Embodied AI & persistent world state",
    summary:
      "Co-leading an immersive conversational recommendation demo: grounding an AR assistant in the same physical objects as the person using it.",
    contributions: [
      "Object re-identification combines RGB-D geometry with visual appearance; 98.3% accuracy in tests with 10+ shoes and chairs.",
      "Versioned, asynchronous world-state snapshots reject stale results, with stable test runs exceeding 10 minutes.",
      "Co-designed the architecture and led ReID / world-state refactoring, separating perception, storage, and core logic through explicit interfaces.",
    ],
    topics: ["Embodied AI", "Computer vision", "Human–AI collaboration"],
    link: { label: "Watch demo", href: "https://youtu.be/eZmH-vjMc24" },
  },
  {
    id: "li-lab",
    institution: "Shanghai Jiao Tong University",
    lab: "Li Shuai Research Lab",
    role: "Remote Deep Learning Research Assistant",
    period: "Jan 2026 – Present",
    advisor: "Prof. Shuai Li",
    focus: "Linear attention & language-model reasoning",
    summary:
      "Studying efficient context retrieval through attention-kernel and memory design, alongside hidden-state steering for mathematical reasoning.",
    contributions: [
      "Designed selective-retrieval kernels and a context-statistics memory branch, tested with distractor recall and language-model ablations on 100M+ tokens from The Pile.",
      "Investigated hidden-state steering in Qwen3.5-2B across source layers and injected reasoning prefixes up to 4,096 tokens.",
      "Exploring alternative reconstruction objectives and optimization steps for Gated DeltaNet expressivity.",
    ],
    topics: ["Linear attention", "LLM reasoning", "Deep learning"],
  },
  {
    id: "jb-group",
    institution: "University of Toronto",
    lab: "JB Research Group",
    role: "Machine Learning Research Assistant",
    period: "Jan 2025 – May 2026",
    advisor: "Prof. Justin Beland",
    focus: "Role-aware Bayesian optimization",
    summary:
      "Developed RA-BOUU for my undergraduate thesis: using input roles to guide modelling and experiment selection under execution and environmental uncertainty.",
    contributions: [
      "Built multiscale execution kernels and analytic / semi-analytic marginalization to model expected deployment performance.",
      "Designed acquisition rules that select simulator conditions for uncertainty reduction in average deployment performance.",
      "Evaluated quadrotor control against four robust-BO baselines across three wind distributions and ten optimization runs per setting; explored bandit-based acquisition portfolios on Branin and Hartmann3.",
    ],
    topics: ["Bayesian optimization", "Gaussian processes", "Decision making"],
    link: {
      label: "Related manuscript",
      href: "#/publication/role-aware-bayesian-optimization",
    },
  },
];

export const recentNews = [
  // Paper updates carry the venue year, not an inferred announcement date.
  {
    date: "ICHI 2026",
    category: "Publication",
    title: "HMITL at IEEE ICHI 2026",
    description:
      "Manager-governed LLM iteration for reproducible healthcare machine learning pipelines.",
    href: "#/publication/hmitl-manager-governed-llm-iteration",
  },
  {
    date: "NeurIPS 2026",
    category: "Under review",
    title: "Role-aware learning for Bayesian optimization",
    description: "Manuscript with Justin Beland, under review at NeurIPS 2026.",
    href: "#/publication/role-aware-bayesian-optimization",
  },
  {
    date: "May 2026",
    category: "Research",
    title: "Joined the Data-Driven Decision Making Lab",
    description:
      "Embodied conversational AI and persistent 3D world state with Prof. Scott Sanner at UofT.",
    href: "#research-section",
  },
  {
    date: "Winter 2026",
    category: "Honour",
    title: "Dean’s Honours List",
    description:
      "University of Toronto · Faculty of Applied Science & Engineering.",
  },
  {
    date: "Jan 2026",
    category: "Research",
    title: "Joined Li Shuai Research Lab",
    description:
      "Linear attention and language-model reasoning with Prof. Shuai Li at SJTU.",
    href: "#research-section",
  },
];

export const archivedNews = [
  {
    date: "Dec 2025",
    category: "Hackathon",
    title: "2nd in Commerce, 4th overall at AgentDS",
    description: "AgentDS Hackathon.",
    href: "https://agentds.org/",
  },
  {
    date: "Nov 2025",
    category: "Project",
    title: "Built ADHD Scholarship Copilot at the Claude AI Hackathon",
    description:
      "UofT AI × Claude AI · A focused, task-by-task scholarship workflow.",
    href: "https://github.com/chenj926/adhd-scholarship-copilot",
  },
  {
    date: "Oct 2025",
    category: "Award",
    title: "1st place · P&G Engineering Business Case Competition",
    description:
      "AI-driven market expansion strategy and demographic segmentation.",
    href: "#/work/pg-business-strategy",
  },
  {
    date: "May 2025",
    category: "Industry",
    title: "Joined JANA Corporation as a Junior Software Developer",
    description: "Reliability modelling and risk-platform engineering.",
    href: "#experience-section",
  },
  {
    date: "Jan 2025",
    category: "Research",
    title: "Joined JB Research Group",
    description:
      "Bayesian optimization under uncertainty with Prof. Justin Beland at UofT.",
    href: "#research-section",
  },
];
