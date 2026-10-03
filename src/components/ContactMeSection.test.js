import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import ContactMeSection from "./ContactMeSection";
import { profile } from "../data/profile";
import { downloadEmailDraft, openEmailDraft } from "../utils/emailDraft";

jest.mock("framer-motion", () => ({
  ...jest.requireActual("framer-motion"),
  useReducedMotion: () => false,
}));

jest.mock("./Material", () => {
  const React = require("react");
  return function MockMaterial({ as = "div", quiet, opaque, ...props }) {
    const Component = as;
    return <Component {...props} />;
  };
});

jest.mock("../utils/emailDraft", () => {
  const actual = jest.requireActual("../utils/emailDraft");
  return {
    ...actual,
    openEmailDraft: jest.fn(),
    downloadEmailDraft: jest.fn(),
  };
});

const openLetter = async () => {
  fireEvent.click(
    screen.getByRole("button", { name: "Open the letter to connect" }),
  );
  await act(async () => {
    jest.runAllTimers();
  });
};

const editBody = (body, html) => {
  body.innerHTML = html;
  fireEvent.input(body);
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  Element.prototype.scrollIntoView = jest.fn();
  openEmailDraft.mockResolvedValue({
    title: "Continue in your email app",
    description: "Review the draft and send it from your account.",
  });
  downloadEmailDraft.mockResolvedValue({
    title: "Your full draft is ready",
    description: "Formatting and attachments are included.",
  });
});

afterEach(() => {
  act(() => {
    jest.runAllTimers();
  });
  jest.useRealTimers();
});

const renderContact = () =>
  render(
    <ChakraProvider>
      <ContactMeSection />
    </ChakraProvider>,
  );

test("folding and reopening keeps the visitor's letter and attachments", async () => {
  const { container } = renderContact();
  const seal = screen.getByRole("button", {
    name: "Open the letter to connect",
  });
  const letterId = seal.getAttribute("aria-controls");
  const letter = container.querySelector(`#${letterId}`);

  fireEvent.click(seal);
  expect(letter).toHaveAttribute("aria-hidden", "true");
  await act(async () => {
    jest.advanceTimersByTime(1500);
  });
  expect(letter).toHaveAttribute("aria-hidden", "true");
  await act(async () => {
    jest.advanceTimersByTime(700);
  });

  const subject = screen.getByLabelText("Subject");
  const body = screen.getByRole("textbox", { name: "Letter content" });
  fireEvent.change(subject, { target: { value: "A thoughtful conversation" } });
  editBody(body, "<p>Could we exchange a few ideas?</p>");

  const file = new File(["meeting notes"], "meeting-notes.txt", {
    type: "text/plain",
  });
  fireEvent.change(container.querySelector('input[type="file"]'), {
    target: { files: [file] },
  });
  expect(screen.getByText("meeting-notes.txt")).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Fold the letter and keep this draft" }),
  );
  expect(letter).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByRole("link", { name: profile.email })).toHaveFocus();
  await act(async () => {
    jest.runAllTimers();
  });
  expect(seal).toHaveFocus();

  await openLetter();
  expect(screen.getByLabelText("Subject")).toHaveValue(
    "A thoughtful conversation",
  );
  expect(
    screen.getByRole("textbox", { name: "Letter content" }),
  ).toHaveTextContent("Could we exchange a few ideas?");
  expect(screen.getByText("meeting-notes.txt")).toBeInTheDocument();
});

test("validates the body and preserves it when native handoff fails", async () => {
  openEmailDraft.mockRejectedValue(
    new Error("The email app could not be opened."),
  );
  const { container } = renderContact();
  await openLetter();

  fireEvent.change(screen.getByLabelText("Subject"), {
    target: { value: "A question about your research" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Open email app" }));

  const body = screen.getByRole("textbox", { name: "Letter content" });
  expect(body).toHaveAttribute("aria-invalid", "true");
  expect(body).toHaveFocus();
  expect(
    screen.getByText("Write a few words before opening your draft."),
  ).toBeInTheDocument();
  expect(openEmailDraft).not.toHaveBeenCalled();

  editBody(body, "<p>Could we discuss your recent work?</p>");
  fireEvent.click(screen.getByRole("button", { name: "Open email app" }));
  await act(async () => {
    await Promise.resolve();
  });

  expect(openEmailDraft).toHaveBeenCalledWith({
    from: "",
    cc: "",
    subject: "A question about your research",
    html: "<p>Could we discuss your recent work?</p>",
    attachments: [],
  });
  expect(screen.getByRole("alert")).toHaveTextContent(
    "The email app could not be opened.",
  );
  expect(container.querySelector(".contact-scene")).toHaveAttribute(
    "data-phase",
    "open",
  );
  expect(screen.getByLabelText("Subject")).toHaveValue(
    "A question about your research",
  );
  expect(body).toHaveTextContent("Could we discuss your recent work?");
});

test("the full-draft action keeps formatting and files in its payload", async () => {
  const { container } = renderContact();
  await openLetter();

  fireEvent.change(screen.getByLabelText("Subject"), {
    target: { value: "A note with a file" },
  });
  const body = screen.getByRole("textbox", { name: "Letter content" });
  editBody(body, "<p><strong>Thank you</strong> for sharing your work.</p>");

  const file = new File(["paper"], "paper.pdf", { type: "application/pdf" });
  fireEvent.change(container.querySelector('input[type="file"]'), {
    target: { files: [file] },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save full draft" }));
  await act(async () => {
    await Promise.resolve();
  });

  expect(downloadEmailDraft).toHaveBeenCalledWith({
    from: "",
    cc: "",
    subject: "A note with a file",
    html: "<p><strong>Thank you</strong> for sharing your work.</p>",
    attachments: [file],
  });
  expect(screen.getByRole("status")).toHaveTextContent(
    "Your full draft is ready",
  );
  expect(screen.getByText("paper.pdf")).toBeInTheDocument();
  await act(async () => {
    jest.runAllTimers();
  });
});

test("an export keeps the letter open until the full draft is ready", async () => {
  let finishExport;
  downloadEmailDraft.mockImplementation(
    () =>
      new Promise((resolve) => {
        finishExport = resolve;
      }),
  );
  const { container } = renderContact();
  await openLetter();
  fireEvent.change(screen.getByLabelText("Subject"), {
    target: { value: "A draft in progress" },
  });
  const body = screen.getByRole("textbox", { name: "Letter content" });
  editBody(body, "<p>Thank you for your work.</p>");
  fireEvent.click(screen.getByRole("button", { name: "Save full draft" }));
  fireEvent.keyDown(body, { key: "Escape" });
  expect(container.querySelector(".contact-scene")).toHaveAttribute(
    "data-phase",
    "open",
  );
  expect(screen.getByRole("button", { name: "Saving draft…" })).toBeDisabled();
  await act(async () => {
    finishExport({ title: "Your full draft is ready" });
  });
  expect(container.querySelector(".contact-scene")).toHaveAttribute(
    "data-phase",
    "folding",
  );
  await act(async () => {
    jest.runAllTimers();
  });
  expect(container.querySelector(".contact-scene")).toHaveAttribute(
    "data-phase",
    "closed",
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    "Your full draft is ready",
  );
});
