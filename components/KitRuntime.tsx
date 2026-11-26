"use client";
// Loads the taste kit's own modules (the nav, the hover layer, the hero entrance, the moments) once React
// has hydrated the page, so the kit never edits a node React is still matching. The files are the kit's,
// unchanged, served from /assets.
import { useEffect } from "react";
import { url } from "@/lib/site";

const MODULES = ["/assets/system.js", "/assets/motion/motion.js", "/assets/layout/layout.js"];

export default function KitRuntime() {
  useEffect(() => {
    const w = window as unknown as { __kit?: boolean };
    if (w.__kit) return;
    w.__kit = true;
    for (const m of MODULES) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = url(m);
      document.body.appendChild(s);
    }
  }, []);
  return null;
}
