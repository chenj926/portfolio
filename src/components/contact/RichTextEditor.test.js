import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import RichTextEditor from "./RichTextEditor";

test("paste inserts plaintext without rendering pasted markup", () => {
  render(
    <>
      <span id="letter-label">Letter content</span>
      <RichTextEditor id="letter-body" ariaLabelledBy="letter-label" />
    </>,
  );
  const editor = screen.getByRole("textbox", { name: "Letter content" });
  const pasted = '<img src=x onerror="alert(1)"> notes';

  fireEvent.paste(editor, {
    clipboardData: {
      getData: (type) => (type === "text/plain" ? pasted : "<img src=x>"),
    },
  });

  expect(editor.querySelector("img")).not.toBeInTheDocument();
  expect(editor).toHaveTextContent(pasted);
});

test("dropping files or HTML does not add them to the editable letter", () => {
  render(
    <>
      <span id="letter-label">Letter content</span>
      <RichTextEditor id="letter-body" ariaLabelledBy="letter-label" />
    </>,
  );
  const editor = screen.getByRole("textbox", { name: "Letter content" });
  const file = new File(["secret"], "secret.txt", { type: "text/plain" });

  fireEvent.drop(editor, {
    dataTransfer: {
      files: [file],
      getData: (type) =>
        type === "text/html" ? "<img src=x><b>unsafe</b>" : "",
    },
  });

  expect(editor).toBeEmptyDOMElement();
  expect(editor.querySelector("img, b")).not.toBeInTheDocument();
});
