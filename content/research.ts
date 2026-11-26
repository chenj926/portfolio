// Papers and research in progress. Every figure and claim comes from the CV (2026), a repository's README or
// result notes, or the previous site's data; nothing here is estimated. One entry is one page:
// /research/<slug>/ is built from it, and the home, the Research page, the menu and the footer list it.
// How to add one: docs/ADDING-CONTENT.md.
import type { DiagramId } from "@/components/Diagrams";
import type { Pic } from "@/lib/site";

export interface Link {
  label: string; // a verb and what the visitor gets: "Read the paper", "Watch the demo"
  href: string;
  icon?: string; // an icon in public/icons (scripts/build-icons.mjs), e.g. "github"
}

export interface Point {
  title: string;
  body: string;
}

/** A large number that rolls into place (counter-rolls), with what it counts. */
export interface Figure {
  v: string; // "98.3%", "37M"
  k: string; // what it counts
  note?: string;
}

export interface ResultRow {
  task: string;
  metric: string;
  better: "higher" | "lower";
  baseline: string;
  result: string;
  setting: string;
}

export interface Research {
  slug: string;
  kind: "paper" | "work" | "study"; // a paper (published or a manuscript), research in progress, or a finished study
  short: string; // its short name in menus, the footer and window bars
  title: string; // the full title (a paper's as published)
  h1: string; // the page's headline: what it is, in plain words (55 characters at most)
  status: string; // the venue, "Manuscript", "In progress" or, for a study, "Finished in April 2026"
  year: string;
  period?: string; // "January 2026 to now"
  authors?: string[];
  institution: string;
  advisor: string;
  summary: string; // one or two sentences; the first is the page's lead on a phone
  statement: string; // the paragraph that lights up word by word (12 to 40 words)
  pointsHeading: string;
  points: Point[];
  card: { k: string; v: string }; // the headline figure on the hero's card
  figures?: Figure[]; // three, for the figures section
  results?: ResultRow[]; // a table of before-and-after results (a paper)
  resultsHead?: { title: string; run: string }; // the heading over results, figures or experiments
  resultNote?: string;
  experiments?: string[];
  origin?: string;
  links: Link[]; // the first is the hero's main button
  figure?: Pic; // the main picture or the paper's figure
  gallery?: Pic[]; // three more frames
  diagram?: DiagramId; // a drawn diagram where there is no figure
  bibtex?: string;
  pages?: string; // the pages in the proceedings, for the citation section
  tile?: { title: string; line: string }; // its tile in the home's research in progress
}

