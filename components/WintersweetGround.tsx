"use client";
// The hero's ground: the wintersweet painter on a canvas behind the words. On a wide screen a still poster
// (the section's own background, site.css) shows first and stays without script; once the canvas has painted
// it steps aside. On a desktop pointer the branch draws itself once and the blossoms answer the pointer, then
// everything rests; a phone and reduced motion get the finished painting, still, under the words.
import { useEffect, useRef } from "react";
import { WintersweetPainter, type Theme } from "@/lib/painter";

export default function WintersweetGround() {
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cvs.current;
    const hero = canvas?.closest("section");
    if (!canvas || !hero) return;
    const g = canvas.getContext("2d");
    if (!g) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches && innerWidth >= 640;
    const theme = () => ((document.documentElement.dataset.theme as Theme) || "light");
    const make = (w: number, h: number) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
    };
    const words = hero.querySelector(".hero__in > :first-child");
    const band = hero.querySelector(".hero__creds");
    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      const upright = r.width / r.height < 0.95;
      const shown = (el: Element | null) => (el && el.getBoundingClientRect().height > 0 ? el.getBoundingClientRect() : null);
      const b = shown(band);
      // held upright, the branch stays below the words and the band under them (their foot plus a gap);
      // on a wide screen it stays above the band at the hero's foot
      const foot = Math.max(words ? words.getBoundingClientRect().bottom : 0, b ? b.bottom : 0);
      const safeTop = upright && words ? foot - r.top + 28 : 0;
      const safeBottom = !upright && b ? b.top - r.top - 24 : 0;
      // the band's own boxes end short of the branch's side (its grid runs the full width)
      const right = b && band ? Math.max(...[...band.querySelectorAll(".cred__main, .cred__mark, .docs-row > li")].map((c) => c.getBoundingClientRect().right)) : 0;
      const safeRight = !upright && b ? right - r.left + 24 : 0;
      return { w: r.width, h: r.height, dpr, safeTop, safeBottom, safeRight };
    };
    let { w, h, dpr, safeTop, safeBottom, safeRight } = size();
    const painter = new WintersweetPainter({ width: w, height: h, dpr, safeTop, safeBottom, safeRight, theme: theme(), makeCanvas: make });

    let raf = 0, last = 0, intro = still || !fine ? 1 : 0, t0 = 0;
    const frame = (now: number) => {
      if (!t0) t0 = now;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (intro < 1) intro = Math.min(1, (now - t0) / 1000);
      const moving = painter.step(dt);
      painter.draw(g, intro);
      if (intro < 1 || moving) raf = requestAnimationFrame(frame);
      else { raf = 0; last = 0; }
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };
    hero.dataset.live = "true";
    if (intro < 1) wake();
    else painter.draw(g, 1);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      painter.setQuery({ x: e.clientX - r.left, y: e.clientY - r.top });
      wake();
    };
    const onLeave = () => { painter.setQuery(null); wake(); };
    if (fine && !still) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
    }
    const onTheme = () => { painter.setTheme(theme()); if (raf) return; painter.draw(g, 1); };
    window.addEventListener("jc-theme", onTheme);
    let rt = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(rt);
      rt = window.setTimeout(() => {
        ({ w, h, dpr, safeTop, safeBottom, safeRight } = size());
        painter.resize(w, h, dpr, safeTop, safeBottom, safeRight);
        if (!raf) painter.draw(g, 1);
      }, 120);
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("jc-theme", onTheme);
    };
  }, []);

  return <canvas className="hero__canvas" ref={cvs} aria-hidden="true" />;
}
