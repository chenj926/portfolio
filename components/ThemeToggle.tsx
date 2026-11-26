"use client";
// The grade, chosen by a click (system.md, Colour: the dark evening grade is tech only). The change spreads
// from the button like ink on paper where the browser can draw a view transition; elsewhere it is instant.
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) || "light");
  }, []);

  function apply(next: Theme) {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("jc-theme", next);
    } catch {
      /* storage refused: the tab's name below still carries the grade to the next page */
    }
    // the tab keeps the choice across pages even where storage is refused or forgotten (app/layout.tsx reads it)
    const rest = window.name.replace(/(?:^|;)jc-theme=(?:light|dark)/, "");
    window.name = `${rest ? `${rest};` : ""}jc-theme=${next}`;
    setTheme(next);
    window.dispatchEvent(new CustomEvent("jc-theme", { detail: next }));
  }

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || still) return apply(next);
    const r = e.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--ink-x", `${r.left + r.width / 2}px`);
    root.style.setProperty("--ink-y", `${r.top + r.height / 2}px`);
    root.dataset.inkTo = next;
    const vt = doc.startViewTransition(() => apply(next)) as { finished?: Promise<void> };
    vt.finished?.finally(() => delete root.dataset.inkTo);
  }

  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? "Switch to the light theme" : "Switch to the dark theme"}
      aria-pressed={dark}
    >
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        {dark ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" />
          </g>
        ) : (
          <path d="M15.6 12.4A6.5 6.5 0 0 1 7.6 4.4a6.5 6.5 0 1 0 8 8Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
