"use client";
// The paper's BibTeX as text, with a button that copies it.
import { useState } from "react";

export default function Bibtex({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="bibtex">
      <pre className="bibtex__code">
        <code>{text}</code>
      </pre>
      <button className="btn btn--secondary bibtex__copy" type="button" onClick={copy}>
        {copied ? "Copied" : "Copy BibTeX"}
      </button>
    </div>
  );
}
