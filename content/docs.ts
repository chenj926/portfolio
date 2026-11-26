// The CV and the résumé: the PDFs and their page images in public/docs. The phone number and street address
// are taken out of both before they are published (scripts/doc-pages.py checks; see docs/ADDING-CONTENT.md).
export interface Doc {
  id: string; // the reader opens on it with /cv/?doc=<id>#read
  label: string; // "CV"
  note: string; // what is in it, for the reader
  short: string; // for the home's hero: "Research, two pages"
  pages: string[]; // page image stems in public/docs, e.g. "cv-1" for cv-1-800.webp and cv-1-1275.webp
  pdf: string;
  download: string;
}

export const documents: Doc[] = [
  {
    id: "cv",
    label: "CV",
    note: "Two pages: education, papers, research, industry roles, projects and courses.",
    short: "Research, two pages",
    pages: ["cv-1", "cv-2"],
    pdf: "/docs/Jialuo_Chen_CV.pdf",
    download: "Download the CV",
  },
  {
    id: "resume",
    label: "Résumé",
    note: "One page for engineering roles: experience, projects and skills.",
    short: "Engineering, one page",
    pages: ["resume-1"],
    pdf: "/docs/Jialuo_Chen_Resume.pdf",
    download: "Download the résumé",
  },
];

/** The reader on the CV page, opened on one document. */
export const docHref = (d: Doc, i: number) => (i === 0 ? "/cv/#read" : `/cv/?doc=${d.id}#read`);
