import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const COMMANDS = [
  { command: "bold", label: "Bold", mark: "B" },
  { command: "italic", label: "Italic", mark: "I" },
  { command: "underline", label: "Underline", mark: "U" },
];

const RichTextEditor = forwardRef(function RichTextEditor(
  {
    id,
    ariaLabelledBy,
    ariaDescribedBy,
    disabled = false,
    hasError = false,
    onChange,
  },
  forwardedRef,
) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [pressedCommands, setPressedCommands] = useState({});

  const setEditorRef = useCallback(
    (element) => {
      editorRef.current = element;
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    },
    [forwardedRef],
  );

  const readPressedCommands = useCallback(() => {
    if (typeof document.queryCommandState !== "function") return;
    const next = {};
    COMMANDS.forEach(({ command }) => {
      try {
        next[command] = document.queryCommandState(command);
      } catch {
        next[command] = false;
      }
    });
    setPressedCommands(next);
  }, []);

  const rememberSelection = useCallback(() => {
    const editor = editorRef.current;
    const selection = window.getSelection?.();
    if (!editor || !selection?.rangeCount) return;
    if (!editor.contains(selection.anchorNode)) return;
    savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    readPressedCommands();
  }, [readPressedCommands]);

  useEffect(() => {
    document.addEventListener("selectionchange", rememberSelection);
    return () =>
      document.removeEventListener("selectionchange", rememberSelection);
  }, [rememberSelection]);

  const reportEdit = useCallback(() => {
    const editor = editorRef.current;
    if (editor) onChange?.(editor.innerHTML);
    readPressedCommands();
  }, [onChange, readPressedCommands]);

  const applyFormat = (command) => {
    const editor = editorRef.current;
    if (!editor || disabled) return;
    editor.focus({ preventScroll: true });

    const selection = window.getSelection?.();
    const savedRange = savedRangeRef.current;
    if (
      selection &&
      savedRange &&
      editor.contains(savedRange.commonAncestorContainer)
    ) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }

    try {
      document.execCommand?.(command, false);
    } catch {
      // The plain-text draft remains editable if a browser omits this command.
    }
    reportEdit();
    rememberSelection();
  };

  const insertPlainText = (text) => {
    if (!text) return;
    const editor = editorRef.current;
    const selection = window.getSelection?.();
    if (!editor || !selection) return;

    let range = null;
    if (
      savedRangeRef.current &&
      editor.contains(savedRangeRef.current.commonAncestorContainer)
    ) {
      range = savedRangeRef.current.cloneRange();
    } else if (selection.rangeCount && editor.contains(selection.anchorNode)) {
      range = selection.getRangeAt(0).cloneRange();
    }

    if (!range) {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    range.deleteContents();
    const pastedText = document.createTextNode(text);
    range.insertNode(pastedText);
    range.setStartAfter(pastedText);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    savedRangeRef.current = range.cloneRange();
    reportEdit();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    if (disabled) return;
    insertPlainText(event.clipboardData?.getData("text/plain") || "");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (disabled) return;
    // External HTML and dropped files stay outside the editor. The attachment
    // picker is the only supported path for adding files to this draft.
    insertPlainText(event.dataTransfer?.getData("text/plain") || "");
  };

  return (
    <div className={`contact-rich-editor ${hasError ? "has-error" : ""}`}>
      <div
        className="contact-editor-toolbar"
        role="toolbar"
        aria-label="Letter formatting"
      >
        {COMMANDS.map(({ command, label, mark }) => (
          <button
            key={command}
            type="button"
            className={`contact-format-button format-${command}`}
            aria-label={label}
            aria-pressed={Boolean(pressedCommands[command])}
            title={label}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyFormat(command)}
          >
            {mark}
          </button>
        ))}
        <span className="contact-toolbar-divider" aria-hidden="true" />
        <span className="contact-editor-hint">Select text to format</span>
      </div>
      <div
        ref={setEditorRef}
        id={id}
        className="contact-letter-body"
        role="textbox"
        aria-multiline="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={hasError}
        aria-required="true"
        aria-disabled={disabled}
        contentEditable={disabled ? "false" : "true"}
        data-placeholder="Write your note here…"
        spellCheck="true"
        suppressContentEditableWarning
        onInput={reportEdit}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onPaste={handlePaste}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      />
    </div>
  );
});

export default RichTextEditor;
