// Prints the hero's still posters (light and dark, wide and upright) from the same painter the page runs.
import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync } from "node:fs";
import { WintersweetPainter, type Theme } from "../lib/painter.ts";

const out = process.argv[2] ?? "public/images/hero";
mkdirSync(out, { recursive: true });
const BG: Record<Theme, string> = { light: "#F4F3EF", dark: "#141312" };
// the wide poster keeps the branch clear of the hero's foot band as the page lays it out at 1440 x 900 (its top
// at y 604 and its right end at x 1154, both with the page's 24px gap); the live canvas measures the band itself
const sizes: [string, number, number, number, number][] = [["wide", 1440, 900, 604, 1154], ["tall", 390, 844, 0, 0]];
const preview = process.argv.includes("--preview");
for (const theme of ["light", "dark"] as Theme[]) {
  for (const [name, w, h, safeBottom, safeRight] of sizes) {
    const dpr = name === "wide" ? 1.5 : 2;
    const c = createCanvas(Math.round(w * dpr), Math.round(h * dpr));
    const g = c.getContext("2d") as unknown as CanvasRenderingContext2D;
    const p = new WintersweetPainter({ width: w, height: h, dpr, safeBottom, safeRight, theme, makeCanvas: (a, b) => createCanvas(a, b) as never });
    if (preview) {
      // what a visitor sees with the pointer resting near the middle of the branch
      p.setQuery({ x: w * 0.74, y: name === "wide" ? h * 0.3 : h * 0.78 });
      for (let i = 0; i < 60; i++) p.step(1 / 60);
    }
    p.draw(g, 1);
    const file = `${out}/${theme}-${name}${preview ? "-q" : ""}`;
    if (preview) {
      const flat = createCanvas(c.width, c.height);
      const fg = flat.getContext("2d");
      fg.fillStyle = BG[theme];
      fg.fillRect(0, 0, c.width, c.height);
      fg.drawImage(c, 0, 0);
      writeFileSync(`${file}.png`, flat.toBuffer("image/png"));
    } else {
      writeFileSync(`${file}.webp`, await c.encode("webp", 82));
    }
  }
}
console.log("posters written to", out);