export const research: Research[] = [
  {
    slug: "hmitl",
    kind: "paper",
    short: "HMITL",
    title:
      "HMITL: Manager-Governed LLM Iteration with Guardrails and Rollback for Reproducible Healthcare Machine Learning Pipelines",
    h1: "HMITL, a protocol for LLM-built healthcare ML pipelines",
    status: "IEEE ICHI 2026",
    year: "2026",
    authors: ["Jialuo Chen", "Haijing Wang", "Siyu Shao"],
    institution: "",
    advisor: "",
    summary:
      "A human manager decides which pipeline changes an LLM may keep: the manager holds the task brief, the data-integrity guardrails, a deterministic evaluation and the right to roll back.",
    statement:
      "HMITL separates proposing a change from accepting it. A builder LLM proposes, a consultant LLM critiques, and the human manager admits evidence, enforces guardrails, evaluates deterministically and rolls back regressions.",
    pointsHeading: "Six parts of the protocol",
    points: [
      { title: "Builder LLM", body: "Proposes concrete changes to the pipeline." },
      { title: "Consultant LLM", body: "Critiques each proposal on its own, before anything runs." },
      { title: "Human manager", body: "Keeps the task brief, the operating regime, the guardrails and the acceptance criteria." },
      { title: "Evaluation harness", body: "Scores every candidate and checks the data-integrity constraints." },
      { title: "Acceptance and rollback", body: "Keeps the best-known pipeline, or restores it after a regression." },
      { title: "Artifact store", body: "Records decisions, metrics and experiment traces for audit." },
    ],
    card: { k: "30-day readmission, Macro-F1", v: "0.6198 to 0.9014" },
    results: [
      { task: "30-day readmission", metric: "Macro-F1", better: "higher", baseline: "0.6198", result: "0.9014", setting: "Competition window" },
      { task: "Emergency department cost forecasting", metric: "MAE", better: "lower", baseline: "701.19", result: "447.95", setting: "After the competition, official evaluation interface" },
      { task: "Discharge readiness", metric: "Macro-F1", better: "higher", baseline: "0.4889", result: "0.8408", setting: "Controlled study, 15 iterations" },
    ],
    resultsHead: { title: "Results on three AgentDS-Healthcare tasks.", run: "Before and after HMITL." },
    resultNote:
      "On discharge readiness, multi-window arbitration with rollback scored highest and also had the smallest maximum drawdown and adjacent-iteration variance of the variants tested.",
    origin:
      "Evaluated on three multimodal AgentDS-Healthcare tasks: structured records, clinical text, PDF receipts and time series. The work began at the AgentDS hackathon in December 2025, where we placed 2nd in Commerce and 4th overall.",
    links: [
      { label: "Read the paper", href: "https://ieeexplore.ieee.org/document/11634837" },
      { label: "See the code", href: "https://github.com/chenj926/ICHI_AgentDS_clai", icon: "github" },
      { label: "Open the dataset", href: "https://huggingface.co/datasets/lainmn/AgentDS-Healthcare", icon: "hugging-face" },
    ],
    figure: { name: "hmitl-architecture", widths: [700, 1008], w: 1008, h: 1440, alt: "The HMITL protocol: a builder LLM and a consultant LLM propose and critique pipeline changes; the human manager, the evaluation harness and the artifact store decide what is kept or rolled back." },
    bibtex: `@INPROCEEDINGS{11634837,
  author={Chen, Jialuo and Wang, Haijing and Shao, Siyu},
  booktitle={2026 IEEE 14th International Conference on Healthcare Informatics (ICHI)},
  title={HMITL: Manager-Governed LLM Iteration with Guardrails and Rollback for Reproducible Healthcare Machine Learning Pipelines},
  year={2026},
  pages={1218-1226},
  doi={10.1109/ICHI69079.2026.00156}
}`,
    pages: "1218 to 1226",
  },
  {
    slug: "ra-bouu",
    kind: "paper",
    short: "RA-BOUU",
    title: "Role-Aware Learning for Bayesian Optimization under Uncertainty",
    h1: "Role-aware Bayesian optimization under uncertainty",
    status: "Manuscript",
    year: "2026",
    period: "January 2025 to May 2026",
    authors: ["Jialuo Chen", "Justin Beland"],
    institution: "University of Toronto",
    advisor: "Prof. Justin Beland",
    summary:
      "Bayesian optimization that treats decision, execution and environmental inputs differently, to choose experiments for the performance a design will have once it is deployed. My undergraduate thesis (MIE498Y1).",
    statement:
      "RA-BOUU gives each input a role. Decisions are chosen, execution noise is averaged out, and the environment is sampled where it most reduces uncertainty about average deployment performance.",
    pointsHeading: "Three parts of the method",
    points: [
      { title: "Input roles", body: "Decision inputs are chosen, execution noise perturbs how they are carried out, and environmental conditions can only be sampled in a simulator." },
      { title: "Multiscale execution kernels", body: "Capture local sensitivity and broader correlations across perturbed inputs; analytic and semi-analytic marginalization estimate expected deployment performance." },
      { title: "Target-aligned acquisition", body: "Picks the environmental condition for each simulator run by its expected reduction in uncertainty about average deployment performance under execution noise." },
    ],
    card: { k: "Quadrotor control, three wind distributions", v: "Ahead of 4 robust BO baselines" },
    figures: [
      { v: "4", k: "robust Bayesian optimization baselines", note: "lower mean control cost and crash rate than each" },
      { v: "3", k: "wind distributions", note: "for a simulated quadrotor, in Python" },
      { v: "10", k: "optimization runs per setting" },
    ],
    resultsHead: { title: "Experiments.", run: "Quadrotor control and bandit portfolios." },
    experiments: [
      "Simulated quadrotor control in Python: lower mean control cost and crash rate than four robust Bayesian optimization baselines, across three wind distributions with 10 optimization runs per setting.",
      "An extension with multi-armed bandit portfolios that choose the control and noise acquisition functions reached lower mean robust objective values than BOUU with a fixed noise acquisition, in preliminary Branin and Hartmann3 tests.",
    ],
    links: [],
    diagram: "roles",
  },
  {
    slug: "xr-world-models",
    kind: "work",
    short: "XR World Models",
    title: "XR World Models: an egocentric world model for XR headsets",
    h1: "XR World Models, an egocentric world model for XR",
    status: "In progress",
    year: "2026",
    period: "May 2026 to now",
    institution: "University of Toronto",
    advisor: "Prof. Scott Sanner",
    summary:
      "An egocentric world model for XR headsets that tracks the identity, 3D position and category of each object, so an embodied LLM assistant built on it can answer questions and recommend products. A team of eight; I built its baseline tracker.",
    statement:
      "The assistant has to recommend the chair you are looking at, not one like it. The world model keeps each object's identity, position and category, and the tracker tells lookalikes apart across viewpoints.",
    pointsHeading: "What I built",
    points: [
      { title: "A category-agnostic tracker", body: "The baseline tracker keeps each object's identity without knowing its category: 118 of 120 correct identities on more than 10 lookalike items over 10 runs. Newer trackers such as WhareFormer are compared against it." },
      { title: "World-state updates with revision checks", body: "Perception runs asynchronously, and a result computed from an outdated revision of the world state is rejected, so the assistant's answers stay on the right objects across turns." },
      { title: "An architecture to build on", body: "I co-designed the system's architecture and led the refactor of the tracker and the world state." },
    ],
    card: { k: "Correct identities, lookalike items", v: "118 of 120" },
    figures: [
      { v: "98.3%", k: "correct identities", note: "118 of 120 on lookalike items, over 10 runs" },
      { v: "10+", k: "lookalike items in the tests" },
      { v: "8", k: "people on the team", note: "I co-designed the architecture" },
    ],
    resultsHead: { title: "Research in numbers.", run: "University of Toronto, since May 2026." },
    links: [{ label: "Watch the demo", href: "https://youtu.be/eZmH-vjMc24" }],
    figure: { name: "d3m-demo", widths: [584, 702], w: 702, h: 702, alt: "The XR demo: a headset view of a room with shoes on a table, each marked by the assistant with its name and details." },
    gallery: [
      { name: "d3m-f1", widths: [584], w: 584, h: 583, alt: "A frame from the demo: the assistant marks objects in the room." },
      { name: "d3m-f2", widths: [584], w: 584, h: 583, alt: "A second frame from the demo, from another viewpoint." },
      { name: "d3m-f3", widths: [584], w: 584, h: 583, alt: "A third frame from the demo, with the recommendation shown." },
    ],
    tile: {
      title: "XR World Models, an egocentric world model for XR",
      line: "Tracks each object's identity, position and category; my tracker kept 118 of 120 identities right.",
    },
  },
  {
    slug: "surgical-deltanet",
    kind: "work",
    short: "Surgical DeltaNet",
    title: "Surgical DeltaNet: selective memory updates for linear attention",
    h1: "Surgical DeltaNet, selective memory for linear attention",
    status: "In progress",
    year: "2026",
    period: "January 2026 to now, remote",
    institution: "Shanghai Jiao Tong University",
    advisor: "Prof. Shuai Li",
    summary:
      "A learned row scope on Gated DeltaNet-2 decides which rows of the recurrent state each update may erase and write. The question is how a model takes in new information and keeps what is still true.",
    statement:
      "Linear attention keeps the past in a fixed-size state, so every write can overwrite something still true. Surgical DeltaNet lets each update open only the rows it needs, and holds the rest exactly.",
    pointsHeading: "How the study works",
    points: [
      { title: "A row scope at every layer", body: "A small learned projection, 512 to 16 to 512, selects which rows of the Gated DeltaNet-2 state an update may erase and write. Closed rows are held exactly." },
      { title: "A matched comparison", body: "A preregistered, paired comparison against Gated DeltaNet-2 and KDA, with the same backbone, data order and budget: 37M parameters, about 1B FineWeb-Edu tokens, 4K context." },
      { title: "Tests on FineWeb-Edu, LAMBADA and RULER", body: "FineWeb-Edu test perplexity, LAMBADA accuracy and perplexity on all 5,153 examples, and RULER needle retrieval, S-NIAH and multi-key, from 2K to 16K tokens." },
      { title: "Stable gradients through the row scope", body: "Two fused scans rebuild the state and adjoint product inside each 64-token chunk, instead of dividing the gradient by a tiny decay, which amplifies cancellation." },
      { title: "A preregistered decision for each study", body: "Each run is judged against preregistered thresholds on perplexity, LAMBADA accuracy and a counterbalanced needle contrast." },
    ],
    card: { k: "Tested on", v: "FineWeb-Edu, LAMBADA and S-NIAH" },
    figures: [
      { v: "37M", k: "parameters in each model", note: "Surgical DeltaNet, Gated DeltaNet-2 and KDA, matched" },
      { v: "1B", k: "FineWeb-Edu tokens per model", note: "4K context, the same data order" },
      { v: "16K", k: "tokens in the longest needle test", note: "RULER S-NIAH and multi-key, from 2K up" },
    ],
    resultsHead: { title: "The study in numbers.", run: "Shanghai Jiao Tong University, remote, since January 2026." },
    links: [],
    diagram: "surgical",
    tile: {
      title: "Surgical DeltaNet, selective memory for linear attention",
      line: "Compared with Gated DeltaNet-2 and KDA on FineWeb-Edu, LAMBADA and S-NIAH needle retrieval.",
    },
  },
  {
    slug: "hidden-state-steering",
    kind: "study",
    short: "Hidden-state steering",
    title: "Hidden-state steering for math reasoning in Qwen3-0.6B",
    h1: "Hidden-state steering, tested against random directions",
    status: "Finished in April 2026",
    year: "2026",
    period: "April 2026",
    institution: "Shanghai Jiao Tong University",
    advisor: "Prof. Shuai Li",
    summary:
      "A study of whether adding a reasoning direction to Qwen3-0.6B's hidden states helps it solve grade-school math. On all 1,319 GSM8K test problems the gains stayed within noise, and random directions of the same size did as well.",
    statement:
      "Steering moved GSM8K accuracy by about half a point, inside the 1.4-point standard error, and random directions of the same norm scored from 50.1% to 52.3% against a 50.9% baseline.",
    pointsHeading: "How the study ran",
    points: [
      { title: "A direction from chain-of-thought", body: "Each steering vector is the difference between the model's hidden states at the end of a chain-of-thought prompt and of a plain prompt, taken per question or averaged over 32 GSM8K training questions." },
      { title: "The vector in Qwen3-0.6B's last three layers", body: "The vector is added at strength 0.1 to the last three decoder layers of Qwen3-0.6B while it answers, and each hidden state is rescaled to its original norm." },
      { title: "All of GSM8K's test set", body: "Every run answers the 1,319 test problems and is scored by exact match on the extracted answer, with prompts aligned to the Lighteval task definitions." },
      { title: "Random-rotation controls", body: "Nine controls rotate the vector inside random 2D and 3D subspaces, keeping its norm, so a gain has to beat directions of the same size that point elsewhere." },
    ],
    card: { k: "GSM8K, against random directions", v: "Within noise" },
    figures: [
      { v: "1,319", k: "GSM8K test problems in every run" },
      { v: "50.9%", k: "accuracy without steering", note: "standard error 1.4 points" },
      { v: "9", k: "random-direction controls", note: "from 50.1% to 52.3%" },
    ],
    resultsHead: { title: "The study in numbers.", run: "Shanghai Jiao Tong University, remote, April 2026." },
    links: [{ label: "See the code", href: "https://github.com/chenj926/reasoning_hidden_state", icon: "github" }],
    diagram: "steering",
  },
];

export const papers = research.filter((r) => r.kind === "paper");
export const currentWork = research.filter((r) => r.kind === "work");
export const studies = research.filter((r) => r.kind === "study");
export const findResearch = (slug: string) => research.find((r) => r.slug === slug);
/** "IEEE ICHI 2026", "Manuscript, 2026", "In progress" */
export const statusLine = (r: Research) => (r.status === "Manuscript" ? `Manuscript, ${r.year}` : r.status);
