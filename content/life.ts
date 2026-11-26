// Life outside research and work: his own photographs and the previous site's hobby notes.
import type { Pic } from "@/lib/site";

export const portrait: Pic = { name: "portrait", widths: [800, 1360], w: 1363, h: 1704, alt: "Jialuo Chen at a table, leaning over a lit candle in a glass jar." };
export const avatar: Pic = { name: "portrait-square", widths: [160, 320], w: 1090, h: 1090, alt: "Jialuo Chen" };

export const pastimes = [
  {
    id: "guqin",
    title: "Guqin",
    body: "I play the guqin, the seven-string zither, and the guitar.",
    pic: { name: "guqin", widths: [640, 1280], w: 1280, h: 1600, alt: "Jialuo playing the guqin on a stage under a spotlight." } as Pic,
  },
  {
    id: "painting",
    title: "Oil painting",
    body: "I paint portraits in oils, sketch, and experiment with generative visuals.",
    pic: { name: "oil-painting", widths: [640, 1000], w: 1001, h: 1252, alt: "An oil portrait by Jialuo: a woman in a red jacket holding a blue-and-white porcelain vase, on an easel." } as Pic,
  },
  {
    id: "tennis",
    title: "Tennis",
    body: "I have played since I was twelve, and I am still after a cleaner serve.",
    pic: { name: "tennis", widths: [640, 696], w: 696, h: 870, alt: "Jialuo hitting a forehand on an indoor tennis court." } as Pic,
  },
  {
    id: "games",
    title: "Strategy games",
    body: "Quick rounds of Honor of Kings between projects, weekend soccer and strength training.",
    pic: { name: "honor-of-kings", widths: [640, 1000], w: 1008, h: 1260, alt: "An Honor of Kings rank screen showing the top tier." } as Pic,
  },
];

export const toolkit = [
  { group: "Languages", items: [["Python", "python"], ["C", "c"], ["Java", "java"], ["TypeScript", "typescript"], ["C#", "csharp"], ["R", "r"]] },
  { group: "Machine learning", items: [["PyTorch", "pytorch"], ["scikit-learn", "scikit-learn"], ["NumPy", "numpy"], ["pandas", "pandas"], ["OpenCV", "opencv"], ["Jupyter", "jupyter"]] },
  { group: "Systems and apps", items: [["React", "react"], ["FastAPI", "fastapi"], ["Spring", "spring"], [".NET", "dotnet"], ["PostgreSQL", "postgresql"], ["Docker", "docker"], ["Git", "git"], ["Linux", "linux"]] },
] as const;

export const methods = [
  "Bayesian optimization", "Gaussian processes", "Multi-armed bandits", "Reinforcement learning", "MCTS", "A* search",
  "Transformers", "Linear attention", "RAG", "LLM agents", "GANs", "RGB-D re-identification", "Ablation studies", "User studies",
];
