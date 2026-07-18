import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

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
