"use client";
// The address as text with a Copy button: a mailto link fails where no mail app is set up.
import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      /* the browser refused: the address stays on screen to copy by hand */
    }
  }
  return (
    <span className="copy-email">
      <span className="copy-email__text">{email}</span>
      <button type="button" className="copy-email__btn" onClick={copy} aria-live="polite">
        {done ? "Copied" : "Copy address"}
      </button>
    </span>
  );
}
