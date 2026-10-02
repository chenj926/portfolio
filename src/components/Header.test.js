import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import { documents } from "../data/profile";

afterEach(() => {
  window.history.replaceState(null, "", "/portfolio/");
});

test("exposes two distinct document links", () => {
  render(<Header onThemeToggle={jest.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: /resume\/cv/i }));

  const resume = screen.getByRole("menuitem", { name: "Resume" });
  const cv = screen.getByRole("menuitem", { name: "CV" });

  expect(resume).toHaveAttribute("href", documents[0].url);
  expect(cv).toHaveAttribute("href", documents[1].url);
  expect(resume.getAttribute("href")).not.toBe(cv.getAttribute("href"));
  expect(resume).toHaveFocus();
});

test.each(["{Enter}", " "])(
  "moves focus into the documents menu when activated with %j",
  async (key) => {
    const user = userEvent.setup();
    render(<Header onThemeToggle={jest.fn()} />);
    screen.getByRole("button", { name: /resume\/cv/i }).focus();

    await user.keyboard(key);

    expect(screen.getByRole("menuitem", { name: "Resume" })).toHaveFocus();
  },
);

test("supports keyboard menu navigation, Escape, and activation focus return", () => {
  render(<Header onThemeToggle={jest.fn()} />);
  const trigger = screen.getByRole("button", { name: /resume\/cv/i });

  trigger.focus();
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  const resume = screen.getByRole("menuitem", { name: "Resume" });
  const cv = screen.getByRole("menuitem", { name: "CV" });
  expect(document.activeElement).toBe(resume);

  fireEvent.keyDown(resume, { key: "End" });
  expect(document.activeElement).toBe(cv);

  fireEvent.keyDown(cv, { key: "Escape" });
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(document.activeElement).toBe(trigger);

  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("menuitem", { name: "CV" }));
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(document.activeElement).toBe(trigger);
});

test("dismisses the documents menu on outside click or focus", () => {
  render(<Header onThemeToggle={jest.fn()} />);
  const trigger = screen.getByRole("button", { name: /resume\/cv/i });
  const themeToggle = screen.getByRole("button", {
    name: /switch to light mode/i,
  });

  fireEvent.click(trigger);
  fireEvent.pointerDown(themeToggle);
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();

  trigger.focus();
  fireEvent.click(trigger);
  act(() => themeToggle.focus());
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

test("dismisses mobile navigation when the visitor clicks outside", () => {
  render(<Header onThemeToggle={jest.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
  expect(
    screen.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeInTheDocument();
  fireEvent.pointerDown(document.body);
  expect(
    screen.queryByRole("navigation", { name: "Mobile navigation" }),
  ).not.toBeInTheDocument();
});

test("calls the theme callback and keeps section links as native hashes on detail routes", () => {
  const onThemeToggle = jest.fn();
  window.history.replaceState(null, "", "/portfolio/#/project/example");
  render(<Header theme="dark" onThemeToggle={onThemeToggle} />);

  fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
  expect(onThemeToggle).toHaveBeenCalledTimes(1);

  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
    "href",
    "#home-section",
  );
  const researchLink = screen.getByRole("link", { name: "Research" });
  expect(researchLink).toHaveAttribute("href", "#research-section");
  expect(fireEvent.click(researchLink)).toBe(true);
});
