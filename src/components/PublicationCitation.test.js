import { fireEvent, render, screen } from "@testing-library/react";
import PortfolioDetailPage from "./PortfolioDetailPage";
import { publications } from "../data/portfolio";
import { formatBibtex } from "./PublicationCitation";

const clipboardDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  "clipboard",
);
afterEach(() => {
  if (clipboardDescriptor)
    Object.defineProperty(navigator, "clipboard", clipboardDescriptor);
  else delete navigator.clipboard;
});

test("HMITL highlights the first author and shares a complete citation for copy and download", async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  render(<PortfolioDetailPage entry={publications[0]} />);
  const authors = document.querySelector(".portfolio-detail-authors");
  expect(authors).toHaveTextContent("Jialuo Chen, Haijing Wang, Siyu Shao");
  expect(authors.querySelector("strong")).toHaveTextContent("Jialuo Chen");
  expect(authors.querySelectorAll("strong")).toHaveLength(1);
  const paper = screen.getByRole("link", {
    name: "Paper (opens in a new tab)",
  });
  expect(paper).toHaveClass("portfolio-action", "material-surface");
  expect(paper).toHaveAttribute("rel", "noopener noreferrer");
  expect(paper).not.toHaveTextContent(/&nearr;/);
  expect(
    paper.querySelector('svg[data-icon="arrow-up-right-from-square"]'),
  ).toHaveAttribute("aria-hidden", "true");

  fireEvent.click(screen.getByRole("button", { name: "Copy BibTeX" }));
  expect(
    await screen.findByText("BibTeX copied to clipboard."),
  ).toHaveAttribute("role", "status");
  const citation = writeText.mock.calls[0][0];
  expect(citation).toBe(formatBibtex(publications[0]));
  expect(citation).toContain("Jialuo Chen and Haijing Wang and Siyu Shao");
  expect(citation).toContain("10.1109/ICHI69079.2026.00156");
  expect(citation).toContain("pages = {1218--1226}");
  const download = screen.getByRole("link", { name: "Download .bib" });
  expect(decodeURIComponent(download.getAttribute("href").split(",")[1])).toBe(
    citation,
  );
  expect(download).toHaveAttribute("download", "chen2026hmitl.bib");
});

test("clipboard denial leaves selectable BibTeX and a working download", async () => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: jest.fn().mockRejectedValue(new Error("Denied")) },
  });
  render(<PortfolioDetailPage entry={publications[0]} />);
  const copy = screen.getByRole("button", { name: "Copy BibTeX" });
  fireEvent.click(copy);
  expect(await screen.findByText(/Copy is unavailable/)).toBeInTheDocument();
  expect(screen.getByLabelText("BibTeX citation")).toHaveTextContent(
    "@inproceedings{chen2026hmitl,",
  );
  expect(screen.getByRole("link", { name: "Download .bib" })).toHaveAttribute(
    "download",
  );
  expect(copy).toHaveAttribute("aria-disabled", "false");
});

test("unpublished manuscript does not fabricate a citation or public-paper link", () => {
  render(<PortfolioDetailPage entry={publications[1]} />);
  expect(
    screen.queryByRole("button", { name: "Copy BibTeX" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText(/A public paper link is not available yet/),
  ).toBeInTheDocument();
});
