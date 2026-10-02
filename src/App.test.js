import { act, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { profile } from "./data/profile";

beforeEach(() => {
  window.history.replaceState(null, "", "/portfolio/");
  window.localStorage.clear();
});

test("renders the portfolio home and document controls", () => {
  window.history.replaceState(null, "", "/portfolio/");
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /Jialuo \(Eric\) Chen/i }),
  ).toBeInTheDocument();
  const documentsButton = screen.getByRole("button", { name: /resume\/cv/i });
  expect(documentsButton).toBeInTheDocument();

  fireEvent.click(documentsButton);
  const resumeLink = screen.getByRole("menuitem", { name: "Resume" });
  const cvLink = screen.getByRole("menuitem", { name: "CV" });
  expect(resumeLink.getAttribute("href")).not.toBe(cvLink.getAttribute("href"));
  expect(
    screen.getByRole("heading", { name: /Projects & Research/i }),
  ).toBeInTheDocument();
});

test("keeps contacts in the header and hero, with one owner-configured status", () => {
  render(<App />);
  for (const name of ["Social links", "Profile links"]) {
    const links = within(screen.getByRole("navigation", { name }));
    expect(links.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:jialuo.chen@mail.utoronto.ca",
    );
    expect(links.getByRole("link", { name: "Google Scholar" })).toHaveAttribute(
      "href",
      "https://scholar.google.ca/citations?user=E_qNOCcAAAAJ&hl=en",
    );
    expect(links.getAllByRole("link")).toHaveLength(5);
  }
  const status = screen.getByLabelText("Current status");
  expect(status).toHaveTextContent("Open to opportunities");
  expect(within(status).queryByRole("button")).not.toBeInTheDocument();
  expect(screen.queryByText("Open to collaborate")).not.toBeInTheDocument();
  const hero = document.getElementById("home-section");
  expect(hero).toHaveTextContent(/embodied conversational AI/);
  expect(hero).toHaveTextContent(
    /LLM reasoning, computer vision, Bayesian optimization/,
  );
  expect(hero).not.toHaveTextContent(
    /intuitive product design|Previously|\bNow\b|Open to AI Engineering/i,
  );
  expect(status).not.toHaveTextContent(/AI Engineering|Applied Research/);
});

test("theme persists, and remains usable with browser storage denied", () => {
  window.localStorage.setItem("portfolio-theme", "light");
  const view = render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(window.localStorage.getItem("portfolio-theme")).toBe("dark");
  view.unmount();

  const get = jest
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation(() => {
      throw new Error("Storage denied");
    });
  const set = jest
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("Storage denied");
    });
  try {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to light mode" }),
    );
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  } finally {
    get.mockRestore();
    set.mockRestore();
  }
});

test("owner configuration changes the single rendered status", () => {
  const previousStatus = profile.currentStatus;
  profile.currentStatus = "vacation";
  try {
    render(<App />);
    expect(screen.getByLabelText("Current status")).toHaveTextContent(
      "Currently on vacation",
    );
    expect(screen.queryByText("Open to opportunities")).not.toBeInTheDocument();
  } finally {
    profile.currentStatus = previousStatus;
  }
});

test("shared navigation returns from a project detail to its home section", () => {
  window.history.replaceState(null, "", "/portfolio/#/work/neurocommute-agent");
  render(<App />);
  expect(
    screen.getByRole("heading", { name: "NeuroCommute Agent", level: 1 }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("navigation", { name: "Social links" }),
  ).toBeInTheDocument();
  act(() => {
    window.history.replaceState(null, "", "/portfolio/#research-section");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  expect(
    screen.getByRole("heading", { name: /Jialuo \(Eric\) Chen/i }),
  ).toBeInTheDocument();
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
    behavior: "auto",
    block: "start",
  });
});
