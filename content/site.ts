// Who the site is about, and where to find him. Facts from the CV (2026) and the previous site's data.
export const person = {
  name: "Jialuo Chen",
  fullName: "Jialuo (Eric) Chen",
  zh: "陈佳洛",
  role: "AI researcher and engineer",
  city: "Toronto",
  email: "jialuo.chen@mail.utoronto.ca",
  availability: "Open to research and ML roles from 2027",
};

export const social = [
  { id: "google-scholar", label: "Google Scholar", href: "https://scholar.google.ca/citations?user=E_qNOCcAAAAJ&hl=en" },
  { id: "github", label: "GitHub", href: "https://github.com/chenj926" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/ericjialuochen/" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/ericchen7161/" },
  { id: "rednote", label: "RedNote", href: "https://www.xiaohongshu.com/user/profile/60b414de0000000001007140" },
] as const;

export const reddit = { id: "reddit", label: "Reddit", href: "https://www.reddit.com/user/Every-Movie7060/" };

export const mailto = `mailto:${person.email}`;

// the four pages beside home; "Research" opens a panel with the papers and the current work
export const nav = [
  { label: "Research", href: "/research/" },
  { label: "Projects", href: "/projects/" },
  { label: "About", href: "/about/" },
  { label: "CV", href: "/cv/" },
] as const;
